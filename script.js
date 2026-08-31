/* =========================================================
   Amma Care Meals — App Logic
   Note: cart state is kept in-memory (no localStorage) so it
   resets on page reload — swap in a backend/DB for production.
========================================================= */

/* ---------------- CONFIG ---------------- */
const RESTAURANT_PHONE = "94761234567"; // WhatsApp number in international format, no +
const DELIVERY_CHARGE = 150; // LKR flat delivery fee
const FREE_DELIVERY_MIN = 3000; // orders above this get free delivery

/* ---------------- DATA: MENU ---------------- */
const CATEGORIES = [
  { id: "breakfast",   ta: "காலை உணவு",        en: "Breakfast" },
  { id: "traditional", ta: "பாரம்பரிய உணவு",    en: "Traditional Meals" },
  { id: "ricecurry",   ta: "சாதம் & கறி",       en: "Rice & Curry" },
  { id: "millet",      ta: "சிறுதானியம்",       en: "Millet Foods" },
  { id: "veg",         ta: "சைவம்",             en: "Vegetarian" },
  { id: "nonveg",      ta: "அசைவம்",            en: "Non-Vegetarian" },
  { id: "special",     ta: "சிறப்பு உணவு",       en: "Special Meals" },
  { id: "drinks",      ta: "பானங்கள்",          en: "Drinks" },
];

