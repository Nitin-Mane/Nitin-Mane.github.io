/* =============================================================
   HERO-SCENE.JS — Three.js "signal core" wireframe scene
   Mounts on any <canvas data-signal-scene="hero|compact">
   ============================================================= */

import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

const REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function createGlowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.35, "rgba(255,255,255,0.55)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function initScene(canvas) {
  const mode = canvas.dataset.signalScene || "hero";
  const isCompact = mode === "compact";

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, isCompact ? 8.5 : 11);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (err) {
    canvas.closest("[data-scene-wrapper]")?.classList.add("scene-fallback");
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

  const glowTexture = createGlowTexture();

  /* ---------- Core: nested wireframe polyhedra ---------- */
  const core = new THREE.Group();
  scene.add(core);

  const outerGeo = new THREE.IcosahedronGeometry(isCompact ? 2.0 : 2.6, 1);
  const outerLines = new THREE.LineSegments(
    new THREE.EdgesGeometry(outerGeo),
    new THREE.LineBasicMaterial({ color: 0x2ee6d6, transparent: true, opacity: 0.55 })
  );
  core.add(outerLines);

  const innerGeo = new THREE.IcosahedronGeometry(isCompact ? 1.1 : 1.5, 0);
  const innerLines = new THREE.LineSegments(
    new THREE.EdgesGeometry(innerGeo),
    new THREE.LineBasicMaterial({ color: 0xffb454, transparent: true, opacity: 0.32 })
  );
  core.add(innerLines);

  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute("position", outerGeo.attributes.position.clone());
  const corePoints = new THREE.Points(
    pointsGeo,
    new THREE.PointsMaterial({
      size: isCompact ? 0.14 : 0.18,
      map: glowTexture,
      transparent: true,
      depthWrite: false,
      color: 0x9ff7ee,
      blending: THREE.AdditiveBlending,
    })
  );
  core.add(corePoints);

  /* ---------- Satellites: orbiting modular shapes ---------- */
  const satellites = [];
  const satelliteDefs = isCompact
    ? [
        { geo: new THREE.OctahedronGeometry(0.32), color: 0xffb454, radius: 3.4, speed: 0.55, tilt: 0.4 },
        { geo: new THREE.TetrahedronGeometry(0.3), color: 0x2ee6d6, radius: 4.1, speed: -0.4, tilt: -0.5 },
      ]
    : [
        { geo: new THREE.OctahedronGeometry(0.45), color: 0xffb454, radius: 4.4, speed: 0.55, tilt: 0.4 },
        { geo: new THREE.TetrahedronGeometry(0.4), color: 0x2ee6d6, radius: 5.4, speed: -0.4, tilt: -0.55 },
        { geo: new THREE.TorusGeometry(0.4, 0.12, 8, 24), color: 0xb48bff, radius: 6.2, speed: 0.32, tilt: 0.25 },
        { geo: new THREE.BoxGeometry(0.5, 0.5, 0.5), color: 0x2ee6d6, radius: 3.4, speed: -0.7, tilt: 0.8 },
      ];

  satelliteDefs.forEach((def, i) => {
    const mesh = new THREE.LineSegments(
      new THREE.EdgesGeometry(def.geo),
      new THREE.LineBasicMaterial({ color: def.color, transparent: true, opacity: 0.85 })
    );
    scene.add(mesh);
    satellites.push({ mesh, ...def, offset: i * 1.45 });
  });

  /* ---------- Starfield ---------- */
  const starCount = isCompact ? 220 : 650;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const r = 13 + Math.random() * 20;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPositions[i * 3 + 2] = r * Math.cos(phi);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({
      size: 0.05,
      color: 0x8fa8c8,
      map: glowTexture,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  scene.add(stars);

  /* ---------- Pointer parallax ---------- */
  let targetRotX = 0;
  let targetRotY = 0;
  if (!REDUCE_MOTION) {
    window.addEventListener(
      "pointermove",
      (e) => {
        targetRotY = ((e.clientX / window.innerWidth) * 2 - 1) * 0.28;
        targetRotX = ((e.clientY / window.innerHeight) * 2 - 1) * 0.18;
      },
      { passive: true }
    );
  }

  /* ---------- Resize ---------- */
  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const width = Math.max(rect.width, 1);
    const height = Math.max(rect.height, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  /* ---------- Visibility ---------- */
  let isVisible = true;
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
      });
    });
    io.observe(canvas);
  }

  /* ---------- Animate ---------- */
  const clock = new THREE.Clock();

  function frame() {
    requestAnimationFrame(frame);
    if (document.hidden || !isVisible) return;
    const t = clock.getElapsedTime();

    outerLines.rotation.set(t * 0.05, t * 0.08, 0);
    innerLines.rotation.set(-t * 0.06, -t * 0.12, 0);
    corePoints.rotation.copy(outerLines.rotation);

    satellites.forEach((sat) => {
      const angle = t * sat.speed + sat.offset;
      sat.mesh.position.set(
        Math.cos(angle) * sat.radius,
        Math.sin(angle * 0.6) * sat.radius * 0.3 * sat.tilt,
        Math.sin(angle) * sat.radius
      );
      sat.mesh.rotation.set(t * 0.6, t * 0.4, 0);
    });

    stars.rotation.y = t * 0.01;

    core.rotation.x += (targetRotX - core.rotation.x) * 0.04;
    core.rotation.y += (targetRotY - core.rotation.y) * 0.04;
    scene.rotation.y += (targetRotY * 0.35 - scene.rotation.y) * 0.02;

    renderer.render(scene, camera);
  }

  renderer.render(scene, camera);
  if (!REDUCE_MOTION) frame();
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

if (document.readyState === "complete" || document.readyState === "interactive") {
  boot();
} else {
  document.addEventListener("DOMContentLoaded", boot);
}
