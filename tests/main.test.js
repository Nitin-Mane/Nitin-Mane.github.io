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

describe('initCopyEmail', () => {
  let writeTextMock;

  beforeEach(() => {
    jest.resetModules();
    jest.useFakeTimers();

    writeTextMock = jest.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

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

  afterEach(() => {
    jest.useRealTimers();
  });

  it('handles clipboard copy failure gracefully', async () => {
    document.body.innerHTML = `
      <button data-copy="test@example.com">
        <span data-copy-label>Copy</span>
      </button>
    `;

    writeTextMock.mockRejectedValueOnce(new Error('Clipboard error'));

    require('../assets/js/main.js');

    const btn = document.querySelector('[data-copy]');
    const label = document.querySelector('[data-copy-label]');

    // Fire click
    btn.dispatchEvent(new window.MouseEvent('click'));

    // Wait for promises to flush
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();

    expect(writeTextMock).toHaveBeenCalledWith('test@example.com');
    expect(label.textContent).toBe('Failed to copy');

    // Advance timer to test resetting text
    jest.advanceTimersByTime(1800);
    expect(label.textContent).toBe('Copy');
  });
});


describe('initNavToggle', () => {
  beforeEach(() => {
    jest.resetModules();
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

    // Clear document body overflow
    document.body.style.overflow = '';
  });

  it('handles missing DOM elements gracefully', () => {
    document.body.innerHTML = '<div></div>';

    expect(() => {
      require('../assets/js/main.js');
    }).not.toThrow();
  });

  it('toggles mobile navigation on button click', () => {
    document.body.innerHTML = `
      <button class="nav__toggle" aria-expanded="false"></button>
      <div class="nav__links"></div>
    `;

    require('../assets/js/main.js');

    const navToggle = document.querySelector('.nav__toggle');
    const navLinks = document.querySelector('.nav__links');

    // Initially not open
    expect(navLinks.classList.contains('is-open')).toBe(false);

    // Click to open
    navToggle.dispatchEvent(new window.MouseEvent('click'));
    expect(navLinks.classList.contains('is-open')).toBe(true);
    expect(navToggle.getAttribute('aria-expanded')).toBe('true');
    expect(document.body.style.overflow).toBe('hidden');

    // Click to close
    navToggle.dispatchEvent(new window.MouseEvent('click'));
    expect(navLinks.classList.contains('is-open')).toBe(false);
    expect(navToggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.body.style.overflow).toBe('');
  });

  it('closes mobile navigation when a link is clicked', () => {
    document.body.innerHTML = `
      <button class="nav__toggle" aria-expanded="false"></button>
      <div class="nav__links">
        <a href="#about" class="nav-link">About</a>
        <a href="#contact" class="nav-link">Contact</a>
      </div>
    `;

    require('../assets/js/main.js');

    const navToggle = document.querySelector('.nav__toggle');
    const navLinks = document.querySelector('.nav__links');
    const links = document.querySelectorAll('.nav__links a');

    // Open first
    navToggle.dispatchEvent(new window.MouseEvent('click'));
    expect(navLinks.classList.contains('is-open')).toBe(true);

    // Click a link
    links[0].dispatchEvent(new window.MouseEvent('click'));
    expect(navLinks.classList.contains('is-open')).toBe(false);
    expect(navToggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.body.style.overflow).toBe('');
  });

  const groupedNav = `
    <nav class="nav__links">
      <div class="nav__group" id="g1">
        <button class="nav__link nav__group-toggle" aria-expanded="false">About</button>
        <div class="nav__menu"><a href="about" class="nav__menu-link">About Me</a></div>
      </div>
      <div class="nav__group" id="g2">
        <button class="nav__link nav__group-toggle" aria-expanded="false">Work</button>
        <div class="nav__menu"><a href="projects" class="nav__menu-link">Projects</a></div>
      </div>
    </nav>
    <p id="outside">Outside</p>
  `;

  it('opens one nav group at a time', () => {
    document.body.innerHTML = groupedNav;
    require('../assets/js/main.js');

    const [t1, t2] = document.querySelectorAll('.nav__group-toggle');
    const g1 = document.getElementById('g1');
    const g2 = document.getElementById('g2');

    t1.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    expect(g1.classList.contains('is-open')).toBe(true);
    expect(t1.getAttribute('aria-expanded')).toBe('true');

    t2.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    expect(g1.classList.contains('is-open')).toBe(false);
    expect(g2.classList.contains('is-open')).toBe(true);

    t2.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    expect(g2.classList.contains('is-open')).toBe(false);
    expect(t2.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes nav groups on outside click and Escape', () => {
    document.body.innerHTML = groupedNav;
    require('../assets/js/main.js');

    const t1 = document.querySelector('.nav__group-toggle');
    const g1 = document.getElementById('g1');

    t1.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    document.getElementById('outside').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    expect(g1.classList.contains('is-open')).toBe(false);

    t1.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
    expect(g1.classList.contains('is-open')).toBe(false);
    expect(t1.getAttribute('aria-expanded')).toBe('false');
  });

  it('marks the group of the current page as active, not the toggle buttons', () => {
    window.history.pushState({}, '', '/projects');
    document.body.innerHTML = groupedNav;
    require('../assets/js/main.js');

    const [t1, t2] = document.querySelectorAll('.nav__group-toggle');
    expect(document.querySelector('a[href="projects"]').classList.contains('is-active')).toBe(true);
    expect(t2.classList.contains('is-active')).toBe(true);
    expect(t1.classList.contains('is-active')).toBe(false);
    window.history.pushState({}, '', '/');
  });
});

describe('initFooterYear', () => {
  beforeEach(() => {
    jest.resetModules();
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

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('updates elements with data-year attribute to current year', () => {
    // Mock Date to return a fixed year
    const mockDate = new Date('2024-01-01T00:00:00Z');
    const spy = jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    // Setup DOM
    document.body.innerHTML = `
      <footer>
        <p>Copyright <span data-year>2020</span></p>
        <p>Also <span data-year></span></p>
      </footer>
    `;

    require('../assets/js/main.js');

    const yearElements = document.querySelectorAll('[data-year]');
    expect(yearElements.length).toBe(2);
    expect(yearElements[0].textContent).toBe('2024');
    expect(yearElements[1].textContent).toBe('2024');

    spy.mockRestore();
  });

  it('does nothing if no data-year elements exist', () => {
    document.body.innerHTML = `
      <footer>
        <p>No year element here</p>
      </footer>
    `;

    expect(() => {
      require('../assets/js/main.js');
    }).not.toThrow();
  });
});

describe('session reel', () => {
  beforeEach(() => {
    jest.resetModules();
    window.matchMedia = jest.fn().mockImplementation((q) => ({ matches: false, media: q, addEventListener: jest.fn(), removeEventListener: jest.fn(), addListener: jest.fn(), removeListener: jest.fn() }));
    document.body.innerHTML = `
      <div class="reel" data-reel>
        <button class="reel__tab is-active" aria-controls="p1" aria-selected="true"><span class="reel__progress"></span></button>
        <button class="reel__tab" aria-controls="p2" aria-selected="false"><span class="reel__progress"></span></button>
        <figure id="p1" class="reel__panel is-active"></figure>
        <figure id="p2" class="reel__panel" inert></figure>
        <span data-reel-index>01</span>
      </div>`;
    require('../assets/js/main.js');
  });

  it('switches panels on tab click and updates the counter', () => {
    const [t1, t2] = document.querySelectorAll('.reel__tab');
    t2.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    expect(t2.getAttribute('aria-selected')).toBe('true');
    expect(t1.getAttribute('aria-selected')).toBe('false');
    expect(document.getElementById('p2').classList.contains('is-active')).toBe(true);
    expect(document.getElementById('p1').hasAttribute('inert')).toBe(true);
    expect(document.querySelector('[data-reel-index]').textContent).toBe('02');
  });

  it('advances when the progress animation ends and wraps around', () => {
    const progress = document.querySelectorAll('.reel__progress');
    progress[0].dispatchEvent(new window.Event('animationend'));
    expect(document.getElementById('p2').classList.contains('is-active')).toBe(true);
    progress[1].dispatchEvent(new window.Event('animationend'));
    expect(document.getElementById('p1').classList.contains('is-active')).toBe(true);
  });

  it('supports arrow-key navigation', () => {
    const [t1] = document.querySelectorAll('.reel__tab');
    t1.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.getElementById('p2').classList.contains('is-active')).toBe(true);
  });
});