const MENU = [
  { id: 1, cat: "breakfast",   nameTa: "இடியப்பம்",              nameEn: "Idiyappam",             descTa: "மென்மையான அரிசி இடியப்பம், தேங்காய் சம்பலுடன்.", descEn: "Soft steamed rice noodles, served with coconut sambol.", price: 15,  veg: true,  icon: "🍜" },
  { id: 2, cat: "breakfast",   nameTa: "பிட்டு",                  nameEn: "Pittu",                  descTa: "தேங்காயுடன் ஆவியில் வேகவைத்த அரிசி பிட்டு.", descEn: "Steamed rice flour and coconut, layered and fluffy.", price: 150, veg: true,  icon: "🍚" },
  { id: 3, cat: "breakfast",   nameTa: "கிரிபாத் (பால் சாதம்)",    nameEn: "Milk Rice (Kiribath)",   descTa: "பாரம்பரிய முறையில் தயாரிக்கப்பட்ட பால் சாதம்.", descEn: "Traditional coconut-milk rice, a wholesome morning classic.", price: 180, veg: true,  icon: "🍙" },
  { id: 4, cat: "breakfast",   nameTa: "முட்டை ஹொப்பர்",          nameEn: "Egg Hoppers",            descTa: "மொறுமொறு ஹொப்பருடன் ஒரு புதிய முட்டை.", descEn: "Crispy bowl-shaped hoppers with a fresh egg centre.", price: 200, veg: false, icon: "🥚" },

  { id: 5, cat: "traditional", nameTa: "பாரம்பரிய சாப்பாடு தட்டு", nameEn: "Traditional Set Meal",  descTa: "சாதம், பருப்பு, கறி மற்றும் துவையல் அடங்கிய முழு தட்டு.", descEn: "Rice, dhal, curries and chutney served as a complete set.", price: 550, veg: true,  icon: "🍛" },
  { id: 6, cat: "traditional", nameTa: "பட்டிக்காலோவ கூல்",       nameEn: "Batticaloa Kool",        descTa: "எங்கள் பிராந்தியத்திற்கே உரிய பாரம்பரிய கடல் உணவு சூப்.", descEn: "A regional traditional seafood soup unique to Batticaloa.", price: 850, veg: false, icon: "🍲" },

  { id: 7, cat: "ricecurry",   nameTa: "வெஜ் மீல்ஸ்",             nameEn: "Veg Meals",              descTa: "சாதம் மற்றும் பருவகால காய்கறி கறிகள் கலந்த தட்டு.", descEn: "Rice served with a variety of seasonal vegetable curries.", price: 600, veg: true,  icon: "🥗" },
  { id: 8, cat: "ricecurry",   nameTa: "மீன் கறி சாதம்",          nameEn: "Fish Curry Rice",        descTa: "காரமான மீன் கறியுடன் வெந்த வெள்ளை சாதம்.", descEn: "Steamed rice served with our home-style spiced fish curry.", price: 900, veg: false, icon: "🐟" },
  { id: 9, cat: "ricecurry",   nameTa: "கோழி கறி சாதம்",          nameEn: "Chicken Curry Rice",     descTa: "நாட்டு முறை கோழி கறியுடன் சாதம்.", descEn: "Steamed rice with country-style chicken curry.", price: 850, veg: false, icon: "🍗" },

  { id: 10, cat: "millet",     nameTa: "குரக்கன் பிட்டு",          nameEn: "Ragi Puttu",             descTa: "குரக்கன் மாவால் தயாரிக்கப்பட்ட ஆரோக்கிய பிட்டு.", descEn: "Steamed finger-millet pittu, a fibre-rich alternative.", price: 180, veg: true,  icon: "🌾" },
  { id: 11, cat: "millet",     nameTa: "கம்பு தோசை",              nameEn: "Kurakkan Roti",          descTa: "கம்பு மாவுடன் தயாரித்த மொறுமொறு தோசை.", descEn: "Crisp pearl-millet flatbread, cooked fresh to order.", price: 130, veg: true,  icon: "🫓" },
  { id: 12, cat: "millet",     nameTa: "சிறுதானிய கஞ்சி",         nameEn: "Millet Kanji",           descTa: "கலப்பு சிறுதானியங்களால் தயாரித்த சூடான கஞ்சி.", descEn: "Warm porridge made from a mix of traditional millets.", price: 120, veg: true,  icon: "🥣" },

  { id: 13, cat: "veg",        nameTa: "பருப்பு சாப்பாடு தட்டு",   nameEn: "Dhal Curry Set",         descTa: "பருப்பு, பாசி மற்றும் காய்கறிகளுடன் கூடிய சைவ தட்டு.", descEn: "A full vegetarian plate with dhal, greens and vegetables.", price: 500, veg: true,  icon: "🥘" },
  { id: 14, cat: "veg",        nameTa: "காய்கறி கொத்து",          nameEn: "Vegetable Kottu",        descTa: "தாளிக்கப்பட்ட காய்கறிகளுடன் கலந்த கொத்து ரொட்டி.", descEn: "Chopped roti stir-fried with seasoned vegetables.", price: 480, veg: true,  icon: "🥙" },

  { id: 15, cat: "nonveg",     nameTa: "தோசை சிக்கன் ரைஸ்",       nameEn: "Dosa Chicken Rice",      descTa: "தோசையுடன் வழங்கப்படும் கோழி கறி சாதம் காம்போ.", descEn: "A hearty combo of dosa served alongside chicken curry rice.", price: 850, veg: false, icon: "🍽️" },
  { id: 16, cat: "nonveg",     nameTa: "மீன் கறி சாதம்",          nameEn: "Fish Curry Rice",        descTa: "காரமான மீன் கறியுடன் வெந்த வெள்ளை சாதம்.", descEn: "Steamed rice served with our home-style spiced fish curry.", price: 900, veg: false, icon: "🐟" },

  { id: 17, cat: "special",    nameTa: "பட்டிக்காலோவ கடல் தட்டு",  nameEn: "Batticaloa Seafood Set", descTa: "பிராந்திய கடல் உணவுகளின் சிறப்பு கலவை தட்டு.", descEn: "A special combination plate of regional seafood dishes.", price: 1450, veg: false, icon: "🦐" },
  { id: 18, cat: "special",    nameTa: "குடும்ப விருந்து பாக்ஸ்",  nameEn: "Family Feast Box",       descTa: "4 பேருக்கான கலவை உணவுகள் அடங்கிய பெட்டி.", descEn: "A mixed box of meals suited for a family of four.", price: 2200, veg: false, icon: "🍱" },

  { id: 19, cat: "drinks",     nameTa: "மூலிகை தேநீர்",           nameEn: "Herbal Tea",             descTa: "பாரம்பரிய மூலிகைகளுடன் தயாரிக்கப்பட்ட சூடான தேநீர்.", descEn: "Hot tea brewed with traditional herbs.", price: 100, veg: true, icon: "🍵" },
  { id: 20, cat: "drinks",     nameTa: "தம்பிலி (இளநீர்)",        nameEn: "Thambili (King Coconut)", descTa: "புதிய இளநீர், இயற்கையான குளிர்பானம்.", descEn: "Fresh king coconut water, a natural refreshing drink.", price: 150, veg: true, icon: "🥥" },
];

