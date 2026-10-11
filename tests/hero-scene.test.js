// Mock out THREE.js, as we don't want to load a remote URL in our tests.
jest.mock("../assets/js/three.module.js", () => ({
  Scene: class Scene {
    constructor() {
      this.rotation = { x: 0, y: 0, z: 0 };
    }
    add() {}
  },
  PerspectiveCamera: class PerspectiveCamera {
    constructor() {
      this.position = { set: jest.fn() };
      this.aspect = 1;
      this.updateProjectionMatrix = jest.fn();
    }
  },
  WebGLRenderer: class WebGLRenderer {
    constructor({ canvas }) {
      if (global.throwWebGL) throw new Error('WebGL failed');
      this.canvas = canvas;
    }
    setPixelRatio() {}
    setSize() {}
    render() {}
  },
  CanvasTexture: class CanvasTexture {},
  Group: class Group {
    constructor() {
      this.rotation = { x: 0, y: 0, z: 0 };
    }
    add() {}
  },
  IcosahedronGeometry: class IcosahedronGeometry {
    constructor() {
      this.attributes = { position: { clone: () => ({}) } };
    }
  },
  LineSegments: class LineSegments {
    constructor() {
      this.rotation = { set: jest.fn(), copy: jest.fn(), x: 0, y: 0, z: 0 };
      this.position = { set: jest.fn(), copy: jest.fn(), x: 0, y: 0, z: 0 };
    }
  },
  EdgesGeometry: class EdgesGeometry {},
  LineBasicMaterial: class LineBasicMaterial {},
  BufferGeometry: class BufferGeometry { setAttribute() {} },
  BufferAttribute: class BufferAttribute {},
  Points: class Points {
    constructor() {
      this.rotation = { set: jest.fn(), copy: jest.fn(), x: 0, y: 0, z: 0 };
    }
  },
  PointsMaterial: class PointsMaterial {},
  OctahedronGeometry: class OctahedronGeometry {},
  TetrahedronGeometry: class TetrahedronGeometry {},
  TorusGeometry: class TorusGeometry {},
  BoxGeometry: class BoxGeometry {},
  Clock: class Clock { getElapsedTime() { return 1; } },
  AdditiveBlending: 'AdditiveBlending'
}), { virtual: true });

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
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
      createRadialGradient: jest.fn(() => ({
        addColorStop: jest.fn()
      })),
      fillRect: jest.fn()
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const setupCanvas = (mode = 'hero') => {
    document.body.innerHTML = `<div data-scene-wrapper><canvas data-signal-scene="${mode}"></canvas></div>`;
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
});
