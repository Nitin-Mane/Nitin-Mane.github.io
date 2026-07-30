describe('theme-init.js', () => {
  beforeEach(() => {
    jest.resetModules();
    document.documentElement.removeAttribute('data-theme');
    window.localStorage.clear();
  });

  it('sets theme to light if "light" is in localStorage', () => {
    window.localStorage.setItem('nitinmane-theme', 'light');
    require('../assets/js/theme-init.js');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('sets theme to dark if "dark" is in localStorage', () => {
    window.localStorage.setItem('nitinmane-theme', 'dark');
    require('../assets/js/theme-init.js');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('does not set theme if invalid theme is in localStorage', () => {
    window.localStorage.setItem('nitinmane-theme', 'blue');
    require('../assets/js/theme-init.js');
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('sets theme to dark if localStorage throws an error', () => {
    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Access denied');
    });

    require('../assets/js/theme-init.js');

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    spy.mockRestore();
  });
});
