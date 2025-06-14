const tabsContainer = document.querySelector(".category-tabs");
const productList = document.querySelector(".product-list");
const productTemplate = productList.querySelector(".product-card");

// Clear existing tabs and products except hidden template
tabsContainer.innerHTML = ""; // Remove all category tabs
productList.querySelectorAll(".product-card:not([style*='display: none'])").forEach(el => el.remove());

async function loadProducts() {
  try {
    const response = await fetch('products.json');
    if (!response.ok) throw new Error('Failed to load products.json');
    const products = await response.json();

    // Render all products
    products.forEach(product => {
      const card = productTemplate.cloneNode(true);
      card.style.display = "block";
      card.setAttribute("data-id", product.id);
      card.setAttribute("data-category", product.category);

      card.querySelector(".product-image").src = product.image;
      card.querySelector(".product-image").alt = product.name;
      card.querySelector(".product-name").textContent = product.name;
      card.querySelector(".product-price").textContent = `₹${product.price}`;

      const btn = card.querySelector(".add-to-cart-btn");
      btn.setAttribute("data-product-id", product.id);

      const wishlistBtn = card.querySelector(".add-to-wishlist-btn");
      wishlistBtn.setAttribute("data-product-id", product.id);

      productList.appendChild(card);
    });

  } catch (error) {
    console.error("Error loading products:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadProducts);
