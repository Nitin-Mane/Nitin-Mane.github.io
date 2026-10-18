// Mock out THREE.js, as we don't want to load a remote URL in our tests.
jest.mock("../assets/js/three.module.js", () => {
  const vec = () => ({ x: 0, y: 0, z: 0, set: jest.fn(), copy() { return this; }, setScalar: jest.fn() });
  return {
    Scene: class Scene { add() {} },
    PerspectiveCamera: class PerspectiveCamera {
      constructor() { this.position = vec(); this.aspect = 1; this.updateProjectionMatrix = jest.fn(); }
    },
    WebGLRenderer: class WebGLRenderer {
      constructor({ canvas }) { if (global.throwWebGL) throw new Error('WebGL failed'); this.canvas = canvas; global.renderCount = 0; }
      setPixelRatio() {}
      getPixelRatio() { return 1; }
      setSize() {}
      render() { global.renderCount += 1; }
    },
    Group: class Group {
      constructor() { this.position = vec(); this.rotation = vec(); this.scale = vec(); }
      add() {}
      worldToLocal(v) { return v; }
    },
    BufferGeometry: class BufferGeometry { setAttribute() {} },
    BufferAttribute: class BufferAttribute { setUsage() {} },
    ShaderMaterial: class ShaderMaterial { constructor(o) { Object.assign(this, o); } },
    Points: class Points {},
    Color: class Color { setHex() { this.r = 1; this.g = 1; this.b = 1; return this; } },
    Vector2: class Vector2 { constructor(x = 0, y = 0) { this.x = x; this.y = y; } },
    Vector3: class Vector3 { constructor() { Object.assign(this, vec()); } },
    Plane: class Plane {},
    Raycaster: class Raycaster { constructor() { this.ray = { intersectPlane: () => null }; } setFromCamera() {} },
    Clock: class Clock { getElapsedTime() { return 1; } },
    AdditiveBlending: 'AdditiveBlending',
    NormalBlending: 'NormalBlending',
    DynamicDrawUsage: 'DynamicDrawUsage',
  };
}, { virtual: true });

describe('hero-scene', () => {
  beforeEach(() => {
    jest.resetModules();
    global.throwWebGL = false;

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    // Mock IntersectionObserver
    class IntersectionObserver {
      constructor(callback, options) {
        this.callback = callback;
        this.options = options;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      value: IntersectionObserver,
    });

    // Mock requestAnimationFrame
    window.requestAnimationFrame = jest.fn();

    // Mock canvas getContext
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const setupCanvas = (mode = 'hero') => {
    document.body.innerHTML = `<section class="hero"><div data-scene-wrapper><canvas data-signal-scene="${mode}"></canvas></div>
      <span data-swarm-label>core</span>
      <button data-swarm-formation aria-pressed="true">Core</button>
      <button data-swarm-formation aria-pressed="false">Vision</button>
      <button data-swarm-formation aria-pressed="false">Lattice</button>
      <button data-swarm-formation aria-pressed="false">Magnetic</button></section>`;
    const canvas = document.querySelector('canvas');
    canvas.parentElement.getBoundingClientRect = () => ({ width: 800, height: 600 });
    return canvas;
  };

  it('initializes the scene when DOM is loaded', () => {
    setupCanvas();
    require('../assets/js/hero-scene.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    const wrapper = document.querySelector('[data-scene-wrapper]');
    expect(wrapper.classList.contains('scene-fallback')).toBe(false);
  });

  it('adds fallback class if WebGL fails', () => {
    setupCanvas();
    global.throwWebGL = true;
    require('../assets/js/hero-scene.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    const wrapper = document.querySelector('[data-scene-wrapper]');
    expect(wrapper.classList.contains('scene-fallback')).toBe(true);
  });

  it('initializes compact mode correctly', () => {
    setupCanvas('compact');
    require('../assets/js/hero-scene.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    const wrapper = document.querySelector('[data-scene-wrapper]');
    expect(wrapper.classList.contains('scene-fallback')).toBe(false);
  });

  it('switches swarm formation from the buttons', () => {
    setupCanvas();
    require('../assets/js/hero-scene.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    const buttons = document.querySelectorAll('[data-swarm-formation]');
    buttons[3].click();
    expect(buttons[3].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[0].getAttribute('aria-pressed')).toBe('false');
    expect(document.querySelector('[data-swarm-label]').textContent).toBe('magnetic');
  });

  it('renders a single still frame when reduced motion is requested', () => {
    window.matchMedia = jest.fn().mockImplementation(q => ({ matches: true, media: q, addEventListener: jest.fn(), removeEventListener: jest.fn(), addListener: jest.fn(), removeListener: jest.fn() }));
    setupCanvas();
    require('../assets/js/hero-scene.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    expect(global.renderCount).toBe(1);
  });
});
