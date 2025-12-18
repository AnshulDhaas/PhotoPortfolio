const DATA = [
  // category: Nature, Portrait, Product, Car, Abstract
  { id: 1,  title: "Toy Car & Visual Arts",        category: "Car",      src: "assets/toy-car-and-visual-arts.jpg",     alt: "Toy car beside School of Visual Arts book" },
  { id: 2,  title: "Citrus Immunity Shot",         category: "Product",  src: "assets/citrus-immunity-shot.jpg",        alt: "Suja immunity shot with oranges and ginger" },
  { id: 3,  title: "Catcher in the Rye, 3:45",     category: "Abstract", src: "assets/catcher-in-the-rye-alarm.jpg",     alt: "Alarm clock next to The Catcher in the Rye" },
  { id: 4,  title: "Floating Paper",               category: "Abstract", src: "assets/floating-paper.jpg",               alt: "Crumpled paper floating in space" },
  { id: 5,  title: "Goat Huddle",                  category: "Nature",   src: "assets/goat-huddle.jpg",                  alt: "Goats gathered together" },
  { id: 6,  title: "Splash by the Wheel",          category: "Car",      src: "assets/splash-by-the-wheel.jpg",          alt: "Wheel splashing through water" },
  { id: 7,  title: "Tabletop Strategy",            category: "Abstract", src: "assets/tabletop-strategy.jpg",            alt: "Board game pieces on a map with dice and cards" },
  { id: 8,  title: "Neon Portrait",                category: "Portrait", src: "assets/neon-portrait-light-paint.jpg",    alt: "Silhouette with light painting" },
  { id: 9,  title: "Light Paint Portal",           category: "Portrait", src: "assets/light-paint-portal.jpg",           alt: "Silhouette framed by magenta and white light paint" },
  { id: 10, title: "Industrial Lines",             category: "Abstract", src: "assets/industrial-lines.jpg",              alt: "Minimal industrial wall with pipes and shadows" },

  { id: 11, title: "Late Night Study",             category: "Abstract", src: "assets/late-night-study.jpg",              alt: "Study materials lit by a warm lamp" },
  { id: 12, title: "Curiosity at the Door",        category: "Portrait", src: "assets/curiosity-at-the-door.jpg",         alt: "Person peeking through a doorway" },
  { id: 13, title: "Still Life in Monochrome",     category: "Product",  src: "assets/still-life-in-monochrome.jpg",      alt: "Teapot and glassware in black and white" },
  { id: 14, title: "Leading Line Playground",      category: "Nature",   src: "assets/leading-line-playground.jpg",       alt: "Strong leading line across an outdoor scene" },
  { id: 15, title: "Ghost Fabric at Dusk",         category: "Nature",   src: "assets/ghost-fabric-at-dusk.jpg",          alt: "Fabric caught in a tree at sunset" },
  { id: 16, title: "Industrial Bolt Macro",        category: "Abstract", src: "assets/industrial-bolt-macro.jpg",         alt: "Macro of bolt and chain in black and white" },
  { id: 17, title: "Banana Run Flatlay",           category: "Product",  src: "assets/banana-run-flatlay.jpg",            alt: "Flatlay with race bib, shoes, and accessories" },
];

const CATEGORIES = ["All", "Nature", "Portrait", "Product", "Car", "Abstract"];

const els = {
  gallery: document.getElementById("gallery"),
  pills: document.getElementById("categoryPills"),
  search: document.getElementById("searchInput"),
  count: document.getElementById("countLabel"),
  year: document.getElementById("year"),
  themeToggle: document.getElementById("themeToggle"),
  lightbox: document.getElementById("lightbox"),
  lbImg: document.getElementById("lightboxImg"),
  lbTitle: document.getElementById("lightboxTitle"),
  lbCat: document.getElementById("lightboxCat"),
  lbAlt: document.getElementById("lightboxAlt"),
  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
};

let state = {
  category: "All",
  query: "",
  filtered: [...DATA],
  activeIndex: 0,
};

function applyTheme(theme){
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  // Toggle icon
  const icon = theme === "light" ? "☾" : "☀";
  els.themeToggle.querySelector(".icon").textContent = icon;
}

