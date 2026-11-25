/* ==========================================================
   SWEET DELI DAN – VIEW DETAILS MODAL + PHOTO LIGHTBOX
   ========================================================== */

/* ===== 1. STATE ===== */
let cur, curOpt = 0, curQty = 1;

const modal     = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const lightbox  = document.getElementById("lightbox");
const lbImg     = document.getElementById("lbImg");
const lbCap     = document.getElementById("lbCap");
const lbMissing = document.getElementById("lbMissing");

/* ===== 2. OPEN / CLOSE DETAILS ===== */
function openDetails(id) {
  cur = ALL_ITEMS.find(i => i.id === id);
  if (!cur) return;
  curOpt = 0;
  curQty = 1;
  drawModal();
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
}

/* ===== 3. RENDER MODAL CONTENTS ===== */
function drawModal() {
  const i = cur;
  const d = DETAILS[i.id] || {};
  const opts = d.opts || [];
  const cat = CATEGORIES.find(c => c.items.includes(i));
  const price = (opts[curOpt] || i).price;

  /* extract size / variety from name like "Set J - Medium Bilao 5-In-1" */
  const m = i.name.match(/(Medium|Large) Bilao (\d)-In-1/);
  const facts = [
    ["Category", cat.label],
    m && ["Size", m[1]],
    m && ["Variety", m[2] + " kinds of kakanin"]
  ].filter(Boolean);

  modalBody.innerHTML = `
    <div class="dgrid">
      ${photo(`images/${i.id}.jpg`, i.name)}
      <div>
        <span class="tag">${cat.label}</span>
        <h2 id="mTitle">${i.name}</h2>
        <p class="price" style="margin:4px 0">
          ${i.from && !opts.length ? "from " : ""}${peso(price)}
        </p>
        ${i.from && !opts.length ? `
          <p class="note"><i class="fa-solid fa-circle-info"></i>
            Starting price. The final price depends on the size and quantity; we'll confirm it when you order.
          </p>` : ""}
        <p style="margin-top:10px;font-size:.9rem">${d.desc || CAT_DESC[cat.key]}</p>
        <ul class="facts">
          ${facts.map(([a, b]) => `<li><span>${a}</span><b>${b}</b></li>`).join("")}
        </ul>

        ${opts.length ? `
          <h4>Choose an option</h4>
          <div class="chips">
            ${opts.map((o, k) => `
              <button class="chip ${k === curOpt ? "on" : ""}" data-opt="${k}">
                ${o.label} · ${peso(o.price)}
              </button>`).join("")}
          </div>` : ""}

        <h4>Other options in ${cat.label}</h4>
        <div class="chips">
          ${cat.items.filter(x => x !== i).map(x => `
            <button class="chip" data-id="${x.id}">
              ${x.name} · ${x.from ? "from " : ""}${peso(x.price)}
            </button>`).join("")}
        </div>

        <div style="display:flex;gap:14px;align-items:center;margin-top:18px;flex-wrap:wrap">
          <span class="stepper">
            <button data-q="-1" aria-label="Less"><i class="fa-solid fa-minus"></i></button>
            <b>${curQty}</b>
            <button data-q="1" aria-label="More"><i class="fa-solid fa-plus"></i></button>
          </span>
          <button class="btn order" data-add="1">
            <i class="fa-solid fa-cart-plus"></i>Add to Order · ${peso(price * curQty)}
          </button>
        </div>
      </div>
    </div>`;
}

/* ===== 4. MODAL CLICK DELEGATION ===== */
modalBody.onclick = e => {
  const b = e.target.closest("button");
  if (!b) return;

  if (b.dataset.id) {
    openDetails(b.dataset.id);
    modal.scrollTop = 0;
  } else if (b.dataset.opt) {
    curOpt = +b.dataset.opt;
    drawModal();
  } else if (b.dataset.q) {
    curQty = Math.max(1, curQty + +b.dataset.q);
    drawModal();
  } else if (b.dataset.add) {
    const o = (DETAILS[cur.id] || {}).opts;
    Cart.add(o && o.length ? `${cur.id}#${curOpt}` : cur.id, curQty);
    closeModal();
  }
};

document.getElementById("closeModal").onclick = closeModal;
modal.onclick = e => { if (e.target === modal) closeModal(); };

/* ===== 5. FULL PHOTO VIEWER (lightbox) ===== */
function openPhoto(src, cap) {
  lbImg.hidden = false;
  lbMissing.hidden = true;
  lbImg.onerror = () => { lbImg.hidden = true; lbMissing.hidden = false; };
  lbImg.src = src;
  lbCap.textContent = cap;
  lightbox.hidden = false;
}

/* delegate click on any .ph element */
document.addEventListener("click", e => {
  const p = e.target.closest(".ph[data-src]");
  if (p) openPhoto(p.dataset.src, p.dataset.cap);
});

/* close lightbox */
document.getElementById("closeLightbox").onclick = () => { lightbox.hidden = true; };
lightbox.onclick = e => { if (e.target === lightbox) lightbox.hidden = true; };

/* ===== 6. ESC KEY CLOSES TOP-MOST LAYER ===== */
addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if (!lightbox.hidden)       lightbox.hidden = true;
  else if (!modal.hidden)     closeModal();
  else if (typeof drawer !== "undefined") drawer.classList.remove("open");
});