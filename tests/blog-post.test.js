describe('blog-post.js', () => {
  let observerCallback;

  beforeEach(() => {
    jest.resetModules();
    window.requestAnimationFrame = (cb) => cb();
    window.IntersectionObserver = class {
      constructor(cb) { observerCallback = cb; }
      observe() {}
    };
    document.body.innerHTML = `
      <div data-post-progress></div>
      <nav data-post-toc><a href="#one">One</a><a href="#two">Two</a></nav>
      <article data-post-body>
        <h2 id="one">One</h2>
        <figure>
          <a href="assets/fig.webp" data-zoom><img src="assets/fig.webp" alt="A figure"></a>
          <figcaption>Fig. 1 Caption text</figcaption>
        </figure>
        <h2 id="two">Two</h2>
      </article>
      <dialog data-post-lightbox><img alt=""><span data-lightbox-caption></span><button data-lightbox-close>Close</button></dialog>`;
    const dialog = document.querySelector('dialog');
    dialog.showModal = jest.fn(function () { this.open = true; });
    dialog.close = jest.fn(function () { this.open = false; this.dispatchEvent(new window.Event('close')); });
    require('../assets/js/blog-post.js');
  });

  it('marks the section in view in the table of contents', () => {
    observerCallback([{ isIntersecting: true, target: document.getElementById('two') }]);
    const [one, two] = document.querySelectorAll('[data-post-toc] a');
    expect(two.classList.contains('is-current')).toBe(true);
    expect(two.getAttribute('aria-current')).toBe('location');
    expect(one.classList.contains('is-current')).toBe(false);
  });

  it('opens a figure in the lightbox with its caption and closes it', () => {
    const link = document.querySelector('[data-zoom]');
    const dialog = document.querySelector('dialog');
    link.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(dialog.showModal).toHaveBeenCalled();
    expect(dialog.querySelector('img').getAttribute('src')).toBe('assets/fig.webp');
    expect(dialog.querySelector('[data-lightbox-caption]').textContent).toBe('Fig. 1 Caption text');
    dialog.querySelector('[data-lightbox-close]').click();
    expect(dialog.close).toHaveBeenCalled();
    expect(dialog.querySelector('img').hasAttribute('src')).toBe(false);
  });

  it('sets a reading progress value', () => {
    expect(document.querySelector('[data-post-progress]').style.getPropertyValue('--progress')).not.toBe('');
  });
});
