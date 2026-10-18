/* =============================================================
   HERO-SCENE.JS — "Microbot swarm" hero
   Thousands of tiny bots that regroup into robotics and
   computer-vision formations, react to the pointer like a
   magnet and scatter on click.
   Mounts on any <canvas data-signal-scene="hero|compact">.
   Formation buttons: [data-swarm-formation] inside the hero.
   ============================================================= */

import * as THREE from "./three.module.js";

const REDUCE_MOTION = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

/* Gemini-like palette: blue → violet → rose, plus a cyan accent */
const PALETTE = [0x4285f4, 0x6f8cf6, 0x9b72cb, 0xc06fa0, 0xd96570, 0x2ee6d6];

const FORMATIONS = ["sphere", "lens", "lattice", "field"];
const LABELS = ["core", "vision", "lattice", "magnetic"];
const HOLD_SECONDS = 7;

/* ---------- Formation builders (local units, swarm radius ≈ 3) ---------- */

function sphereTargets(count) {
  const out = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const a = i * golden;
    const radius = 2.7 + (i % 7) * 0.018;
    out[i * 3] = Math.cos(a) * r * radius;
    out[i * 3 + 1] = y * radius;
    out[i * 3 + 2] = Math.sin(a) * r * radius;
  }
  return out;
}

/* Camera-aperture "lens": concentric rings plus six curved iris blades */
function lensTargets(count) {
  const out = new Float32Array(count * 3);
  const ringShare = Math.floor(count * 0.62);
  const rings = [0.55, 1.15, 1.85, 2.55, 3.2];
  for (let i = 0; i < count; i++) {
    let x;
    let y;
    let z;
    if (i < ringShare) {
      const ring = rings[i % rings.length];
      const a = (i / ringShare) * Math.PI * 2 * 7.13;
      x = Math.cos(a) * ring;
      y = Math.sin(a) * ring;
      z = (ring - 1.8) * -0.25;
    } else {
      const k = i - ringShare;
      const blade = k % 6;
      const s = (k / (count - ringShare)) % 1;
      const r = 0.7 + s * 2.3;
      const a = (blade / 6) * Math.PI * 2 + s * 1.1;
      x = Math.cos(a) * r;
      y = Math.sin(a) * r;
      z = 0.15;
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

/* Voxel lattice: bots stack into the edges and faces of a modular cube */
function latticeTargets(count) {
  const out = new Float32Array(count * 3);
  const n = 9;
  const size = 3.9;
  const step = size / (n - 1);
  const cells = [];
  for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) {
      for (let z = 0; z < n; z++) {
        const onX = x === 0 || x === n - 1;
        const onY = y === 0 || y === n - 1;
        const onZ = z === 0 || z === n - 1;
        const edges = Number(onX) + Number(onY) + Number(onZ);
        if (edges >= 1) cells.push([x, y, z, edges]);
      }
    }
  }
  for (let i = 0; i < count; i++) {
    const [x, y, z, edges] = cells[i % cells.length];
    const layer = Math.floor(i / cells.length);
    const jitter = edges >= 2 ? 0.0 : 0.05;
    out[i * 3] = x * step - size / 2 + Math.sin(i) * jitter;
    out[i * 3 + 1] = y * step - size / 2 + Math.cos(i * 1.7) * jitter;
    out[i * 3 + 2] = z * step - size / 2 + layer * 0.03;
  }
  return out;
}

/* Magnetic dipole field lines: r = L·sin²θ, bots flow along each loop */
function fieldParams(count) {
  const lines = 14;
  const shells = [1.5, 2.3, 3.1];
  const params = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    params[i * 3] = shells[i % shells.length];
    params[i * 3 + 1] = ((i % lines) / lines) * Math.PI * 2;
    params[i * 3 + 2] = (i * 0.618034) % 1;
  }
  return params;
}

function fieldTargets(params, out, time) {
  const count = params.length / 3;
  for (let i = 0; i < count; i++) {
    const L = params[i * 3];
    const phi = params[i * 3 + 1];
    const s = (params[i * 3 + 2] + time * 0.035) % 1;
    const theta = 0.12 * Math.PI + s * 0.76 * Math.PI;
    const sinT = Math.sin(theta);
    const r = L * sinT * sinT;
    out[i * 3] = r * sinT * Math.cos(phi);
    out[i * 3 + 1] = r * Math.cos(theta) * 1.25;
    out[i * 3 + 2] = r * sinT * Math.sin(phi);
  }
  return out;
}

/* ---------- Shaders: soft rounded "bot" sprites ---------- */

