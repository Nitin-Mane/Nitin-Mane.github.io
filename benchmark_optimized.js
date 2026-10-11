const { JSDOM } = require("jsdom");
const fs = require("fs");
const { performance } = require('perf_hooks');

const dom = new JSDOM(`
  <!DOCTYPE html>
  <html>
  <body>
    <div data-filter-group=".item">
      <button class="filter-btn" data-filter="all">All</button>
      <button class="filter-btn" id="btn1" data-filter="tag50">Tag 50</button>
      <button class="filter-btn" id="btn2" data-filter="tag99">Tag 99</button>
    </div>
    <div id="items-container"></div>
  </body>
  </html>
`, { runScripts: "dangerously" });

const window = dom.window;
const document = window.document;

// Generate 10000 items with 100 tags each
const container = document.getElementById("items-container");
for (let i = 0; i < 10000; i++) {
  const div = document.createElement("div");
  div.className = "item";

  const tags = [];
  for (let j = 0; j < 100; j++) {
    tags.push("tag" + j);
  }
  div.setAttribute("data-tags", tags.join(","));
  container.appendChild(div);
}

// polyfill matchMedia, requestAnimationFrame, IntersectionObserver
window.matchMedia = () => ({ matches: false });
window.requestAnimationFrame = (cb) => cb();
window.IntersectionObserver = class {
  observe() {}
  unobserve() {}
};

// Load optimized main.js code
let mainCode = fs.readFileSync("assets/js/main.js", "utf8");
mainCode = mainCode.replace(
  '(item.getAttribute("data-tags") || "").split(","),',
  'new Set((item.getAttribute("data-tags") || "").split(",")),'
);
mainCode = mainCode.replace(
  'tags.includes(filter);',
  'tags.has(filter);'
);

const script = document.createElement("script");
script.textContent = mainCode;
document.body.appendChild(script);

const btn1 = document.getElementById("btn1");
const btn2 = document.getElementById("btn2");

const start = performance.now();
for (let i = 0; i < 100; i++) {
  btn1.click();
  btn2.click();
}
const end = performance.now();
console.log("Time taken (optimized): " + (end - start).toFixed(2) + " ms");
