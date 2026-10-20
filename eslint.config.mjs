export default [
  {
    ignores: ["assets/js/three.module.js"]
  },
  {
    languageOptions: {
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        module: "readonly",
        require: "readonly",
        setTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        requestAnimationFrame: "readonly",
        navigator: "readonly",
        parseInt: "readonly",
        String: "readonly",
        Math: "readonly",
        Intl: "readonly",
        Date: "readonly",
        IntersectionObserver: "readonly",
        jest: "readonly",
        describe: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        it: "readonly",
        expect: "readonly",
        fetch: "readonly",
        AbortController: "readonly",
        MutationObserver: "readonly",
        localStorage: "readonly",
        location: "readonly",
        performance: "readonly",
        URL: "readonly",
        history: "readonly",
        URLSearchParams: "readonly"
      },
      sourceType: "module"
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error"
    }
  }
];
