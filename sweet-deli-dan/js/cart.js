/* ==========================================================
   SWEET DELI DAN – CART + ORDER DRAWER
   Cart persists in localStorage so refresh doesn't lose items.
   ========================================================== */

const Cart = {
  /* ----- storage ----- */
  items: JSON.parse(localStorage.getItem("sdd-cart") || "{}"),
  save() { localStorage.setItem("sdd-cart", JSON.stringify(this.items)); this.render(); },

  /* ----- actions ----- */
  add(key, q = 1) {
    this.items[key] = (this.items[key] || 0) + q;
    this.save();
    /* open drawer AFTER it exists */
    const dr = document.getElementById("drawer");
    if (dr) dr.classList.add("open");
  },
  change(key, d) {
    this.items[key] = (this.items[key] || 0) + d;
    if (this.items[key] < 1) delete this.items[key];
    this.save();
  },

  /* ----- resolve cart entries to display objects ----- */
  lines() {
    return Object.entries(this.items).flatMap(([key, q]) => {
      const [id, o] = key.split("#");
      const it = ALL_ITEMS.find(x => x.id === id);
      const op = o === undefined ? null : ((DETAILS[id] || {}).opts || [])[o];
      if (!it || (o !== undefined && !op)) return [];
      return [{
        ...it,
        key,
        q,
        name: op ? `${it.name} (${op.label})` : it.name,
        price: op ? op.price : it.price,
        from: !op && it.from
      }];
    });
  },

  total() { return this.lines().reduce((s, l) => s + l.price * l.q, 0); },

  /* ----- render drawer contents + badge ----- */
  render() {
    const L = this.lines();
    const countEl = document.getElementById("cartCount");
    const linesEl = document.getElementById("cartLines");
    const totalEl = document.getElementById("cartTotal");
    if (!countEl || !linesEl || !totalEl) return;

    countEl.textContent = L.reduce((s, l) => s + l.q, 0);
    linesEl.innerHTML = L.map(l => `
      <div class="line">
        <span>${l.name}${l.from ? " (from)" : ""}</span>
        <span class="qty">
          <button aria-label="Less" onclick="Cart.change('${l.key}',-1)"><i class="fa-solid fa-minus"></i></button>
          ${l.q}
          <button aria-label="More" onclick="Cart.change('${l.key}',1)"><i class="fa-solid fa-plus"></i></button>
          <button aria-label="Remove" onclick="Cart.change('${l.key}',-999)" style="border-color:var(--red);color:var(--red)"><i class="fa-solid fa-trash"></i></button>
        </span>
        <b>${peso(l.price * l.q)}</b>
      </div>`).join("") ||
      `<p><i class="fa-solid fa-cart-arrow-down"></i> Your order is empty. Pick something from the menu.</p>`;
    totalEl.textContent = peso(this.total());
  },

  /* ----- build text message for messenger / email ----- */
  message(f) {
    const rows = this.lines().map(l => `• ${l.q} x ${l.name} - ${peso(l.price * l.q)}`).join("\n");
    return `Hi Sweet Deli Dan! I'd like to order:\n${rows}\n\nTotal: ${peso(this.total())} (final price confirmed by shop)\nName: ${f.name.value}\nContact: ${f.phone.value}\n${f.type.value} on ${f.date.value}\nAddress/Notes: ${f.notes.value || "-"}`;
  },

  /* ----- submit order (messenger / email) ----- */
  submit(e) {
    e.preventDefault();
    if (!this.total()) return alert("Add at least one item first.");

    const text = this.message(e.target);

    /* find which button was clicked using the submitter */
    const submitter = e.submitter;
    const via = submitter ? submitter.value : "messenger";
    const isEmail = via === "email";

    navigator.clipboard?.writeText(text);
    alert(isEmail
      ? "Opening your email app."
      : "Order details copied! Paste them in Messenger and press send.");

    window.open(
      isEmail
        ? `mailto:${SHOP.email}?subject=Order&body=${encodeURIComponent(text)}`
        : SHOP.messenger,
      "_blank"
    );
  }
};

/* ===== inject drawer HTML (after footer so it overlays) ===== */
document.body.insertAdjacentHTML("beforeend", `
  <aside id="drawer" aria-label="Your order">
    <button class="btn sm" id="closeCart"><i class="fa-solid fa-xmark"></i>Close</button>
    <h2 style="margin:12px 0"><i class="fa-solid fa-basket-shopping"></i> Your Order</h2>
    <div id="cartLines"></div>
    <p class="price">Total: <span id="cartTotal">₱0</span></p>
    <form id="orderForm">
      <input name="name" placeholder="Your name" required>
      <input name="phone" placeholder="Mobile number" required>
      <select name="type"><option>Pick-up</option><option>Delivery</option></select>
      <input name="date" type="date" required>
      <textarea name="notes" placeholder="Address / special requests" rows="2"></textarea>
      <div class="btns">
        <button class="btn order" value="messenger"><i class="fa-brands fa-facebook-messenger"></i>Messenger</button>
        <button class="btn" value="email"><i class="fa-solid fa-envelope"></i>Email</button>
      </div>
    </form>
  </aside>`);

/* ===== wire drawer controls ===== */
const drawer = document.getElementById("drawer");
document.getElementById("openCart").onclick  = () => drawer.classList.add("open");
document.getElementById("closeCart").onclick = () => drawer.classList.remove("open");
document.getElementById("orderForm").onsubmit = e => Cart.submit(e);

/* ===== initial render ===== */
Cart.render();