

function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem("cart"));
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function isInCart(productId) {
  const cart = getCart();
  return cart.some(item => item.id == productId);
}

function isWishlistPage() {
  return window.location.pathname.includes("wishlist.html");
}

function isToastSuppressedPage() {
  return window.location.pathname.includes("product.html");
}

function addToCart(productId, button) {
  // Check login status before proceeding
 const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
if (!isLoggedIn) {
  alert("You need to login first to add items to your cart.");
  window.location.href = "login.html";
  return;
}

  let cart = getCart();
  const existingItem = cart.find(item => item.id == productId);

  if (existingItem) {
    if (button) {
      updateButtonState(button, true);
    }
    if (!isWishlistPage() && !isToastSuppressedPage()) {
      showToast("Product already in cart");
    }
    return;
  }

  cart.push({ id: productId, qty: 1 });
  saveCart(cart);

  if (button) {
    updateButtonState(button, true);
  }

  if (!isWishlistPage() && !isToastSuppressedPage()) {
    showToast("Product added to cart");
  }
}

function updateButtonState(button, isAdded) {
  const icon = '<img src="cart.svg" style="margin-right: 6px; vertical-align: middle;" />';
  const label = isAdded ? "Added" : "Add to Cart";

  button.innerHTML = `${icon} ${label}`;
  button.disabled = isAdded;
  button.classList.toggle("disabled", isAdded);
  button.setAttribute("data-added", isAdded ? "true" : "false");
}

window.updateCartCount = function () {
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById("cart-count");
  if (badge) {
    badge.textContent = totalQty;
    badge.style.display = totalQty > 0 ? "inline-block" : "none";
  }
};

function disableAddedButtons() {
  const cart = getCart();
  const cartIds = cart.map(item => String(item.id));
  const buttons = document.querySelectorAll(".add-to-cart-btn");

  buttons.forEach(button => {
    const productId = button.getAttribute("data-product-id");
    if (cartIds.includes(productId)) {
      updateButtonState(button, true);
    } else {
      updateButtonState(button, false);
    }
  });
}

function showToast(message) {
  if (isToastSuppressedPage()) return;

  const toastContainer = document.getElementById("toast-container");
  if (!toastContainer) return;

  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    background: #14A83A;
    color: #fff;
    padding: 10px 15px;
    border-radius: 5px;
    opacity: 0.95;
    font-size: 15px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    transition: opacity 0.3s ease;
    margin-bottom: 8px;
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  disableAddedButtons();

  document.body.addEventListener("click", (event) => {
    const btn = event.target.closest(".add-to-cart-btn");
    if (btn) {
      const productId = btn.getAttribute("data-product-id");
      if (productId) {
        addToCart(productId, btn);
      }
    }
  });
});