/* ---------------- DATA: DELIVERY AREAS ---------------- */
const AREAS = ["Batticaloa Town", "Kallady", "Kaluwanchikudy", "Kattankudy", "Eravur", "Vavunathivu"];

/* ---------------- DATA: REVIEWS ---------------- */
const REVIEWS = [
  { nameTa: "பிரியா செல்வம்", nameEn: "Priya Selvam", textTa: "வீட்டில் அம்மா சமைப்பது போன்ற சுவை. மிகவும் ஆரோக்கியமான உணவு!", textEn: "Tastes just like my mother's cooking. Truly healthy food!" },
  { nameTa: "ரமேஷ் குமார்", nameEn: "Ramesh Kumar", textTa: "வேலைக்கு செல்லும் நான் தினமும் இங்கிருந்துதான் மதிய உணவு ஆர்டர் செய்கிறேன்.", textEn: "As a working professional, I order my lunch from here every single day." },
  { nameTa: "ஜெயந்தி ராஜா", nameEn: "Jeyanthi Raja", textTa: "என் பெற்றோருக்கும் இது மிகவும் பொருத்தமான, எளிதில் ஜீரணிக்கக்கூடிய உணவு.", textEn: "Gentle, easy-to-digest food that's perfect for my elderly parents." },
  { nameTa: "கமலன் தேவராஜ்", nameEn: "Kamalan Devaraj", textTa: "Delivery மிக விரைவாகவும் உணவு சூடாகவும் வந்தது. மிகவும் திருப்தி!", textEn: "Delivery was fast and the food arrived hot. Very satisfied!" },
  { nameTa: "நிலா அன்பரசு", nameEn: "Nila Anbarasu", textTa: "சிறுதானிய உணவுகள் மிகவும் சுவையாக இருந்தது. குழந்தைகளுக்கும் பிடித்தது.", textEn: "The millet dishes were delicious — even my kids loved them." },
];

/* ---------------- DATA: GALLERY ---------------- */
const GALLERY = [
  { cat: "food", ta: "உணவு", en: "Food", icon: "🍛" },
  { cat: "food", ta: "உணவு", en: "Food", icon: "🥗" },
  { cat: "restaurant", ta: "உணவகம்", en: "Restaurant", icon: "🏠" },
  { cat: "family", ta: "குடும்பம்", en: "Family", icon: "👨‍👩‍👧" },
  { cat: "healthy", ta: "ஆரோக்கியம்", en: "Healthy Food", icon: "🌾" },
  { cat: "preparation", ta: "தயாரிப்பு", en: "Preparation", icon: "👩‍🍳" },
  { cat: "food", ta: "உணவு", en: "Food", icon: "🍲" },
  { cat: "restaurant", ta: "உணவகம்", en: "Restaurant", icon: "🍽️" },
  { cat: "healthy", ta: "ஆரோக்கியம்", en: "Healthy Food", icon: "🥥" },
  { cat: "preparation", ta: "தயாரிப்பு", en: "Preparation", icon: "🔥" },
  { cat: "family", ta: "குடும்பம்", en: "Family", icon: "🍱" },
  { cat: "food", ta: "உணவு", en: "Food", icon: "🍜" },
];

/* ---------------- STATE ---------------- */
let currentLang = "ta";
let cart = []; // { id, qty }
let currentMenuFilter = "all";
let currentGalleryFilter = "all";

/* =========================================================
   LANGUAGE SWITCHER
========================================================= */
function setLang(lang){
  currentLang = lang;
  document.body.setAttribute("data-lang", lang);
  document.querySelectorAll("[data-ta][data-en]").forEach(el => {
    el.textContent = lang === "ta" ? el.getAttribute("data-ta") : el.getAttribute("data-en");
  });
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.langBtn === lang);
  });
  renderMenu();
  renderCartUI();
  renderGallery();
  document.documentElement.lang = lang;
}
document.querySelectorAll(".lang-btn").forEach(btn=>{
  btn.addEventListener("click", ()=> setLang(btn.dataset.langBtn));
});

/* =========================================================
   HEADER: sticky shadow + mobile nav
========================================================= */
const header = document.getElementById("siteHeader");
window.addEventListener("scroll", ()=>{
  header.style.boxShadow = window.scrollY > 10 ? "0 6px 20px rgba(74,44,32,0.08)" : "none";
});

