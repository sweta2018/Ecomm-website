// Load products and initialize cart rendering
document.addEventListener("DOMContentLoaded", async () => {
  const cart = getCart();
  const products = await fetchProducts();
  renderCart(cart, products);
  updateCartCount();  // Make sure badge updates on load
});

// Get cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart to localStorage
function saveCart(cart) {
  if (cart.length === 0) {
    localStorage.removeItem("cart");
  } else {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  updateCartCount();
}

// Fetch product data from JSON
async function fetchProducts() {
  const response = await fetch("products.json");
  return await response.json();
}

// Render all cart items
function renderCart(cart, products) {
  const cartItemsContainer = document.getElementById("cart-items");
  cartItemsContainer.innerHTML = "";

  let total = 0;

  cart.forEach(item => {
    const product = products.find(p => p.id == item.id);
    if (!product) return;

    const quantity = Number(item.qty) || 0;
    const subtotal = product.price * quantity;
    total += subtotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td width="150"><img src="${product.image}" class="product-img bg-image hover-overlay hover-zoom ripple rounded-circle" alt="${product.name}"></td>
      <td width="400" class="item_name">${product.name}</td>
      <td width="200" class="price_final">₹${product.price}</td>
      <td width="400">
        <div class="qty-controls">
          <button class="decrease-btn btn btn-primary qnty_btn" data-id="${item.id}">−</button>
          <span class="qty-display" id="form1">${quantity}</span>
          <button class="increase-btn btn btn-primary qnty_btn" data-id="${item.id}">+</button>
        </div>
      </td>
      <td width="100" class="item-subtotal">₹${subtotal}</td>
      <td width="100"><span class="remove-btn btn_trash" data-id="${item.id}"><i class="fas fa-trash-alt"></i></span></td>
    `;
    cartItemsContainer.appendChild(row);
  });

  // Update totals
  updateCartSummary(total);

  // Setup event listeners
  setupEventListeners(cart, products);
}

// Update order summary section with shipping logic
function updateCartSummary(cartTotal) {
  const shippingText = document.getElementById("shipping-text");
  const freeText = document.getElementById("free");
  const cartTotalElement = document.getElementById("cart-total");
  const grandTotalElement = document.getElementById("grand-total");

  cartTotalElement.textContent = ` ₹${cartTotal}`;

  let shippingCharge = 5;

  if (cartTotal >= 500) {
    shippingText.style.textDecoration = "line-through";
    shippingText.textContent = "₹5";
    freeText.style.display = "inline";
    shippingCharge = 0;
  } else {
    shippingText.style.textDecoration = "none";
    shippingText.textContent = "₹5";
    freeText.style.display = "none";
    shippingCharge = 5;
  }

  const grandTotal = cartTotal + shippingCharge;
  grandTotalElement.innerHTML = `<strong>₹${grandTotal}</strong>`;
}

// Attach event listeners for +, -, and remove
function setupEventListeners(cart, products) {
  // Increase quantity
  document.querySelectorAll(".increase-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const item = cart.find(i => i.id == id);
      item.qty += 1;
      saveCart(cart);
      renderCart(cart, products);
    });
  });

  // Decrease quantity
  document.querySelectorAll(".decrease-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const item = cart.find(i => i.id == id);
      if (item.qty > 1) {
        item.qty -= 1;
        saveCart(cart);
        renderCart(cart, products);
      } else {
       
        const index = cart.indexOf(item);
        if (index > -1) {
          cart.splice(index, 1);
          saveCart(cart);
          renderCart(cart, products);
        }
      }
    });
  });

  // Remove item
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const index = cart.findIndex(i => i.id == id);
      if (index !== -1) {
        cart.splice(index, 1);
        saveCart(cart);
        renderCart(cart, products);
      }
    });
  });
}

// Update cart badge count globally
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalQty = cart.reduce((sum, item) => sum + (item.qty || 0), 0);
  const badge = document.getElementById("cart-count");
  if (badge) {
    badge.textContent = totalQty;
    badge.style.display = totalQty > 0 ? "inline-block" : "none";
  }
}
