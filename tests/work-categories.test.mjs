import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { projects } from "../src/data/projects.js";
import { initWorkCategories, thumbnailEdge } from "../src/scripts/work-categories.js";

test("all ten projects have the requested tags and thumbnails", () => {
  const expected = {
    "oak-tree": ["Installation", "Data"],
    "inner-ocean": ["Installation"],
    "situated-thresholds": ["Installation", "Data"],
    "fox-in-london": ["Installation", "AR/VR"],
    tubecast: ["Data", "Product"],
    "binary-conversion-implement": ["Installation", "Data"],
    "no-more-algorithm": ["Fashion"],
    "enigma-variations": ["Fashion"],
    linko: ["Product"],
    dodo: ["Product"],
  };
  assert.equal(projects.length, 10);
  for (const project of projects) {
    assert.deepEqual(project.tags, expected[project.slug]);
    assert.ok(project.thumb);
  }
});

test("Work reuses Slide order and Index is removed", () => {
  const source = readFileSync(new URL("../src/pages/index.astro", import.meta.url), "utf8");
  assert.equal((source.match(/const slideOrder\s*=/g) ?? []).length, 1);
  assert.ok(source.includes("const workGroups = slideProjects.reduce"));
  assert.ok(!source.includes('data-mode="intro"'));
  assert.ok(!source.includes("introFrameLoop"));
  const order = JSON.parse(source.match(/const slideOrder = (\[[\s\S]*?\]);/)[1].replace(/,\s*\]/g, "]"));
  assert.deepEqual(order, ["oak-tree", "situated-thresholds", "fox-in-london", "tubecast", "inner-ocean", "linko", "dodo", "binary-conversion-implement", "no-more-algorithm", "enigma-variations"]);
  assert.deepEqual(order.map((slug) => projects.find((p) => p.slug === slug).year), [...Array(7).fill("2026"), ...Array(3).fill("2025")]);
});

test("Inner Ocean presents its film before the live embed and deployable assets exist", () => {
  const project = projects.find((p) => p.slug === "inner-ocean");
  assert.equal(project.images[0].type, "youtube");
  assert.equal(project.images[0].url, "https://www.youtube.com/embed/3sk8LVrqM2Q");
  assert.equal(project.embedPlacement, "after-first-image");
  assert.equal(project.embedUrl, "https://banana42311.github.io/INNER_OCEAN/");
  assert.ok(readFileSync(new URL("../public" + project.thumb, import.meta.url)).length > 0);
});

test("connector terminates on the nearest thumbnail edge", () => {
  const rect = { left: 400, right: 600, top: 100, bottom: 300 };
  assert.deepEqual(thumbnailEdge({ x: 100, y: 200 }, rect), { x: 400, y: 200 });
  assert.deepEqual(thumbnailEdge({ x: 100, y: 450 }, rect), { x: 400, y: 300 });
  assert.deepEqual(thumbnailEdge({ x: 700, y: 0 }, rect), { x: 600, y: 100 });
});

class Element extends EventTarget {
  constructor(dataset = {}, rect = {}) {
    super();
    this.dataset = dataset;
    this.rect = rect;
    this.hidden = false;
    this.children = [];
    this.attributes = new Map();
    this.classes = new Set();
    this.classList = { toggle: (key, on) => on ? this.classes.add(key) : this.classes.delete(key) };
  }
  setAttribute(key, value) { this.attributes.set(key, value); }
  append(child) { this.children.push(child); }
  replaceChildren() { this.children = []; }
  getBoundingClientRect() { return this.rect; }
  querySelector(selector) { return this.selectors[selector]; }
  querySelectorAll(selector) { return this.selectors[selector] ?? []; }
  matches() { return true; }
}

function fixture(isTouch = false, firstItemTags = ["Installation"]) {
  const labels = ["Installation", "Product"].map((tag) => new Element({ tag }, { right: 120, top: 200, height: 20 }));
  const items = labels.map((label, index) => {
    const item = new Element({ tags: JSON.stringify(index === 0 ? firstItemTags : [label.dataset.tag]) });
    item.selectors = {
      ".work-media": new Element({}, { left: 400, right: 600, top: 100, bottom: 300 }),
      ".work-project": new Element(),
    };
    return item;
  });
  const group = new Element();
  group.selectors = { ".work-item": items };
  const root = new Element();
  root.selectors = { ".work-tag": labels, ".work-item": items, ".work-group": [group] };
  const svg = new Element();
  const doc = new EventTarget();
  doc.body = { dataset: { mode: "work" } };
  doc.getElementById = (id) => ({ workView: root, workLines: svg })[id];
  doc.createElementNS = () => new Element();
  const media = new EventTarget();
  media.matches = isTouch;
  const frames = new Map();
  let nextId = 0;
  const names = ["document", "window", "matchMedia", "requestAnimationFrame", "cancelAnimationFrame", "innerWidth", "innerHeight"];
  const previous = names.map((key) => Object.getOwnPropertyDescriptor(globalThis, key));
  const values = [doc, new EventTarget(), () => media, (cb) => { frames.set(++nextId, cb); return nextId; }, (id) => frames.delete(id), 1200, 800];
  names.forEach((key, i) => Object.defineProperty(globalThis, key, { configurable: true, writable: true, value: values[i] }));
  initWorkCategories();
  return { labels, items, svg, frames, doc, media, restore() {
    names.forEach((key, i) => previous[i] ? Object.defineProperty(globalThis, key, previous[i]) : delete globalThis[key]);
  } };
}