const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileNav = document.getElementById("mobileNav");
hamburgerBtn.addEventListener("click", ()=>{
  const open = mobileNav.classList.toggle("open");
  hamburgerBtn.classList.toggle("open", open);
  hamburgerBtn.setAttribute("aria-expanded", open);
});
mobileNav.querySelectorAll("a").forEach(a=> a.addEventListener("click", ()=>{
  mobileNav.classList.remove("open");
  hamburgerBtn.classList.remove("open");
}));

/* =========================================================
   MENU: tabs + grid + cart controls
========================================================= */
const menuTabsEl = document.getElementById("menuTabs");
const menuGridEl = document.getElementById("menuGrid");

function buildMenuTabs(){
  const allTab = document.createElement("button");
  allTab.className = "menu-tab active";
  allTab.dataset.cat = "all";
  allTab.textContent = currentLang === "ta" ? "அனைத்தும்" : "All";
  menuTabsEl.appendChild(allTab);

  CATEGORIES.forEach(cat=>{
    const tab = document.createElement("button");
    tab.className = "menu-tab";
    tab.dataset.cat = cat.id;
    tab.textContent = currentLang === "ta" ? cat.ta : cat.en;
    menuTabsEl.appendChild(tab);
  });

  menuTabsEl.addEventListener("click", (e)=>{
    const btn = e.target.closest(".menu-tab");
    if(!btn) return;
    currentMenuFilter = btn.dataset.cat;
    menuTabsEl.querySelectorAll(".menu-tab").forEach(t=>t.classList.toggle("active", t===btn));
    renderMenuGrid();
  });
}

function renderMenu(){
  menuTabsEl.innerHTML = "";
  buildMenuTabs();
  // restore active state visually for current filter
  menuTabsEl.querySelectorAll(".menu-tab").forEach(t=>{
    t.classList.toggle("active", t.dataset.cat === currentMenuFilter);
  });
  renderMenuGrid();
}

function getQty(id){
  const item = cart.find(c=>c.id===id);
  return item ? item.qty : 0;
}

function renderMenuGrid(){
  const items = currentMenuFilter === "all" ? MENU : MENU.filter(m=>m.cat===currentMenuFilter);
  menuGridEl.innerHTML = "";
  items.forEach(item=>{
    const qty = getQty(item.id);
    const card = document.createElement("div");
    card.className = "food-card";
    card.innerHTML = `
      <div class="food-photo">
        <span class="veg-badge ${item.veg ? "veg" : "nonveg"}">${item.veg ? (currentLang==="ta"?"சைவம்":"Veg") : (currentLang==="ta"?"அசைவம்":"Non-Veg")}</span>
        ${item.icon}
      </div>
      <div class="food-body">
        <div class="food-name-ta">${item.nameTa}</div>
        <div class="food-name-en">${item.nameEn}</div>
        <div class="food-desc">${currentLang === "ta" ? item.descTa : item.descEn}</div>
        <div class="food-footer">
          <div class="food-price">Rs. ${item.price.toLocaleString()}</div>
          <div class="qty-selector">
            <button type="button" data-action="dec" data-id="${item.id}" aria-label="Decrease">−</button>
            <span data-qty-display="${item.id}">${qty}</span>
            <button type="button" data-action="inc" data-id="${item.id}" aria-label="Increase">+</button>
          </div>
        </div>
        <button class="add-cart-btn ${qty>0 ? "in-cart" : ""}" data-add="${item.id}">
          ${qty>0 ? (currentLang==="ta"?`✓ Cart-இல் (${qty})`:`✓ In Cart (${qty})`) : (currentLang==="ta"?"Cart-இல் சேர்க்க":"Add to Cart")}
        </button>
      </div>`;
    menuGridEl.appendChild(card);
  });
}

menuGridEl.addEventListener("click",(e)=>{
  const incBtn = e.target.closest("[data-action='inc']");
  const decBtn = e.target.closest("[data-action='dec']");
  const addBtn = e.target.closest("[data-add]");

  if(incBtn){
    const id = Number(incBtn.dataset.id);
    bumpQtyDisplay(id, 1);
  }
  if(decBtn){
    const id = Number(decBtn.dataset.id);
    bumpQtyDisplay(id, -1);
  }
  if(addBtn){
    const id = Number(addBtn.dataset.add);
    const displaySpan = menuGridEl.querySelector(`[data-qty-display="${id}"]`);
    let qty = Number(displaySpan.textContent) || 1;
    if(qty < 1) qty = 1;
    addToCart(id, qty);
  }
});