const VERTEX = `
  attribute vec3 color;
  attribute float size;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vDepth;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * uPixelRatio * (36.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
    vColor = color;
    vDepth = clamp((14.0 + mv.z) / 7.0, 0.35, 1.0);
  }
`;

const FRAGMENT = `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vDepth;
  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float d = length(p);
    float body = smoothstep(0.5, 0.22, d);
    float core = smoothstep(0.18, 0.0, d);
    vec3 col = mix(vColor, vec3(1.0), core * 0.55);
    gl_FragColor = vec4(col, body * vDepth * uOpacity);
  }
`;

/* ---------- Scene ---------- */

function initScene(canvas) {
  const isCompact = canvas.dataset.signalScene === "compact";
  const hero = canvas.closest(".hero") || canvas.parentElement;
  const narrow = window.innerWidth < 760;
  const count = isCompact || narrow ? 1100 : 2400;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (err) {
    canvas.closest("[data-scene-wrapper]")?.classList.add("scene-fallback");
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 11);

  const swarm = new THREE.Group();
  scene.add(swarm);

  /* Targets for each formation */
  const targets = {
    sphere: sphereTargets(count),
    lens: lensTargets(count),
    lattice: latticeTargets(count),
    field: new Float32Array(count * 3),
  };
  const params = fieldParams(count);
  fieldTargets(params, targets.field, 0);

  /* Particle state */
  const positions = new Float32Array(count * 3);
  const velocity = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const delay = new Float32Array(count);
  const color = new THREE.Color();
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    color.setHex(PALETTE[i % PALETTE.length]);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
    sizes[i] = 0.9 + Math.random() * 1.3;
    delay[i] = Math.random() * 0.9;
  }

  const geometry = new THREE.BufferGeometry();
  const positionAttr = new THREE.BufferAttribute(positions, 3);
  if (positionAttr.setUsage) positionAttr.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute("position", positionAttr);
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const isLight = () => document.documentElement.getAttribute("data-theme") === "light";
  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: isLight() ? THREE.NormalBlending : THREE.AdditiveBlending,
    uniforms: {
      uPixelRatio: { value: renderer.getPixelRatio ? renderer.getPixelRatio() : 1 },
      uOpacity: { value: isLight() ? 0.85 : 0.95 },
    },
  });
  const points = new THREE.Points(geometry, material);
  swarm.add(points);

  /* Follow theme changes */
  if ("MutationObserver" in window) {
    new MutationObserver(() => {
      material.blending = isLight() ? THREE.NormalBlending : THREE.AdditiveBlending;
      material.uniforms.uOpacity.value = isLight() ? 0.85 : 0.95;
      material.needsUpdate = true;
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }

  /* ---------- Formation control ---------- */
  const clock = new THREE.Clock();
  let formation = 0;
  let previous = 0;
  let switchedAt = 0;
  let manualUntil = 0;
  const buttons = Array.from(hero.querySelectorAll("[data-swarm-formation]"));
  const label = hero.querySelector("[data-swarm-label]");

  function setFormation(index, manual) {
    if (index === formation) return;
    previous = formation;
    formation = index;
    switchedAt = clock.getElapsedTime();
    if (manual) manualUntil = switchedAt + HOLD_SECONDS * 2;
    buttons.forEach((b, n) => b.setAttribute("aria-pressed", String(n === index)));
    if (label) label.textContent = LABELS[index];
  }
  buttons.forEach((b, n) => b.addEventListener("click", () => setFormation(n, true)));

  /* ---------- Pointer: magnetic swirl + click pulse ---------- */
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2(9, 9);
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const hit = new THREE.Vector3();
  const local = new THREE.Vector3();
  let pointerActive = false;
  let pulse = 0;
  let tiltX = 0;
  let tiltY = 0;

  function updatePointer(e) {
    const rect = canvas.getBoundingClientRect();
    ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    tiltY = ndc.x * 0.35;
    tiltX = -ndc.y * 0.2;
    pointerActive = true;
    hero.style.setProperty("--mx", `${e.clientX - hero.getBoundingClientRect().left}px`);
    hero.style.setProperty("--my", `${e.clientY - hero.getBoundingClientRect().top}px`);
  }

  if (!REDUCE_MOTION) {
    hero.addEventListener("pointermove", updatePointer, { passive: true });
    hero.addEventListener("pointerleave", () => {
      pointerActive = false;
      hero.classList.remove("is-tracking");
    });
    hero.addEventListener("pointerenter", () => hero.classList.add("is-tracking"));
    hero.addEventListener("pointerdown", (e) => {
      if (e.target.closest("a, button, input, select, textarea")) return;
      updatePointer(e);
      pulse = 1;
    });
  }

  /* ---------- Layout ---------- */
  function layout() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const width = Math.max(rect.width, 1);
    const height = Math.max(rect.height, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    const wide = width > 900;
    swarm.position.x = wide && !isCompact ? Math.min(4.4, 1.1 + camera.aspect * 1.9) : 0;
    swarm.position.y = wide ? 0.2 : 1.2;
    swarm.scale.setScalar(wide ? 0.86 : 0.72);
  }
  layout();
  window.addEventListener("resize", layout);

  let isVisible = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
      });
    }).observe(canvas);
  }

  /* ---------- Simulation ---------- */
  function step(t) {
    const elapsed = t - switchedAt;
    if (formation === 3 || previous === 3) fieldTargets(params, targets.field, t);
    const from = targets[FORMATIONS[previous]];
    const to = targets[FORMATIONS[formation]];

    let px = 0;
    let py = 0;
    let pz = 0;
    if (pointerActive) {
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.ray.intersectPlane(plane, hit)) {
        local.copy(hit);
        swarm.worldToLocal(local);
        px = local.x;
        py = local.y;
        pz = local.z;
      }
    }

    for (let i = 0; i < count; i++) {
      const k = i * 3;
      const goal = elapsed > delay[i] ? to : from;
      let vx = velocity[k] + (goal[k] - positions[k]) * 0.032;
      let vy = velocity[k + 1] + (goal[k + 1] - positions[k + 1]) * 0.032;
      let vz = velocity[k + 2] + (goal[k + 2] - positions[k + 2]) * 0.032;

      // Living swarm: tiny idle wobble
      vx += Math.sin(t * 1.3 + i) * 0.0009;
      vy += Math.cos(t * 1.1 + i * 0.7) * 0.0009;

      if (pointerActive) {
        const dx = positions[k] - px;
        const dy = positions[k + 1] - py;
        const dz = positions[k + 2] - pz;
        const d2 = dx * dx + dy * dy + dz * dz;
        const radius = 1.7 + pulse * 3.5;
        if (d2 < radius * radius && d2 > 0.0001) {
          const d = Math.sqrt(d2);
          const fall = 1 - d / radius;
          const push = fall * fall * (0.06 + pulse * 0.45);
          vx += (dx / d) * push - (dy / d) * fall * 0.035; // repel + magnetic swirl
          vy += (dy / d) * push + (dx / d) * fall * 0.035;
          vz += (dz / d) * push;
        }
      }

      velocity[k] = vx * 0.86;
      velocity[k + 1] = vy * 0.86;
      velocity[k + 2] = vz * 0.86;
      positions[k] += velocity[k];
      positions[k + 1] += velocity[k + 1];
      positions[k + 2] += velocity[k + 2];
    }
    positionAttr.needsUpdate = true;
    pulse *= 0.9;

    const spin = formation === 1 ? 0.15 : 0.12;
    swarm.rotation.y += ((formation === 1 ? 0 : t * spin) + tiltY - swarm.rotation.y) * 0.05;
    swarm.rotation.x += (tiltX + (formation === 2 ? 0.45 : 0.1) - swarm.rotation.x) * 0.05;
    if (formation === 1) swarm.rotation.z = t * 0.12;
    else swarm.rotation.z *= 0.95;
  }

  function frame() {
    requestAnimationFrame(frame);
    if (document.hidden || !isVisible) return;
    const t = clock.getElapsedTime();
    if (t > manualUntil && t - switchedAt > HOLD_SECONDS) {
      setFormation((formation + 1) % FORMATIONS.length, false);
    }
    step(t);
    renderer.render(scene, camera);
  }

  if (REDUCE_MOTION) {
    // Still frame: settle into the sphere instantly
    positions.set(targets.sphere);
    swarm.rotation.set(0.15, -0.4, 0);
    positionAttr.needsUpdate = true;
    renderer.render(scene, camera);
    buttons.forEach((b, n) =>
      b.addEventListener("click", () => {
        positions.set(targets[FORMATIONS[n]]);
        positionAttr.needsUpdate = true;
        renderer.render(scene, camera);
      }),
    );
  } else {
    frame();
  }
}

function boot() {
  document.querySelectorAll("[data-signal-scene]").forEach((canvas) => {
    try {
      initScene(canvas);
    } catch (err) {
      canvas.closest("[data-scene-wrapper]")?.classList.add("scene-fallback");
    }
  });
}

if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  boot();
} else {
  document.addEventListener("DOMContentLoaded", boot);
}
