// ─────────────────────────────────────────────────────────────
// Single source of truth for all projects.
// To add a project: copy a block, drop images in public/projects/<slug>/,
// list them in `images`, and set `pos` (where its stack sits on the home depth field).
// ─────────────────────────────────────────────────────────────

const bciEmbeds = {
  7: {
    type: "youtube",
    url: "https://www.youtube.com/embed/dx6XxulfSmk",
    title: "Binary Conversion Implement video 1",
  },
  12: {
    type: "youtube",
    url: "https://www.youtube.com/embed/NjelaljWy84",
    title: "Binary Conversion Implement video 2",
  },
  16: {
    type: "youtube",
    url: "https://www.youtube.com/embed/snSGh4iZizw",
    title: "Binary Conversion Implement video 3",
  },
};

const bciImages = Array.from({ length: 17 }, (_, i) => {
  const number = i + 1;
  return bciEmbeds[number] ?? `/projects/bci/bci_${String(number).padStart(2, "0")}.jpg`;
});

const withLanguageFolder = (items, folder) =>
  items.map((item) => {
    if (typeof item !== "string") return item;
    const lastSlash = item.lastIndexOf("/");
    return `${item.slice(0, lastSlash)}/${folder}${item.slice(lastSlash)}`;
  });

const localizedSlides = (items, koreanFolder = "kr") => ({
  images: withLanguageFolder(items, "en"),
  imagesByLang: {
    ko: withLanguageFolder(items, koreanFolder),
    en: withLanguageFolder(items, "en"),
  },
});

const situatedThresholdsSlides = [
  "/projects/SituatedThresholds/Slide 16_9 - 1.png",
  "/projects/SituatedThresholds/Slide 16_9 - 2.png",
  "/projects/SituatedThresholds/Slide 16_9 - 3.png",
  "/projects/SituatedThresholds/Slide 16_9 - 4.png",
  "/projects/SituatedThresholds/Slide 16_9 - 5.png",
  "/projects/SituatedThresholds/Slide 16_9 - 6.png",
  "/projects/SituatedThresholds/Slide 16_9 - 7.png",
  "/projects/SituatedThresholds/Slide 16_9 - 8.png",
  "/projects/SituatedThresholds/Slide 16_9 - 9.png",
  "/projects/SituatedThresholds/Slide 16_9 - 10.png",
];

const oakTreeSlides = [
  "/projects/Oak_Tree/slide1.png",
  "/projects/Oak_Tree/Slide 16_9 - 2.png",
  "/projects/Oak_Tree/Slide 16_9 - 3.png",
  "/projects/Oak_Tree/Slide 16_9 - 4.png",
  "/projects/Oak_Tree/Slide 16_9 - 5.png",
  "/projects/Oak_Tree/Slide 16_9 - 6.png",
  "/projects/Oak_Tree/Slide 16_9 - 7.png",
  "/projects/Oak_Tree/Slide 16_9 - 8.png",
  "/projects/Oak_Tree/Slide 16_9 - 9.png",
  "/projects/Oak_Tree/Slide 16_9 - 10.png",
  "/projects/Oak_Tree/Slide 16_9 - 11.png",
  "/projects/Oak_Tree/Slide 16_9 - 12.png",
  "/projects/Oak_Tree/Slide 16_9 - 13.png",
];

const linkoSlides = [
  "/projects/Linko/Slide 16_9 - 1.png",
  "/projects/Linko/Slide 16_9 - 2.png",
  "/projects/Linko/Slide 16_9 - 3.png",
  "/projects/Linko/Slide 16_9 - 4.png",
  "/projects/Linko/Slide 16_9 - 5.png",
  "/projects/Linko/Slide 16_9 - 6.png",
  "/projects/Linko/Slide 16_9 - 8.png",
  "/projects/Linko/Slide 16_9 - 9.png",
  "/projects/Linko/Slide 16_9 - 11.png",
  {
    type: "youtube",
    url: "https://www.youtube.com/embed/xi-3Q9whphY",
    title: "Linko prototype video",
  },
  "/projects/Linko/Slide 16_9 - 12.png",
];