function bumpQtyDisplay(id, delta){
  const span = menuGridEl.querySelector(`[data-qty-display="${id}"]`);
  let val = Number(span.textContent) + delta;
  if(val < 0) val = 0;
  span.textContent = val;
}

/* =========================================================
   CART
========================================================= */
function addToCart(id, qty){
  if(qty <= 0) return;
  const existing = cart.find(c=>c.id===id);
  if(existing){ existing.qty += qty; }
  else { cart.push({ id, qty }); }
  renderCartUI();
  renderMenuGrid();
  flashCartButton();
}

function removeFromCart(id){
  cart = cart.filter(c=>c.id!==id);
  renderCartUI();
  renderMenuGrid();
}

function changeCartQty(id, delta){
  const item = cart.find(c=>c.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0){ removeFromCart(id); return; }
  renderCartUI();
  renderMenuGrid();
}

function cartSubtotal(){
  return cart.reduce((sum,c)=>{
    const menuItem = MENU.find(m=>m.id===c.id);
    return sum + (menuItem ? menuItem.price * c.qty : 0);
  },0);
}
function cartCount(){ return cart.reduce((s,c)=>s+c.qty,0); }
function cartDeliveryFee(){
  const sub = cartSubtotal();
  if(sub === 0) return 0;
  return sub >= FREE_DELIVERY_MIN ? 0 : DELIVERY_CHARGE;
}

