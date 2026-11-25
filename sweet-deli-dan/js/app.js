/* ==========================================================
   SWEET DELI DAN – APP LAYOUT, MENU, ROUTER
   ========================================================== */

/* ===== 1. NAVIGATION CONFIG ===== */
const NAV = [
  ["home",    "Home",     "fa-house"],
  ["menu",    "Menu",     "fa-utensils"],
  ["contact", "Contacts", "fa-phone"],
  ["about",   "About",    "fa-circle-info"]
];

/* ===== 2. INJECT HEADER ===== */
document.getElementById("header").innerHTML = `
  <header class="header">
    <img src="images/logo.png" alt="Sweet Deli Dan logo" onerror="this.style.visibility='hidden'">
    <nav class="nav">${NAV.map(([k, t, i]) =>
      `<a href="#${k}" data-nav="${k}"><i class="fa-solid ${i}"></i>${t}</a>`).join("")}
    </nav>
    <div class="search-wrap">
      <i class="fa-solid fa-magnifying-glass"></i>
      <input id="search" class="search" type="search" placeholder="search" aria-label="Search menu">
    </div>
    <button class="btn sm" id="openCart">
      <i class="fa-solid fa-cart-shopping"></i>ORDER NOW! (<span id="cartCount">0</span>)
    </button>
  </header>`;

/* ===== 3. INJECT FOOTER (matches prototype) ===== */
document.getElementById("footer").innerHTML = `
  <footer class="footer">
    <div>
      <a class="fl" href="#home">Home</a>
      <a class="fl" href="#about">About Us</a>
      <a class="fl" href="#contact">Contact Us</a>
    </div>
    <div class="mid">
      <a class="btn sm" style="background:var(--pink)" href="${SHOP.messenger}" target="_blank" rel="noopener">Order now via Messenger</a>
      <p class="script" style="font-size:1.8rem;margin-top:8px"><b>Sweet Deli Dan</b></p>
      <p>HOMEMADE KAKANIN<br>&amp; DESSERTS</p>
      <em>"Grace before Grind"</em>
      <div class="social">
        <a href="${SHOP.facebook}"  target="_blank" rel="noopener" aria-label="Facebook"  style="color:#1877f2"><i class="fa-brands fa-facebook"></i></a>
        <a href="${SHOP.tiktok}"    target="_blank" rel="noopener" aria-label="TikTok"    style="color:#000"><i class="fa-brands fa-tiktok"></i></a>
        <a href="${SHOP.messenger}" target="_blank" rel="noopener" aria-label="Messenger" style="color:#0084ff"><i class="fa-brands fa-facebook-messenger"></i></a>
        <a href="mailto:${SHOP.email}" aria-label="Email" style="color:#ea4335"><i class="fa-solid fa-envelope"></i></a>
      </div>
    </div>
    <div class="right">
      <p>Daet, Camarines Norte</p>
      <p>Open: 8:00 am - 6:00 pm</p>
      <p>${SHOP.email}</p>
    </div>
  </footer>
  <div class="copy">© 2026 Sweet Deli Dan PH</div>`;

/* ===== 4. WIRE CONTACT PAGE LINKS ===== */
document.getElementById("fb").href = SHOP.facebook;
document.getElementById("tt").href = SHOP.tiktok;
document.getElementById("em").href = "mailto:" + SHOP.email;
document.getElementById("ms").href = SHOP.messenger;

/* ===== 5. HELPERS ===== */
const peso = n => "₱" + n.toLocaleString("en-PH");
const esc  = s => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

/* photo: clickable wrapper that opens the full-size viewer */
const photo = (file, cap) => `
  <div class="ph" data-src="${file}" data-cap="${esc(cap)}" title="Click to view full photo">
    <img src="${file}" alt="${esc(cap)}" onerror="this.remove()">
    <i class="fa-solid fa-image"></i>
    <span class="zoom"><i class="fa-solid fa-expand"></i></span>
  </div>`;

/* product card */
const card = i => `
  <article class="card">
    ${photo(`images/${i.id}.jpg`, i.name)}
    <h3>${i.name}</h3>
    <p class="price">${i.from ? "from " : ""}${peso(i.price)}</p>
    <div class="btns">
      <button class="btn sm" onclick="openDetails('${i.id}')">View Details</button>
      <button class="btn sm order" onclick="Cart.add('${i.id}')"><i class="fa-solid fa-cart-plus"></i>ORDER NOW!</button>
    </div>
  </article>`;

/* ===== 6. MENU RENDERING + SEARCH ===== */
let menuQ = "";
let activeCat = CATEGORIES[0].key;

function renderMenu() {
  /* tabs: active tab shows highlighted only when not searching */
  document.getElementById("tabs").innerHTML = CATEGORIES.map(c =>
    `<button class="tab ${c.key === activeCat && !menuQ ? "on" : ""}" data-k="${c.key}">${c.label}</button>`
  ).join("");

  /* items: either search across all, or category view */
  const items = menuQ
    ? ALL_ITEMS.filter(i => i.name.toLowerCase().includes(menuQ))
    : CATEGORIES.find(c => c.key === activeCat).items;

  document.getElementById("menuGrid").innerHTML =
    items.map(card).join("") || "<p>No items found. Try another search.</p>";
}

/* tab clicks */
document.getElementById("tabs").onclick = e => {
  if (e.target.dataset.k) {
    activeCat = e.target.dataset.k;
    menuQ = "";
    renderMenu();
  }
};

/* LIVE search (filters while typing) */
document.getElementById("search").addEventListener("input", e => {
  menuQ = e.target.value.trim().toLowerCase();
  renderMenu();
  /* jump to menu page when user types */
  if (menuQ && location.hash !== "#menu") location.hash = "#menu";
});

renderMenu();

/* ===== 7. HOME PAGE: hero + best seller carousel ===== */
document.getElementById("heroSlot").innerHTML =
  photo("images/hero.jpg", "Sweet Deli Dan kakanin buffet table");

const best = BEST_SELLERS.map(id => ALL_ITEMS.find(i => i.id === id)).filter(Boolean);
let n = 0;

function showSlide() {
  if (!best.length) return;
  const i = best[n];
  document.getElementById("slide").innerHTML = `
    ${photo(`images/${i.id}.jpg`, i.name)}
    <div>
      <h2>${i.name}</h2>
      <p class="price">${peso(i.price)}</p>
      <button class="btn" onclick="openDetails('${i.id}')">View Details</button>
    </div>`;
  /* dots */
  document.getElementById("dots").innerHTML = best.map((_, k) =>
    `<span style="display:inline-block;width:18px;height:18px;border-radius:50%;margin:10px 5px;background:${k === n ? "var(--pink)" : "#fff"}"></span>`
  ).join("");
}

document.getElementById("prev").onclick = () => { n = (n + best.length - 1) % best.length; showSlide(); };
document.getElementById("next").onclick = () => { n = (n + 1) % best.length; showSlide(); };
showSlide();

/* ===== 8. ROUTER ===== */
function route() {
  const p = NAV.some(([k]) => "#" + k === location.hash) ? location.hash.slice(1) : "home";
  document.querySelectorAll("[data-page]").forEach(s => s.hidden = s.dataset.page !== p);
  document.querySelectorAll("[data-nav]").forEach(a => a.classList.toggle("active", a.dataset.nav === p));
  scrollTo(0, 0);
}
addEventListener("hashchange", route);
route();