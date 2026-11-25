/* ==========================================================
   SWEET DELI DAN – DATA FILE
   Edit ONLY this file to change shop links, menu, or prices.
   ========================================================== */

/* ===== 1. SHOP SETTINGS =====
   Replace these URLs with your real accounts. */
const SHOP = {
  messenger: "https://m.me/YOUR_PAGE_USERNAME",
  facebook:  "https://facebook.com/YOUR_PAGE",
  tiktok:    "https://tiktok.com/@YOUR_HANDLE",
  email:     "sweetdelidan@gmail.com"
};

/* ===== 2. MENU BUILDER =====
   Turns [["Name", price, from?]] into items with unique ids. */
const mk = (prefix, rows) =>
  rows.map(([name, price, from]) => ({
    id: prefix + "-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    price,
    from: !!from
  }));

/* ===== 3. BILAO SETS A–P =====
   Format: [letter, size, kinds, price] */
const sets = [
  ["A","Medium",4,899], ["B","Large",3,1225], ["C","Large",3,1160], ["D","Medium",3,1050],
  ["E","Medium",2,615], ["F","Medium",3,1010], ["G","Medium",3,870],  ["H","Medium",3,1110],
  ["I","Medium",4,1160],["J","Medium",5,1455], ["K","Large",2,1255], ["L","Large",4,1210],
  ["M","Medium",3,950], ["N","Large",2,950],   ["O","Large",5,1160], ["P","Large",5,1475]
].map(([l, s, k, p]) => [`Set ${l} - ${s} Bilao ${k}-In-1`, p]);

/* ===== 4. FOOD BILAO BUNDLES A–I ===== */
const bundles = [2362, 2332, 2483, 4123, 2362, 4422, 4069, 5548, 4278]
  .map((p, i) => [`Food Bilao Bundle ${"ABCDEFGHI"[i]}`, p]);

/* ===== 5. MENU CATEGORIES ===== */
const CATEGORIES = [
  { key: "trays", label: "Kakanin Trays", items: mk("tray", [
      ["Puto Cheese", 534, 1],
      ["Cheese with Latik Sapin-Sapin", 685, 1],
      ["2-In-1 Puto", 750, 1],
      ["2-In-1 Sapin-Sapin & Kutsinta", 927, 1],
      ["Puto Pao", 750, 1],
      ["Cheese Kutsinta", 536, 1],
      ["Coconut Macaroons", 449, 1],
      ["Butchi With Cheese", 544, 1]
    ]) },
  { key: "sets", label: "Kakanin Bilao Sets", items: mk("set", sets) },
  { key: "bundles", label: "Food Bilao Bundles", items: mk("bundle", bundles) },
  { key: "pasta", label: "Pasta/Noodles", items: mk("pasta", [
      ["Spaghetti", 480], ["Carbonara", 500], ["Sotanghon", 650]
    ]) },
  { key: "fried", label: "Fried", items: mk("fried", [
      ["Lumpiang Shanghai", 480, 1],
      ["Fried Chicken", 450, 1],
      ["Mojos", 650, 1],
      ["Calamares", 499, 1]
    ]) },
  { key: "sandwich", label: "Sandwich", items: mk("sand", [
      ["Clubhouse", 350, 1],
      ["Chicken Sandwich", 330, 1],
      ["Egg Sandwich", 300, 1]
    ]) },
  { key: "desserts", label: "Desserts", items: mk("dessert", [
      ["Creamy Maja Blanca", 750, 1],
      ["Mango Graham (Tray)", 550, 1],
      ["Mango Sago (Tray)", 550, 1],
      ["Buko Pandan (Tray)", 550, 1],
      ["Coffee Jelly (Tray)", 500, 1],
      ["Macaroni Salad (Tray)", 600, 1],
      ["Dulce de leche", 50, 1],
      ["Avocado De Leche", 150],
      ["Dulce De Leche Cheesecake", 200],
      ["Leche Plan", 130],
      ["Mango Graham", 130],
      ["Oreo Cheesecake", 200],
      ["Ube", 150]
    ]) }
];

/* ===== 6. FLAT LIST ===== */
const ALL_ITEMS = CATEGORIES.flatMap(c => c.items);

/* ===== 7. BEST SELLERS (ids shown on home carousel) =====
   These ids must match the generated ids exactly. */
const BEST_SELLERS = [
  "set-set-j-medium-bilao-5-in-1",
  "set-set-p-large-bilao-5-in-1",
  "tray-puto-cheese",
  "bundle-food-bilao-bundle-a",
  "dessert-leche-plan"
];

/* ===== 8. EXTRA DETAILS (optional per product) =====
   Add description + size options for any item id:
   "tray-puto-cheese": {
     desc: "Soft puto topped with cheese.",
     opts: [{label:"Small tray", price:534}, {label:"Large tray", price:999}]
   } */
const DETAILS = {};

/* ===== 9. FALLBACK CATEGORY DESCRIPTIONS ===== */
const CAT_DESC = {
  trays:    "Homemade kakanin made fresh and packed in a tray, perfect for family gatherings and celebrations.",
  sets:     "A bilao of assorted homemade kakanin, ready to serve at your celebration. Ask us which kakanin are included.",
  bundles:  "A food bilao bundle for your celebration. Message us for the exact inclusions.",
  pasta:    "Homemade pasta and noodles, freshly prepared for your gathering.",
  fried:    "Freshly fried favorites that are great for sharing.",
  sandwich: "Freshly made sandwiches for snacks, meetings and parties.",
  desserts: "Homemade dessert, chilled and ready to enjoy."
};