function renderCartUI(){
  const cartItemsEl = document.getElementById("cartItems");
  const subtotalEl = document.getElementById("cartSubtotal");
  const deliveryEl = document.getElementById("cartDelivery");
  const totalEl = document.getElementById("cartTotal");
  const countBadge = document.getElementById("cartCountBadge");
  const floatingCartBtn = document.getElementById("floatingCartBtn");
  const floatingCartText = document.getElementById("floatingCartText");

  cartItemsEl.innerHTML = "";
  if(cart.length === 0){
    const empty = document.createElement("p");
    empty.className = "cart-empty";
    empty.textContent = currentLang === "ta" ? "உங்கள் Cart காலியாக உள்ளது." : "Your cart is empty.";
    cartItemsEl.appendChild(empty);
  } else {
    cart.forEach(c=>{
      const item = MENU.find(m=>m.id===c.id);
      if(!item) return;
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <div class="cart-item-icon">${item.icon}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${currentLang==="ta"?item.nameTa:item.nameEn}</div>
          <div class="cart-item-price">Rs. ${item.price.toLocaleString()} x ${c.qty} = Rs. ${(item.price*c.qty).toLocaleString()}</div>
          <div class="cart-item-remove" data-remove="${c.id}">${currentLang==="ta"?"நீக்கு":"Remove"}</div>
        </div>
        <div class="qty-selector">
          <button type="button" data-cartdec="${c.id}" aria-label="Decrease">−</button>
          <span>${c.qty}</span>
          <button type="button" data-cartinc="${c.id}" aria-label="Increase">+</button>
        </div>`;
      cartItemsEl.appendChild(row);
    });
  }

  const sub = cartSubtotal();
  const delivery = cartDeliveryFee();
  subtotalEl.textContent = "Rs. " + sub.toLocaleString();
  deliveryEl.textContent = delivery === 0 && sub > 0 ? (currentLang==="ta"?"இலவசம்":"Free") : "Rs. " + delivery.toLocaleString();
  totalEl.textContent = "Rs. " + (sub + delivery).toLocaleString();

  const count = cartCount();
  countBadge.textContent = count;
  floatingCartText.textContent = (currentLang==="ta" ? `${count} பொருட்கள் – Rs. ${sub.toLocaleString()}` : `${count} Items – Rs. ${sub.toLocaleString()}`);
  floatingCartBtn.classList.toggle("show", count > 0);
}

document.getElementById("cartItems").addEventListener("click",(e)=>{
  const rm = e.target.closest("[data-remove]");
  const inc = e.target.closest("[data-cartinc]");
  const dec = e.target.closest("[data-cartdec]");
  if(rm) removeFromCart(Number(rm.dataset.remove));
  if(inc) changeCartQty(Number(inc.dataset.cartinc), 1);
  if(dec) changeCartQty(Number(dec.dataset.cartdec), -1);
});

function flashCartButton(){
  const btn = document.getElementById("cartOpenBtn");
  btn.style.transform = "scale(1.15)";
  setTimeout(()=> btn.style.transform = "scale(1)", 180);
}

/* ---- Cart drawer open/close ---- */
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
function openCart(){ cartDrawer.classList.add("open"); cartOverlay.classList.add("show"); }
function closeCart(){ cartDrawer.classList.remove("open"); cartOverlay.classList.remove("show"); }
document.getElementById("cartOpenBtn").addEventListener("click", openCart);
document.getElementById("floatingCartBtn").addEventListener("click", openCart);
document.getElementById("cartCloseBtn").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

/* =========================================================
   CHECKOUT MODAL
========================================================= */
const checkoutModal = document.getElementById("checkoutModal");
const checkoutOverlay = document.getElementById("checkoutOverlay");
const custAreaSelect = document.getElementById("custArea");
AREAS.forEach(a=>{
  const opt = document.createElement("option");
  opt.value = a; opt.textContent = a;
  custAreaSelect.appendChild(opt);
});

function openCheckout(){
  if(cart.length === 0){
    alert(currentLang==="ta" ? "தயவுசெய்து முதலில் Cart-இல் உணவு சேர்க்கவும்." : "Please add items to your cart first.");
    return;
  }
  closeCart();
  checkoutModal.classList.add("open");
  checkoutOverlay.classList.add("show");
}
function closeCheckout(){
  checkoutModal.classList.remove("open");
  checkoutOverlay.classList.remove("show");
}
document.getElementById("checkoutBtn").addEventListener("click", openCheckout);
document.getElementById("checkoutCloseBtn").addEventListener("click", closeCheckout);
checkoutOverlay.addEventListener("click", closeCheckout);
document.getElementById("offerOrderBtn").addEventListener("click", ()=>{
  document.getElementById("menu").scrollIntoView({behavior:"smooth"});
});
document.getElementById("exploreMilletBtn").addEventListener("click", ()=>{
  currentMenuFilter = "millet";
  renderMenu();
  document.getElementById("menu").scrollIntoView({behavior:"smooth"});
});
document.getElementById("viewFamilyBtn").addEventListener("click", ()=>{
  currentMenuFilter = "special";
  renderMenu();
  document.getElementById("menu").scrollIntoView({behavior:"smooth"});
});

/* ---- Order number generator ---- */
function generateOrderNumber(){
  const now = new Date();
  const stamp = now.getFullYear().toString().slice(-2) + String(now.getMonth()+1).padStart(2,"0") + String(now.getDate()).padStart(2,"0");
  const rand = Math.floor(1000 + Math.random()*9000);
  return `ACM-${stamp}-${rand}`;
}

let lastOrder = null;

function buildOrderText(order){
  const lines = [];
  lines.push(`Hello Amma Care Meals, I would like to place an order.`);
  lines.push(``);
  lines.push(`Order No: ${order.orderNumber}`);
  lines.push(`Name: ${order.name}`);
  lines.push(`Phone: ${order.phone}`);
  lines.push(`Address: ${order.address}, ${order.area}`);
  if(order.notes) lines.push(`Notes: ${order.notes}`);
  lines.push(``);
  lines.push(`Items:`);
  order.items.forEach(it=>{
    lines.push(`- ${it.nameEn} (${it.nameTa}) x${it.qty} = Rs. ${it.lineTotal.toLocaleString()}`);
  });
  lines.push(``);
  lines.push(`Subtotal: Rs. ${order.subtotal.toLocaleString()}`);
  lines.push(`Delivery: ${order.delivery === 0 ? "Free" : "Rs. " + order.delivery.toLocaleString()}`);
  lines.push(`Total: Rs. ${order.total.toLocaleString()}`);
  lines.push(`Payment: Cash on Delivery`);
  return lines.join("\n");
}

function whatsappLink(text){
  return `https://wa.me/${RESTAURANT_PHONE}?text=${encodeURIComponent(text)}`;
}

// Generic floating / hero / contact / footer WhatsApp buttons (no cart context)
const genericWaMsg = "Hello Amma Care Meals, I would like to place an order.";
["heroWhatsapp","floatingWhatsapp","contactWhatsapp","footerWhatsapp"].forEach(id=>{
  const el = document.getElementById(id);
  if(el){
    el.addEventListener("click",(e)=>{
      e.preventDefault();
      window.open(whatsappLink(genericWaMsg), "_blank");
    });
  }
});

document.getElementById("checkoutForm").addEventListener("submit",(e)=>{
  e.preventDefault();
  submitOrder();
});
document.getElementById("checkoutWhatsappBtn").addEventListener("click", ()=>{
  if(!validateCheckoutForm()) return;
  const order = collectOrder();
  window.open(whatsappLink(buildOrderText(order)), "_blank");
  submitOrder(); // also show confirmation
});

function validateCheckoutForm(){
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const address = document.getElementById("custAddress").value.trim();
  if(!name || !phone || !address){
    alert(currentLang==="ta" ? "தயவுசெய்து அனைத்து அவசிய தகவல்களையும் நிரப்பவும்." : "Please fill in all required fields.");
    return false;
  }
  return true;
}

function collectOrder(){
  const items = cart.map(c=>{
    const m = MENU.find(mm=>mm.id===c.id);
    return { nameTa: m.nameTa, nameEn: m.nameEn, qty: c.qty, lineTotal: m.price*c.qty };
  });
  const subtotal = cartSubtotal();
  const delivery = cartDeliveryFee();
  return {
    orderNumber: generateOrderNumber(),
    name: document.getElementById("custName").value.trim(),
    phone: document.getElementById("custPhone").value.trim(),
    address: document.getElementById("custAddress").value.trim(),
    area: document.getElementById("custArea").value,
    notes: document.getElementById("custNotes").value.trim(),
    items, subtotal, delivery, total: subtotal + delivery
  };
}

function submitOrder(){
  if(!validateCheckoutForm()) return;
  const order = collectOrder();
  lastOrder = order;
  closeCheckout();
  showConfirmation(order);
  cart = [];
  renderCartUI();
  renderMenuGrid();
  document.getElementById("checkoutForm").reset();
}

/* =========================================================
   ORDER CONFIRMATION MODAL
========================================================= */
const confirmModal = document.getElementById("confirmModal");
const confirmOverlay = document.getElementById("confirmOverlay");

function showConfirmation(order){
  const summaryEl = document.getElementById("orderSummary");
  const itemsHtml = order.items.map(it=>`<p>${currentLang==="ta"?it.nameTa:it.nameEn} x${it.qty} — Rs. ${it.lineTotal.toLocaleString()}</p>`).join("");
  summaryEl.innerHTML = `
    <p><strong>${currentLang==="ta"?"Order எண்":"Order No"}:</strong> ${order.orderNumber}</p>
    <p><strong>${currentLang==="ta"?"பெயர்":"Name"}:</strong> ${order.name}</p>
    <hr>
    ${itemsHtml}
    <hr>
    <p><strong>${currentLang==="ta"?"மொத்தம்":"Total"}:</strong> Rs. ${order.total.toLocaleString()}</p>
    <p><strong>${currentLang==="ta"?"முகவரி":"Address"}:</strong> ${order.address}, ${order.area}</p>
    <p><strong>${currentLang==="ta"?"கட்டணம்":"Payment"}:</strong> Cash on Delivery</p>
  `;
  confirmModal.classList.add("open");
  confirmOverlay.classList.add("show");
}
document.getElementById("confirmWhatsappBtn").addEventListener("click", ()=>{
  if(lastOrder) window.open(whatsappLink(buildOrderText(lastOrder)), "_blank");
});
document.getElementById("confirmHomeBtn").addEventListener("click", ()=>{
  confirmModal.classList.remove("open");
  confirmOverlay.classList.remove("show");
  window.location.hash = "#home";
});
confirmOverlay.addEventListener("click", ()=>{
  confirmModal.classList.remove("open");
  confirmOverlay.classList.remove("show");
});

/* =========================================================
   MEMBERSHIP JOIN BUTTONS
========================================================= */
document.querySelectorAll(".join-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const plan = btn.dataset.plan;
    const msg = `Hello Amma Care Meals, I would like to join the ${plan} membership plan.`;
    window.open(whatsappLink(msg), "_blank");
  });
});

