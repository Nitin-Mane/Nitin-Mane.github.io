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
});
