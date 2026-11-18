export function thumbnailEdge(origin, rect) {
  return {
    x: Math.max(rect.left, Math.min(rect.right, origin.x)),
    y: Math.max(rect.top, Math.min(rect.bottom, origin.y)),
  };
}

export function initWorkCategories() {
  const root = document.getElementById("workView");
  const svg = document.getElementById("workLines");
  if (!root || !svg) return;

  const buttons = [...root.querySelectorAll(".work-tag")];
  const groups = [...root.querySelectorAll(".work-group")];
  const items = [...root.querySelectorAll(".work-item")].map((element) => ({
    element,
    media: element.querySelector(".work-media"),
    tags: JSON.parse(element.dataset.tags),
  }));
  const touch = matchMedia("(hover: none)");
  let hovered = null, focused = null, selected = null;
  let hoveredItem = null, focusedItem = null;
  let frame = 0;
  let connections = [];

  const activeButton = () => touch.matches ? selected : hovered ?? (hoveredItem ? null : focused);
  const activeItem = () => touch.matches || hovered ? null : hoveredItem ?? (focused ? null : focusedItem);
  const workIsVisible = () => !document.body.dataset.mode || document.body.dataset.mode === "work";

  function draw() {
    frame = 0;
    if (!connections.length || touch.matches || !workIsVisible()) return;

    svg.setAttribute("viewBox", `0 0 ${innerWidth} ${innerHeight}`);
    for (const { button, media, path, fromMedia } of connections) {
      const label = button.getBoundingClientRect();
      const origin = { x: label.right + 6, y: label.top + label.height / 2 };
      const rect = media.getBoundingClientRect();
      const end = thumbnailEdge(origin, rect);
      path.setAttribute("d", fromMedia
        ? `M ${end.x} ${end.y} L ${origin.x} ${origin.y}`
        : `M ${origin.x} ${origin.y} L ${end.x} ${end.y}`);
    }
    // Keep the same paths while scrolling, so the draw animation never restarts.
    frame = requestAnimationFrame(draw);
  }

  function update() {
    cancelAnimationFrame(frame);
    frame = 0;
    svg.replaceChildren();
    connections = [];
    const button = activeButton();
    const sourceItem = activeItem();
    const tag = button?.dataset.tag;
    for (const label of buttons) {
      label.classList.toggle("is-active", label === button || Boolean(sourceItem?.tags.includes(label.dataset.tag)));
      label.setAttribute("aria-pressed", String(label === button));
    }
    for (const item of items) {
      const matches = sourceItem ? item === sourceItem : !tag || item.tags.includes(tag);
      item.element.hidden = touch.matches && !matches;
      item.element.classList.toggle("is-dimmed", !touch.matches && !matches);
      if ((!tag && !sourceItem) || !matches || touch.matches || !workIsVisible()) continue;
      const labels = sourceItem ? buttons.filter((label) => item.tags.includes(label.dataset.tag)) : [button];
      for (const label of labels) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("pathLength", "1");
        svg.append(path);
        connections.push({ button: label, media: item.media, path, fromMedia: Boolean(sourceItem) });
      }
    }
    for (const group of groups) {
      group.hidden = touch.matches && [...group.querySelectorAll(".work-item")].every((item) => item.hidden);
    }
    if (connections.length) draw();
  }

  for (const button of buttons) {
    button.addEventListener("pointerenter", (event) => {
      if (touch.matches || event.pointerType === "touch") return;
      hovered = button;
      hoveredItem = null;
      update();
    });
    button.addEventListener("pointerleave", () => {
      if (hovered !== button) return;
      hovered = null;
      update();
    });
    button.addEventListener("focus", () => {
      if (touch.matches || !button.matches(":focus-visible")) return;
      focused = button;
      update();
    });
    button.addEventListener("blur", () => {
      focused = null;
      update();
    });
    button.addEventListener("click", () => {
      if (!touch.matches) return;
      selected = selected === button ? null : button;
      update();
    });
  }
  for (const item of items) {
    item.media.addEventListener("pointerenter", (event) => {
      if (touch.matches || event.pointerType === "touch") return;
      hoveredItem = item;
      hovered = null;
      update();
    });
    item.media.addEventListener("pointerleave", () => {
      if (hoveredItem !== item) return;
      hoveredItem = null;
      update();
    });
    const link = item.element.querySelector(".work-project");
    link.addEventListener("focus", () => {
      if (touch.matches || !link.matches(":focus-visible")) return;
      focusedItem = item;
      update();
    });
    link.addEventListener("blur", () => {
      focusedItem = null;
      update();
    });
  }
  const reset = () => {
    hovered = focused = selected = null;
    hoveredItem = focusedItem = null;
    update();
  };
  touch.addEventListener("change", reset);
  document.addEventListener("portfolio:view-change", reset);
  window.addEventListener("pagehide", () => cancelAnimationFrame(frame));
  window.addEventListener("pageshow", update);
  update();
}
