(() => {
  // === Wishlist Utility Functions ===
  function getWishlist() {
    return JSON.parse(localStorage.getItem("wishlist")) || [];
  }

  function saveWishlist(wishlist) {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }

  function removeFromWishlist(id) {
    let wishlist = getWishlist().filter(pid => pid != id);
    saveWishlist(wishlist);
    loadWishlist();
  }

  function updateWishlistCount() {
    const count = getWishlist().length;
    const badge = document.querySelector(".wishlist-count");
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? "inline-block" : "none";
    }
  }

  // === Wishlist UI Button Initialization ===
  window.initWishlistButtons = function () {
    const wishlistButtons = document.querySelectorAll(".add-to-wishlist-btn");
    const wishlist = getWishlist();

    wishlistButtons.forEach(button => {
      const productId = button.getAttribute("data-product-id");
      if (wishlist.includes(productId)) {
        button.classList.add("active");
        button.innerHTML = '<i class="fas fa-heart"></i>';
      } else {
        button.classList.remove("active");
        button.innerHTML = '<i class="far fa-heart"></i>';
      }

      button.onclick = () => toggleWishlist(productId, button);
    });

    updateWishlistCount();
  };

  function toggleWishlist(productId, button) {
    let wishlist = getWishlist();

    if (wishlist.includes(productId)) {
      wishlist = wishlist.filter(id => id !== productId);
      button.classList.remove("active");
      button.innerHTML = '<i class="far fa-heart"></i>';
    } else {
      wishlist.push(productId);
      button.classList.add("active");
      button.innerHTML = '<i class="fas fa-heart"></i>';
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
        showToast("Product is already in the cart");
        toastTimeout = setTimeout(() => {
          toastTimeout = null;
        }, 3000);
      }
      return;
    }

    cart.push({ id: productId, qty: 1 });
    saveCart(cart);
    showToast("Added to cart");
  }

  function showToast(message) {
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

  // === Load Wishlist Page Products ===
  async function loadWishlist() {
    const wishlistContainer = document.getElementById("wishlist-items");
    const wishlist = getWishlist();

    if (!wishlistContainer) return;

    if (wishlist.length === 0) {
      wishlistContainer.innerHTML = '<p class="empty-message">Your wishlist is empty.</p>';
      updateWishlistCount();
      return;
    }

    try {
      const response = await fetch("products.json");
      const products = await response.json();
      wishlistContainer.innerHTML = "";

      wishlist.forEach(productId => {
        const product = products.find(p => p.id == productId);
        if (product) {
          const item = document.createElement("div");
          item.classList.add("wishlist-item", "col-md-5");
          item.innerHTML = `
            <img src="${product.image}" alt="${product.name}" />
            <div class="wishlist-info">
              <h4>${product.name}</h4>
              <p>Price: ₹${product.price}</p>
              <p>Category: ${product.category}</p>
              <button class="add-to-cart-btn theme-btn style-one border-btm" data-product-id="${product.id}">
                <img src="cart.svg"> Add to Cart
              </button>
            </div>
            <button class="remove-wishlist" data-id="${product.id}">
              <i class="fas fa-trash-alt"></i>
            </button>
          `;
          wishlistContainer.appendChild(item);
        }
      });

      // Use event delegation for add-to-cart and remove wishlist buttons
    } catch (err) {
      wishlistContainer.innerHTML = "<p>Error loading wishlist items.</p>";
      console.error("Error loading wishlist:", err);
    }
  }

  // === Event Delegation for wishlist container buttons ===
  document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge();
    updateWishlistCount();
    loadWishlist();

    const wishlistContainer = document.getElementById("wishlist-items");

    if (wishlistContainer) {
      wishlistContainer.addEventListener("click", (event) => {
        const addToCartBtn = event.target.closest(".add-to-cart-btn");
        if (addToCartBtn) {
          const productId = addToCartBtn.getAttribute("data-product-id");
          addToCart(productId);
          return;
        }

        const removeBtn = event.target.closest(".remove-wishlist");
        if (removeBtn) {
          const id = removeBtn.getAttribute("data-id");
          removeFromWishlist(id);
          return;
        }
      });
    }
  });
})();
