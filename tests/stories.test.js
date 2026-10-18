const fs = require('fs');
const path = require('path');

// Exercise what visitors see: combined filters, empty states, sorting and shared URLs.
describe('portfolio story explorer', () => {
  beforeEach(() => {
    jest.resetModules();
    history.replaceState(null, '', '/speakers');
    document.body.innerHTML = `
      <section data-story-collection>
        <div data-story-controls hidden>
          <input data-story-search type="search">
          <button data-topic="all" aria-pressed="true">All</button>
          <button data-topic="Edge AI" aria-pressed="false">Edge AI</button>
          <select data-story-sort><option value="featured">Featured</option><option value="newest">Newest</option><option value="oldest">Oldest</option></select>
        </div>
        <p data-story-count role="status"></p>
        <div data-story-list>
          <article id="pune" data-story data-topics="Edge AI" data-date="2025-07-23"><h3>OpenVINO in Pune</h3></article>
          <article id="python" data-story data-topics="Python" data-date="2024-01-01"><h3>Python foundations</h3></article>
          <article id="shegaon" data-story data-topics="Edge AI" data-date="2025-07-24"><h3>OpenVINO in Shegaon</h3></article>
          <article id="undated" data-story data-topics="Python" data-date=""><h3>Data science workshop</h3></article>
        </div>
        <div data-story-empty hidden>No matches <button data-story-reset>Clear filters</button></div>
      </section>`;
  });

  const start = () => {
    const file = path.join(__dirname, '../assets/js/stories.js');
    if (fs.existsSync(file)) require(file);
  };
  const visible = () => [...document.querySelectorAll('[data-story]')].filter(el => !el.hidden).map(el => el.id);
  const search = value => {
    const input = document.querySelector('[data-story-search]');
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };

  it('combines topic and case-insensitive search and announces the result count', () => {
    start();
    document.querySelector('[data-topic="Edge AI"]').click();
    search('  SHEGAON  ');
    expect(visible()).toEqual(['shegaon']);
    expect(document.querySelector('[data-story-count]').textContent).toMatch(/1 of 4/);
    expect(document.querySelector('[data-topic="Edge AI"]').getAttribute('aria-pressed')).toBe('true');
  });

  it('shows an actionable empty state and resets both search and topic', () => {
    start();
    document.querySelector('[data-topic="Edge AI"]').click();
    search('unmatched query');
    expect(visible()).toEqual([]);
    expect(document.querySelector('[data-story-empty]').hidden).toBe(false);
    document.querySelector('[data-story-reset]').click();
    expect(visible()).toEqual(['pune', 'python', 'shegaon', 'undated']);
    expect(document.querySelector('[data-story-search]').value).toBe('');
  });

  it('sorts dates in both directions while keeping undated stories last', () => {
    start();
    const sort = document.querySelector('[data-story-sort]');
    sort.value = 'newest'; sort.dispatchEvent(new Event('change'));
    expect(visible()).toEqual(['shegaon', 'pune', 'python', 'undated']);
    sort.value = 'oldest'; sort.dispatchEvent(new Event('change'));
    expect(visible()).toEqual(['python', 'pune', 'shegaon', 'undated']);
    sort.value = 'featured'; sort.dispatchEvent(new Event('change'));
    expect(visible()).toEqual(['pune', 'python', 'shegaon', 'undated']);
  });

  it('restores a shared filtered URL and updates it after searching', () => {
    history.replaceState(null, '', '/speakers?topic=Edge+AI&q=pune&sort=newest');
    start();
    expect(visible()).toEqual(['pune']);
    expect(document.querySelector('[data-story-search]').value).toBe('pune');
    search('shegaon');
    expect(new URLSearchParams(location.search).get('q')).toBe('shegaon');
  });
});