export const projects = [
  {
    slug: "situated-thresholds",
    title: "Situated Thresholds",
    year: "2026",
    category: "Physical-computing data installation",
    groups: ["data"],
    color: "#0f5c5a",
    pos: { x: 900, y: 260 },
    homeSize: { width: 554, height: 416 },
    reveal: { bg: "#00ffcc", ink: "#06080c", muted: "rgba(6,8,12,.62)" },
    embedUrl: "https://banana42311.github.io/situated_thresholds/",
    embedPlacement: "after-first-image",
    intro: {
      heading: "Situated Thresholds",
      body: "Situated Thresholds is a data-visualisation installation that traces where digital inequality begins. Mapping London's digital infrastructure against access to digital healthcare, it turns a gallery floor into a pressure-sensitive map — so that standing in a place, rather than clicking, becomes the way to read how access is unevenly distributed across the city.",
    },
    thumb: "/projects/SituatedThresholds/DSC09717.jpg",
    ...localizedSlides(situatedThresholdsSlides),
    links: [
      { label: "Open live experience", url: "https://banana42311.github.io/situated_thresholds/" },
    ],
  },
  {
    slug: "oak-tree",
    title: "Oak Tree",
    year: "2026",
    category: "Live environmental visualisation",
    groups: ["data"],
    color: "#3a5f2a",
    pos: { x: -780, y: 500 },
    homeSize: { width: 447, height: 447 },
    reveal: { bg: "#d7ff73", ink: "#080a05", muted: "rgba(8,10,5,.58)" },
    embedUrl: "https://banana42311.github.io/OakTree/",
    embedHeight: "calc(100svh - 72px)",
    embedPlacement: "after-first-image",
    previewCrop: { scale: 1.0, originX: "50%", originY: "48%" },
    intro: {
      heading: "Oak Tree , RCA x Horniman Museum(London)  June, 2026",
      body: "Oak Tree is a live environmental visualisation that lets a tree register the air around it. Built from a 3D scan of the Horniman Museum's oldest oak, it maps real-time air-quality data onto the tree so that it visibly \"breathes\" with the changing state of its environment.",
    },
    thumb: "/projects/Oak_Tree/Thumb.png",
    ...localizedSlides(oakTreeSlides),
    links: [
      { label: "Open live experience", url: "https://banana42311.github.io/OakTree/" },
    ],
  },
  {
    slug: "dodo",
    title: "DODO",
    year: "2025",
    category: "Wellness product",
    groups: ["ux-ui"],
    color: "#d3d2d0",
    pos: { x: 620, y: -420 },
    homeSize: { width: 345, height: 345 },
    reveal: { bg: "#d3d2d0", ink: "#20201d", muted: "rgba(32,32,29,.58)" },
    intro: {
      heading: "DODO",
      body: "DODO is a thermal wellness system that reframes recovery as a sensory ritual. Pairing HRV-based stress detection with an aroma device, it reads a user's state and responds with AI-personalised sessions — warmth, scent, and soundscapes generated in real time to meet the body where it is.",
    },
    thumb: "/projects/DoDo/Thumb.png",
    images: [
      "/projects/DoDo/DODO_1.png",
      "/projects/DoDo/DODO_2.png",
      "/projects/DoDo/DODO_3.png",
      "/projects/DoDo/DODO_4.png",
      "/projects/DoDo/DODO_5.png",
      "/projects/DoDo/DODO_6.png",
      "/projects/DoDo/DODO_7.png",
      "/projects/DoDo/DODO_8.png",
      "/projects/DoDo/DODO_9.png",
    ],
    links: [],
  },
  {
    slug: "linko",
    title: "Linko",
    year: "2025",
    category: "UX/UI service design",
    groups: ["ux-ui"],
    color: "#f7f7f4",
    pos: { x: 920, y: 40 },
    homeSize: { width: 275, height: 206 },
    reveal: { bg: "#f7f7f4", ink: "#2d5da8", muted: "rgba(45,93,168,.62)" },
    intro: {
      heading: "Linko",
      body: "Linko is a social community platform designed to reduce the burden of searching and choosing. It suggests activities suited to each user’s situation and supports them in taking the next step toward participation. By turning small acts of individual participation into lasting relationships, Linko aims to help revive local communities and third places.",
    },
    thumb: "/projects/Linko/LinkoLogo.png",
    ...localizedSlides(linkoSlides),
    links: [],
  },
  {
    slug: "no-more-algorithm",
    title: "No More Algorithm",
    year: "2025",
    category: "Phygital fashion collection",
    groups: ["fashion"],
    color: "#8a1f1a",
    pos: { x: -860, y: 40 },
    homeSize: { width: 301, height: 400 },
    intro: {
      heading: "No More Algorithm",
      body: "No More Algorithm is a phygital fashion collection that asks how technology might extend the language of clothing. Spanning 3D design, a virtual collection film, and a gesture-controlled display, it invites passersby to move the work with their own hands — a collection defined by deviation rather than algorithmic uniformity.",
    },
    thumb: "/projects/NoMoreAlgorithm/Thumb.png",
    flushImages: true,
    images: [
      "/projects/NoMoreAlgorithm/NMA_1.png",
      "/projects/NoMoreAlgorithm/NMA_2.png",
      "/projects/NoMoreAlgorithm/NMA_3.png",
      "/projects/NoMoreAlgorithm/NMA_4.png",
      "/projects/NoMoreAlgorithm/NMA_5.png",
      "/projects/NoMoreAlgorithm/NMA_6.png",
      "/projects/NoMoreAlgorithm/NMA_7.png",
      "/projects/NoMoreAlgorithm/NMA_8.png",
      "/projects/NoMoreAlgorithm/NMA_9.png",
      "/projects/NoMoreAlgorithm/NMA_10.png",
      "/projects/NoMoreAlgorithm/NMA_11.png",
      "/projects/NoMoreAlgorithm/NMA_12.png",
      {
        type: "youtube",
        url: "https://www.youtube.com/embed/EGR3AZycyvw",
        title: "No More Algorithm video 1",
      },
      "/projects/NoMoreAlgorithm/NMA_14.png",
      {
        type: "youtube",
        url: "https://www.youtube.com/embed/mAmDTNN0xaY",
        title: "No More Algorithm video 2",
      },
      "/projects/NoMoreAlgorithm/NMA_16.png",
    ],
    links: [],
  },
  {
    slug: "binary-conversion-implement",
    title: "Binary Conversion Implement",
    year: "2025",
    category: "Interactive data installation",
    groups: ["data", "ux-ui"],
    color: "#2b3a67",
    pos: { x: -1050, y: -220 },     // home depth-field exit vector
    homeSize: { width: 176, height: 232 },
    intro: {
      heading: "Binary Conversion Implement",
      body: "Binary Conversion Implement is an interactive data installation that treats everyday life as material. Drawing on 13 months of personal movement data, it visualises the self across three scales — body, home, and city — where a viewer's gestures continuously reshape what first appears as free movement into the quiet patterns of routine.",
    },
    thumb: "/projects/bci/bci_01.jpg",
    images: bciImages,
    links: [],
  },
];
