

const tabsContainer = document.querySelector(".category-tabs");
const productList = document.querySelector(".product-list");
const productTemplate = productList.querySelector(".product-card");


tabsContainer.innerHTML = "";
productList.querySelectorAll(".product-card:not([style*='display: none'])").forEach(el => el.remove());


function getWishlist() {
  try {
    const wishlist = JSON.parse(localStorage.getItem("wishlist"));
    return Array.isArray(wishlist) ? wishlist : [];
  } catch {
    return [];
  }
}

function saveWishlist(wishlist) {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function updateWishlistCount() {
  const wishlist = getWishlist();
  const badge = document.querySelector(".wishlist-count") || document.getElementById("wishlist-count");
  if (badge) {
    badge.textContent = wishlist.length;
    badge.style.display = wishlist.length > 0 ? "inline-block" : "none";
  }
}

function toggleWishlist(productId) {
  let wishlist = getWishlist();
  const index = wishlist.indexOf(productId);

  if (index !== -1) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push(productId);
  }

  saveWishlist(wishlist);
  updateWishlistCount();
}

// === Cart Functions ===
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
  updateCartBadge();
}

function updateCartBadge() {
  const cart = getCart();
  const count = cart.reduce((total, item) => total + (item.quantity || item.qty || 0), 0);
  const badge = document.getElementById("cart-count");

  if (badge) {
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = "inline-block";
    } else {
      badge.style.display = "none";
    }
  }
}

let toastTimeout = null;

function addToCart(productId) {
  let cart = getCart();
  const existingItem = cart.find(item => item.id == productId);

  if (existingItem) {
    if (!toastTimeout) {
      showToastOnce("Product is already in the cart");
    }
    return;
  }

  cart.push({ id: productId, qty: 1 });
  saveCart(cart);
  showToastOnce("Added to cart");
}

function showToastOnce(message) {
  if (toastTimeout) return;

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

  toastTimeout = setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.remove();
      toastTimeout = null;
    }, 300);
  }, 3000);
}

// === Load and Render Products ===
async function loadProducts() {
  try {
    const response = await fetch('products.json');
    if (!response.ok) throw new Error('Failed to load products.json');
    const products = await response.json();

    const wishlist = getWishlist();

    products.forEach(product => {
      const card = productTemplate.cloneNode(true);
      card.style.display = "block";
      card.setAttribute("data-id", product.id);
      card.setAttribute("data-category", product.category);

      card.querySelector(".product-image").src = product.image;
      card.querySelector(".product-image").alt = product.name;
      card.querySelector(".product-name").textContent = product.name;
      card.querySelector(".product-price").textContent = `₹${product.price}`;

      const cartBtn = card.querySelector(".add-to-cart-btn");
      cartBtn.setAttribute("data-product-id", product.id);
      cartBtn.addEventListener("click", () => addToCart(product.id));

      const wishlistBtn = card.querySelector(".add-to-wishlist-btn");
      wishlistBtn.setAttribute("data-product-id", product.id);

      const heartIcon = wishlistBtn.querySelector("i");

      if (wishlist.includes(product.id)) {
        wishlistBtn.classList.add("active");
        heartIcon.classList.remove("far");
        heartIcon.classList.add("fas");
      }

      wishlistBtn.addEventListener("click", () => {
        toggleWishlist(product.id);

        wishlistBtn.classList.toggle("active");
        const isActive = wishlistBtn.classList.contains("active");

        heartIcon.classList.toggle("fas", isActive);
        heartIcon.classList.toggle("far", !isActive);
      });

      productList.appendChild(card);
    });

    updateCartBadge();
    updateWishlistCount();
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadProducts);