function initTheme(){
  const saved = localStorage.getItem("theme");
  if(saved){
    applyTheme(saved);
    return;
  }
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  applyTheme(prefersLight ? "light" : "dark");
}

function setHeroImage(){
  // Use Ghost Fabric at Dusk as the hero image by default
  const hero = document.querySelector(".hero-bg");
  const heroItem = DATA.find(d => d.title === "Ghost Fabric at Dusk") || DATA[0];
  hero.style.backgroundImage = `url('${heroItem.src}')`;
}

function pill(label, pressed){
  const b = document.createElement("button");
  b.className = "pill";
  b.type = "button";
  b.textContent = label;
  b.setAttribute("aria-pressed", pressed ? "true" : "false");
  b.addEventListener("click", () => {
    state.category = label;
    update();
    // update pill states
    [...els.pills.children].forEach(c => c.setAttribute("aria-pressed", c.textContent === label ? "true" : "false"));
  });
  return b;
}

function buildPills(){
  CATEGORIES.forEach((c, idx) => {
    els.pills.appendChild(pill(c, idx === 0));
  });
}

function filterData(){
  const q = state.query.trim().toLowerCase();
  return DATA.filter(item => {
    const catOK = state.category === "All" || item.category === state.category;
    const qOK = !q || item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    return catOK && qOK;
  });
}

function card(item, index){
  const d = document.createElement("article");
  d.className = "card";
  d.innerHTML = `
    <img class="thumb" src="${item.src}" alt="${item.alt}" loading="lazy" />
    <div class="card-body">
      <h3 class="card-title">${item.title}</h3>
      <div class="card-meta">
        <span class="badge">${item.category}</span>
        <span class="small">#${String(item.id).padStart(2,"0")}</span>
      </div>
    </div>
  `;
  d.querySelector(".thumb").addEventListener("click", () => openLightbox(index));
  return d;
}

function render(){
  els.gallery.innerHTML = "";
  state.filtered.forEach((item, i) => {
    els.gallery.appendChild(card(item, i));
  });
  els.count.textContent = `${state.filtered.length} photo${state.filtered.length === 1 ? "" : "s"}`;
}

function openLightbox(filteredIndex){
  state.activeIndex = filteredIndex;
  const item = state.filtered[state.activeIndex];
  els.lbImg.src = item.src;
  els.lbImg.alt = item.alt;
  els.lbTitle.textContent = item.title;
  els.lbCat.textContent = item.category;
  els.lbAlt.textContent = item.alt;

  if(!els.lightbox.open){
    els.lightbox.showModal();
  }
}

function closeLightbox(){
  if(els.lightbox.open) els.lightbox.close();
}

function step(dir){
  if(state.filtered.length === 0) return;
  state.activeIndex = (state.activeIndex + dir + state.filtered.length) % state.filtered.length;
  openLightbox(state.activeIndex);
}

function wireLightbox(){
  els.lightbox.addEventListener("click", (e) => {
    // click outside image closes
    const rect = els.lightbox.getBoundingClientRect();
    const inDialog = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
    if(!inDialog) closeLightbox();
  });

  els.lightbox.querySelector(".close").addEventListener("click", closeLightbox);
  els.prevBtn.addEventListener("click", () => step(-1));
  els.nextBtn.addEventListener("click", () => step(1));

  window.addEventListener("keydown", (e) => {
    if(!els.lightbox.open) return;
    if(e.key === "Escape") closeLightbox();
    if(e.key === "ArrowLeft") step(-1);
    if(e.key === "ArrowRight") step(1);
  });
}

function update(){
  state.filtered = filterData();
  render();
}

function main(){
  els.year.textContent = new Date().getFullYear();
  initTheme();
  setHeroImage();
  buildPills();

  els.themeToggle.addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme") || "dark";
    applyTheme(cur === "dark" ? "light" : "dark");
  });

  els.search.addEventListener("input", (e) => {
    state.query = e.target.value || "";
    update();
  });

  wireLightbox();
  update();
}

main();
