describe('main.js rotator', () => {
  beforeEach(() => {
    // Clear module cache to re-evaluate main.js for each test
    jest.resetModules();

    // We mock matchMedia since it's used globally in main.js
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
  });

  it('handles invalid JSON in data-rotator gracefully', () => {
    // Set up the DOM with malformed JSON
    document.body.innerHTML = '<div data-rotator="invalid { json">Original Text</div>';

    // Execution should not throw
    expect(() => {
      require('../assets/js/main.js');
    }).not.toThrow();

    // With invalid JSON, words becomes an empty array, so no animation is started
    // The text content should remain unchanged
    const rotator = document.querySelector('[data-rotator]');
    expect(rotator.textContent).toBe('Original Text');
  });

  it('works with valid JSON', () => {
    // Just a sanity check for the happy path
    document.body.innerHTML = '<div data-rotator=\'["First", "Second"]\'>Original Text</div>';

    // Execution should not throw
    expect(() => {
      require('../assets/js/main.js');
    }).not.toThrow();

    // Since reduceMotion is false by our mock, the script sets textContent to "" immediately
    const rotator = document.querySelector('[data-rotator]');
    expect(rotator.textContent).toBe('');
  });

  it('handles empty data-rotator attribute', () => {
    // Set up the DOM with empty attribute
    document.body.innerHTML = '<div data-rotator="">Original Text</div>';

    // Execution should not throw
    expect(() => {
      require('../assets/js/main.js');
    }).not.toThrow();

    // With empty JSON, JSON.parse throws and fallback to [], text unchanged
    const rotator = document.querySelector('[data-rotator]');
    expect(rotator.textContent).toBe('Original Text');
  });

  it('handles missing data-rotator attribute gracefully', () => {
    // Set up the DOM with missing attribute
    document.body.innerHTML = '<div>Original Text</div>';

    // Execution should not throw
    expect(() => {
      require('../assets/js/main.js');
    }).not.toThrow();

    // Text content should remain unchanged since there is no rotator
    const div = document.querySelector('div');
    expect(div.textContent).toBe('Original Text');
  });
});

describe('normalizeRoute', () => {
  let normalizeRoute;

  beforeEach(() => {
    // Clear module cache to re-evaluate main.js for each test
    jest.resetModules();

    // We mock matchMedia since it's used globally in main.js
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

    const main = require('../assets/js/main.js');
    normalizeRoute = main.normalizeRoute;
  });

  it('normalizes the root path to index', () => {
    expect(normalizeRoute('/')).toBe('index');
    expect(normalizeRoute('')).toBe('index');
    expect(normalizeRoute(null)).toBe('index');
    expect(normalizeRoute(undefined)).toBe('index');
  });

  it('normalizes basic paths', () => {
    expect(normalizeRoute('/about')).toBe('about');
    expect(normalizeRoute('/projects/')).toBe('projects');
  });

  it('handles deeply nested paths by taking the last segment', () => {
    expect(normalizeRoute('/blog/2023/10/my-post')).toBe('my-post');
    expect(normalizeRoute('/blog/2023/10/my-post/')).toBe('my-post');
  });

  it('strips .html extension', () => {
    expect(normalizeRoute('/about.html')).toBe('about');
    expect(normalizeRoute('index.html')).toBe('index');
    expect(normalizeRoute('/projects/some-project.html')).toBe('some-project');
  });

  it('strips query parameters', () => {
    expect(normalizeRoute('/about?ref=twitter')).toBe('about');
    expect(normalizeRoute('/blog.html?page=2')).toBe('blog');
  });

  it('strips hash fragments', () => {
    expect(normalizeRoute('/about#team')).toBe('about');
    expect(normalizeRoute('/projects.html#details')).toBe('projects');
  });

  it('handles query parameters and hash fragments together', () => {
    expect(normalizeRoute('/about.html?ref=twitter#team')).toBe('about');
    expect(normalizeRoute('/projects?id=123#test')).toBe('projects');
    expect(normalizeRoute('/#main')).toBe('index');
    expect(normalizeRoute('/?search=term')).toBe('index');
  });

  it('is case insensitive regarding .html', () => {
    expect(normalizeRoute('/about.HTML')).toBe('about');
    expect(normalizeRoute('/about.HtMl')).toBe('about');
  });
});
