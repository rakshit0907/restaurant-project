// --- Cart state, shared across every page via localStorage ---
const CART_KEY = "th_cart";

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function spinnerHTML(label) {
    return '<div class="spinner-wrap"><div class="spinner"></div><span>${label}</span></div>';
}

function addToCart(item) {
  // item: { _id, name, price }
  const cart = getCart();
  const existing = cart.find(c => c._id === item._id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ _id: item._id, name: item.name, price: item.price, quantity: 1 });
  }
  saveCart(cart);
  flashAddedToCart(item.name);
}

function removeFromCart(itemId) {
  const cart = getCart().filter(c => c._id !== itemId);
  saveCart(cart);
}

function setQuantity(itemId, quantity) {
  let cart = getCart();
  if (quantity <= 0) {
    cart = cart.filter(c => c._id !== itemId);
  } else {
    const existing = cart.find(c => c._id === itemId);
    if (existing) existing.quantity = quantity;
  }
  saveCart(cart);
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

function cartTotal() {
  return getCart().reduce((sum, c) => sum + c.price * c.quantity, 0);
}

function cartCount() {
  return getCart().reduce((sum, c) => sum + c.quantity, 0);
}

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (!badge) return;
  const count = cartCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? "inline-flex" : "none";
}

// Small toast when an item is added, so clicking a menu card feels responsive
function flashAddedToCart(name) {
  let toast = document.getElementById("cartToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "cartToast";
    toast.className = "cart-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = `Added ${name} to cart`;
  toast.classList.remove("show");
  void toast.offsetWidth; // restart animation
  toast.classList.add("show");
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
