async function loadProducts() {
  const tabsContainer = document.querySelector(".category-tabs");
  const productList = document.querySelector(".product-list");
  const tabTemplate = tabsContainer.querySelector(".category-tab");
  const productTemplate = productList.querySelector(".product-card");


  tabsContainer.querySelectorAll(".category-tab:not([style*='display: none'])").forEach(el => el.remove());
  productList.querySelectorAll(".product-card:not([style*='display: none'])").forEach(el => el.remove());

  try {
    const response = await fetch('products.json');
    if (!response.ok) throw new Error('Failed to load products.json');
    const products = await response.json();

    const categories = [...new Set(products.map(p => p.category))];

    //  category tabs
    categories.forEach((cat, index) => {
      const tab = tabTemplate.cloneNode(true);
      tab.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      tab.setAttribute("data-category", cat);
      tab.style.display = "inline-block";

      if (index === 0) {
        tab.classList.add("active");
      }

      tabsContainer.appendChild(tab);
    });

    // Render products by category
    async function renderProducts(products, category = "") {
      productList.querySelectorAll(".product-card:not([style*='display: none'])").forEach(el => el.remove());

      const filtered = category ? products.filter(p => p.category === category) : products;

      if (!Array.isArray(filtered)) {
        console.error("Filtered products is not an array", filtered);
        return;
      }

      const fragment = document.createDocumentFragment();

      filtered.forEach(product => {
        const card = productTemplate.cloneNode(true);
        card.style.display = "block";
        card.setAttribute("data-id", product.id);
        card.setAttribute("data-category", product.category);

        card.querySelector(".product-image").src = product.image;
        card.querySelector(".product-image").alt = product.name;
        card.querySelector(".product-name").textContent = product.name;
        card.querySelector(".product-price").textContent = `₹${product.price}`;

        const btn = card.querySelector(".add-to-cart-btn");
        btn.setAttribute("data-product-id", String(product.id));

        const wishlistBtn = card.querySelector(".add-to-wishlist-btn");
        wishlistBtn.setAttribute("data-product-id", String(product.id));

        fragment.appendChild(card);
      });

      productList.appendChild(fragment);

      // Wait one full render frame
      requestAnimationFrame(() => {
        if (typeof disableAddedButtons === 'function') {
          disableAddedButtons();
        }
        if (typeof disableWishlistedButtons === 'function') {
          disableWishlistedButtons();
        }

        // ✅ Initialize wishlist buttons after rendering
        if (typeof initWishlistButtons === 'function') {
          initWishlistButtons();
        }
      });
    }

    // Initial product render
    await renderProducts(products, categories[0]);

    // Tab switching
    tabsContainer.addEventListener("click", async (e) => {
      if (e.target.classList.contains("category-tab")) {
        tabsContainer.querySelectorAll(".category-tab").forEach(tab => tab.classList.remove("active"));
        e.target.classList.add("active");

        const selectedCategory = e.target.getAttribute("data-category");
        await renderProducts(products, selectedCategory);
      }
    });

  } catch (error) {
    console.error("Error loading products:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadProducts);
