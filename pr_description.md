Title: 🧪 Testing Improvement for Theme Toggle

🎯 **What:** Missing error test for localStorage.setItem in theme toggle. The test now verifies that if `localStorage.setItem` throws an error (e.g. quota exceeded, disabled by user), the application gracefully catches it and continues to change the theme without crashing.

📊 **Coverage:** The scenario where `localStorage.setItem` fails during the theme toggle click event in `main.js` is now tested.

✨ **Result:** Increased confidence in the robustness of the theme toggling functionality in `assets/js/main.js`, verifying it won't crash the UI when local storage is unavailable.
