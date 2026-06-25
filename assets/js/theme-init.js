(() => {
  try {
    const storedTheme = localStorage.getItem("nitinmane-theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      document.documentElement.setAttribute("data-theme", storedTheme);
    }
  } catch (error) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
