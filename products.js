// products.js

import { addToCart } from './addToCart.js';

document.addEventListener("DOMContentLoaded", () => {
  const addToCartButtons = document.querySelectorAll(".add-to-cart");

  addToCartButtons.forEach(button => {
    button.addEventListener("click", () => {
      const productCard = button.closest(".product-card");
      const productId = productCard.dataset.productId;
      const productName = productCard.querySelector(".product-name").textContent;
      const productPrice = parseFloat(productCard.querySelector(".product-price").textContent.replace("₹", ""));
      const productImage = productCard.querySelector("img").src;

      const product = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage
      };

      addToCart(product);
    });
  });
});