/* =========================================================
   DELIVERY AREA CHIPS
========================================================= */
const areaChipsEl = document.getElementById("areaChips");
AREAS.forEach(a=>{
  const chip = document.createElement("span");
  chip.className = "area-chip";
  chip.textContent = a;
  areaChipsEl.appendChild(chip);
});

/* =========================================================
   TESTIMONIALS
========================================================= */
const reviewTrack = document.getElementById("reviewTrack");
REVIEWS.forEach(r=>{
  const card = document.createElement("div");
  card.className = "review-card";
  card.innerHTML = `
    <div class="review-stars">★★★★★</div>
    <p class="review-text" data-ta="${r.textTa}" data-en="${r.textEn}">${r.textTa}</p>
    <div class="review-name" data-ta="${r.nameTa}" data-en="${r.nameEn}">${r.nameTa}</div>
  `;
  reviewTrack.appendChild(card);
});

/* =========================================================
   GALLERY
========================================================= */
const galleryFiltersEl = document.getElementById("galleryFilters");
const galleryGridEl = document.getElementById("galleryGrid");
const GALLERY_CATS = [
  { id: "all", ta: "அனைத்தும்", en: "All" },
  { id: "food", ta: "உணவு", en: "Food" },
  { id: "restaurant", ta: "உணவகம்", en: "Restaurant" },
  { id: "family", ta: "குடும்பம்", en: "Family" },
  { id: "healthy", ta: "ஆரோக்கியம்", en: "Healthy Food" },
  { id: "preparation", ta: "தயாரிப்பு", en: "Preparation" },
];