test("desktop hover dims only nonmatches, updates endpoints, and clears on leaving or changing modes", () => {
  const f = fixture();
  try {
    f.labels[0].dispatchEvent(new Event("pointerenter"));
    assert.equal(f.svg.children.length, 1);
    assert.equal(f.items[0].classes.has("is-dimmed"), false);
    assert.equal(f.items[1].classes.has("is-dimmed"), true);
    assert.equal(f.items[1].hidden, false);
    const path = f.svg.children[0];
    assert.equal(path.attributes.get("d"), "M 126 210 L 400 210");
    f.items[0].selectors[".work-media"].rect = { left: 500, right: 700, top: -200, bottom: 0 };
    const [id, callback] = f.frames.entries().next().value;
    f.frames.delete(id);
    callback();
    assert.equal(f.svg.children[0], path);
    assert.equal(path.attributes.get("d"), "M 126 210 L 500 0");
    f.labels[0].dispatchEvent(new Event("pointerleave"));
    assert.equal(f.svg.children.length, 0);
    assert.equal(f.frames.size, 0);
    assert.equal(f.items[1].classes.has("is-dimmed"), false);
    f.labels[1].dispatchEvent(new Event("focus"));
    assert.equal(f.svg.children.length, 1);
    f.doc.body.dataset.mode = "slide";
    f.doc.dispatchEvent(new Event("portfolio:view-change"));
    assert.equal(f.svg.children.length, 0);
    assert.equal(f.frames.size, 0);
  } finally { f.restore(); }
});

test("touch tap filters and a second tap restores all works, without SVG paths", () => {
  const f = fixture(true);
  try {
    f.labels[1].dispatchEvent(new Event("pointerenter"));
    f.items[0].selectors[".work-media"].dispatchEvent(new Event("pointerenter"));
    assert.equal(f.svg.children.length, 0);
    f.labels[1].dispatchEvent(new Event("click"));
    assert.equal(f.items[0].hidden, true);
    assert.equal(f.items[1].hidden, false);
    assert.equal(f.labels[1].attributes.get("aria-pressed"), "true");
    assert.equal(f.svg.children.length, 0);
    assert.equal(f.frames.size, 0);
    f.labels[1].dispatchEvent(new Event("click"));
    assert.ok(f.items.every((item) => !item.hidden));
  } finally { f.restore(); }
});

test("thumbnail hover connects every matching category, follows geometry, and clears on leave", () => {
  const f = fixture(false, ["Installation", "Product"]);
  try {
    const media = f.items[0].selectors[".work-media"];
    media.dispatchEvent(new Event("pointerenter"));
    assert.equal(f.svg.children.length, 2);
    assert.ok(f.labels.every((label) => label.classes.has("is-active")));
    assert.equal(f.items[0].classes.has("is-dimmed"), false);
    assert.equal(f.items[1].classes.has("is-dimmed"), true);
    const paths = [...f.svg.children];
    assert.equal(paths[0].attributes.get("d"), "M 400 210 L 126 210");
    media.rect = { left: 500, right: 700, top: -200, bottom: 0 };
    const [id, callback] = f.frames.entries().next().value;
    f.frames.delete(id);
    callback();
    assert.equal(f.svg.children[0], paths[0]);
    assert.equal(paths[0].attributes.get("d"), "M 500 0 L 126 210");
    media.dispatchEvent(new Event("pointerleave"));
    assert.equal(f.svg.children.length, 0);
    assert.equal(f.frames.size, 0);
    assert.ok(f.labels.every((label) => !label.classes.has("is-active")));
    assert.ok(f.items.every((item) => !item.classes.has("is-dimmed")));
  } finally { f.restore(); }
});

test("thumbnail hover takes priority over a focused category and project keyboard focus also connects", () => {
  const f = fixture();
  try {
    f.labels[0].dispatchEvent(new Event("focus"));
    const media = f.items[1].selectors[".work-media"];
    media.dispatchEvent(new Event("pointerenter"));
    assert.equal(f.labels[0].classes.has("is-active"), false);
    assert.equal(f.labels[1].classes.has("is-active"), true);
    media.dispatchEvent(new Event("pointerleave"));
    assert.equal(f.labels[0].classes.has("is-active"), true);
    f.labels[0].dispatchEvent(new Event("blur"));
    const link = f.items[1].selectors[".work-project"];
    link.dispatchEvent(new Event("focus"));
    assert.equal(f.svg.children.length, 1);
    assert.equal(f.labels[1].classes.has("is-active"), true);
    f.doc.body.dataset.mode = "flow";
    f.doc.dispatchEvent(new Event("portfolio:view-change"));
    assert.equal(f.svg.children.length, 0);
    assert.equal(f.frames.size, 0);
    assert.ok(f.labels.every((label) => !label.classes.has("is-active")));
  } finally { f.restore(); }
});
