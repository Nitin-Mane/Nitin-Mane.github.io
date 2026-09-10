🧹 [Code Health] Remove leftover console.log from benchmark.js

🎯 **What:** Removed the leftover `console.log` statement used for timing, and its associated `start` and `end` timing variables from `benchmark.js`.
💡 **Why:** Improves code health by cleaning up dead debugging code and unused variables, keeping the benchmark script clean.
✅ **Verification:** Verified the code manually with `node benchmark.js` and confirmed all existing tests passed via `npm test`. No behavior was altered.
✨ **Result:** A cleaner script that is free of unused variables and logging.