function buildGalleryFilters(){
  galleryFiltersEl.innerHTML = "";
  GALLERY_CATS.forEach(c=>{
    const btn = document.createElement("button");
    btn.className = "gallery-filter" + (c.id===currentGalleryFilter ? " active" : "");
    btn.dataset.cat = c.id;
    btn.textContent = currentLang==="ta" ? c.ta : c.en;
    galleryFiltersEl.appendChild(btn);
  });
}
galleryFiltersEl.addEventListener("click",(e)=>{
  const btn = e.target.closest(".gallery-filter");
  if(!btn) return;
  currentGalleryFilter = btn.dataset.cat;
  galleryFiltersEl.querySelectorAll(".gallery-filter").forEach(b=>b.classList.toggle("active", b===btn));
  renderGalleryGrid();
});

function renderGalleryGrid(){
  const items = currentGalleryFilter === "all" ? GALLERY : GALLERY.filter(g=>g.cat===currentGalleryFilter);
  galleryGridEl.innerHTML = "";
  items.forEach((g)=>{
    const div = document.createElement("div");
    div.className = "gallery-item";
    div.innerHTML = `${g.icon}<span>${currentLang==="ta"?g.ta:g.en}</span>`;
    div.addEventListener("click", ()=> openLightbox(g));
    galleryGridEl.appendChild(div);
  });
}
function renderGallery(){
  buildGalleryFilters();
  renderGalleryGrid();
}

const lightbox = document.getElementById("lightbox");
const lightboxOverlay = document.getElementById("lightboxOverlay");
function openLightbox(g){
  document.getElementById("lightboxContent").innerHTML = g.icon;
  lightbox.classList.add("open");
  lightboxOverlay.classList.add("show");
}
function closeLightbox(){
  lightbox.classList.remove("open");
  lightboxOverlay.classList.remove("show");
}
document.getElementById("lightboxCloseBtn").addEventListener("click", closeLightbox);
lightboxOverlay.addEventListener("click", closeLightbox);

/* =========================================================
   COUNTDOWN TIMER (resets daily at midnight)
========================================================= */
function updateCountdown(){
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24,0,0,0);
  const diff = midnight - now;
  const h = Math.floor(diff / (1000*60*60));
  const m = Math.floor((diff % (1000*60*60)) / (1000*60));
  const s = Math.floor((diff % (1000*60)) / 1000);
  document.getElementById("cdH").textContent = String(h).padStart(2,"0");
  document.getElementById("cdM").textContent = String(m).padStart(2,"0");
  document.getElementById("cdS").textContent = String(s).padStart(2,"0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* =========================================================
   INIT
========================================================= */
setLang("ta");
