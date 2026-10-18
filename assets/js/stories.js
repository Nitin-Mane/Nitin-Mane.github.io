/* Progressive enhancement for the static portfolio stories. No network or libraries. */
(() => {
  'use strict';

  document.querySelectorAll('[data-story-collection]').forEach(collection => {
    const search = collection.querySelector('[data-story-search]');
    const sort = collection.querySelector('[data-story-sort]');
    const buttons = [...collection.querySelectorAll('[data-topic]')];
    const list = collection.querySelector('[data-story-list]');
    const stories = [...collection.querySelectorAll('[data-story]')];
    const count = collection.querySelector('[data-story-count]');
    const empty = collection.querySelector('[data-story-empty]');
    let topic = 'all';
    const text = new Map(stories.map(story => [story, story.textContent.toLocaleLowerCase()]));

    const update = (save = true) => {
      const query = search.value.trim().toLocaleLowerCase();
      const ordered = [...stories];
      if (sort.value !== 'featured') ordered.sort((a, b) => {
        if (!a.dataset.date) return b.dataset.date ? 1 : 0;
        if (!b.dataset.date) return -1;
        return a.dataset.date.localeCompare(b.dataset.date) * (sort.value === 'oldest' ? 1 : -1);
      });
      let visible = 0;
      ordered.forEach(story => {
        story.hidden = !(topic === 'all' || story.dataset.topics.split('|').includes(topic)) || !text.get(story).includes(query);
        if (!story.hidden) visible++;
        list.append(story);
      });
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.topic === topic)));
      count.textContent = `${visible} of ${stories.length} stories`;
      empty.hidden = visible !== 0;
      if (save) {
        const url = new URL(location.href);
        [['q', search.value.trim()], ['topic', topic === 'all' ? '' : topic], ['sort', sort.value === 'featured' ? '' : sort.value]].forEach(([key, value]) => {
          if (value) url.searchParams.set(key, value);
          else url.searchParams.delete(key);
        });
        try { history.replaceState(null, '', url); } catch (_) { /* file previews still work */ }
      }
    };
    const restore = () => {
      const params = new URLSearchParams(location.search);
      search.value = params.get('q') || '';
      topic = buttons.some(button => button.dataset.topic === params.get('topic')) ? params.get('topic') : 'all';
      sort.value = ['newest', 'oldest'].includes(params.get('sort')) ? params.get('sort') : 'featured';
      update(false);
    };
    search.addEventListener('input', () => update());
    sort.addEventListener('change', () => update());
    buttons.forEach(button => button.addEventListener('click', () => { topic = button.dataset.topic; update(); }));
    collection.querySelectorAll('[data-story-reset]').forEach(button => button.addEventListener('click', () => {
      search.value = ''; topic = 'all'; sort.value = 'featured'; update(); search.focus();
    }));
    window.addEventListener('popstate', restore);
    restore();
    collection.querySelector('[data-story-controls]').hidden = false;

    const revealLinkedStory = () => {
      let id;
      try { id = decodeURIComponent(location.hash.slice(1)); } catch (_) { return; }
      const story = stories.find(item => item.id === id);
      if (!story) return;
      if (story.hidden) { search.value = ''; topic = 'all'; update(); }
      const detail = story.querySelector('details');
      if (detail) detail.open = true;
      story.scrollIntoView?.({ block: 'start', behavior: 'instant' });
    };
    revealLinkedStory();
    window.addEventListener('hashchange', revealLinkedStory);
  });

  const dialog = document.querySelector('[data-story-dialog]');
  const data = document.getElementById('story-gallery-data');
  if (!dialog || !data || typeof dialog.showModal !== 'function') return;
  let galleries;
  try { galleries = JSON.parse(data.textContent); } catch (_) { return; }
  const photo = dialog.querySelector('[data-gallery-image]');
  const caption = dialog.querySelector('[data-gallery-caption]');
  const title = dialog.querySelector('[data-gallery-title]');
  const counter = dialog.querySelector('[data-gallery-counter]');
  const prev = dialog.querySelector('[data-gallery-prev]');
  const next = dialog.querySelector('[data-gallery-next]');
  let gallery, index = 0, opener, previousOverflow;

  const render = () => {
    const item = gallery.images[index];
    photo.src = item.src;
    photo.alt = item.alt;
    caption.textContent = item.alt;
    counter.textContent = `${index + 1} / ${gallery.images.length}`;
    prev.disabled = gallery.images.length < 2;
    next.disabled = gallery.images.length < 2;
    dialog.querySelector('[data-gallery-original]').href = item.src;
  };
  const step = direction => { index = (index + direction + gallery.images.length) % gallery.images.length; render(); };
  document.querySelectorAll('[data-story-gallery]').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const selected = galleries[link.dataset.storyGallery];
    if (!selected || !selected.images.length) return;
    event.preventDefault();
    gallery = selected; index = 0; opener = link;
    title.textContent = gallery.title;
    render();
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
  }));
  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  dialog.querySelector('[data-gallery-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); step(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    opener?.focus({ preventScroll: true });
    photo.removeAttribute('src');
  });
})();
