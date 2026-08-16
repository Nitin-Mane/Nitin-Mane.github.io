🧪 Add tests for initNavToggle

🎯 **What:** This testing improvement adds missing test coverage for the `initNavToggle` function located in `assets/js/main.js`. It ensures the mobile navigation menu behaves correctly when interacted with.
📊 **Coverage:** The new tests cover:
- Gracefully handling cases where `.nav__toggle` or `.nav__links` elements are missing from the DOM.
- Toggling the `.is-open` class on `.nav__links` when `.nav__toggle` is clicked.
- Toggling the `aria-expanded` attribute on `.nav__toggle`.
- Toggling `document.body.style.overflow` between `hidden` and empty.
- Closing the navigation menu automatically when an inner anchor link is clicked.
✨ **Result:** Test coverage is now complete for the mobile navigation feature, preventing future regressions and improving overall confidence in refactoring.
