const tabsContainer = document.querySelector(".category-tabs");
const productList = document.querySelector(".product-list");
const tabTemplate = tabsContainer.querySelector(".category-tab");
const productTemplate = productList.querySelector(".product-card");

// Clear existing tabs/products except hidden templates
tabsContainer.querySelectorAll(".category-tab:not([style*='display: none'])").forEach(el => el.remove());
productList.querySelectorAll(".product-card:not([style*='display: none'])").forEach(el => el.remove());

async function loadProducts() {
  try {
    const response = await fetch('products.json');
    if (!response.ok) throw new Error('Failed to load products.json');
    const products = await response.json();

    // Unique categories
    const categories = [...new Set(products.map(p => p.category))];

    // Create "All" tab
    // const allTab = tabTemplate.cloneNode(true);
    // allTab.textContent = "All";
    // allTab.setAttribute("data-category", "");
    // allTab.style.display = "inline-block";
    // allTab.classList.add("active");
    // tabsContainer.appendChild(allTab);

    // Create category tabs
    categories.forEach(cat => {
      const tab = tabTemplate.cloneNode(true);
      tab.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      tab.setAttribute("data-category", cat);
      tab.style.display = "inline-block";
      tabsContainer.appendChild(tab);
    });

    // Render products function
    function renderProducts(category = "") {
      productList.querySelectorAll(".product-card:not([style*='display: none'])").forEach(el => el.remove());

      const filtered = category ? products.filter(p => p.category === category) : products;

    //   filtered.forEach(product => {
    //     const card = productTemplate.cloneNode(true);
    //     card.style.display = "block";
    //     card.setAttribute("data-id", product.id);
    //     card.setAttribute("data-category", product.category);

    //     card.querySelector(".product-image").src = product.image;
    //     card.querySelector(".product-image").alt = product.name;
    //     card.querySelector(".product-name").textContent = product.name;
    //     card.querySelector(".product-price").textContent = `₹${product.price}`;
    //     const btn = card.querySelector(".add-to-cart-btn");
    //     btn.setAttribute("data-product-id", product.id);

    //     productList.appendChild(card);
    //   });
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
  btn.setAttribute("data-product-id", product.id);

  // Set data-product-id for wishlist button too
  const wishlistBtn = card.querySelector(".add-to-wishlist-btn");
  wishlistBtn.setAttribute("data-product-id", product.id);

  productList.appendChild(card);
});

    }

    // Initial render all
    renderProducts();

    // Tab click listener
    tabsContainer.addEventListener("click", e => {
      if (e.target.classList.contains("category-tab")) {
        tabsContainer.querySelectorAll(".category-tab").forEach(tab => tab.classList.remove("active"));
        e.target.classList.add("active");
        const selectedCategory = e.target.getAttribute("data-category");
        renderProducts(selectedCategory);
      }
    });

  } catch (error) {
    console.error("Error loading products:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadProducts);
