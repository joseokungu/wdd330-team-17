import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const productList = document.querySelector(".product-list");
  const cartFooter = document.querySelector(".cart-footer");
  const cartTotalElement = document.querySelector(".cart-total");

  if (cartItems == 0) {
    productList.innerHTML = `<div class="divider"><h2>Empty Cart</h2></div>`;
    cartFooter.classList.add("hide");

    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));

  productList.innerHTML = htmlItems.join("");

  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", removeItemFromCart);
  });

  cartFooter.classList.remove("hide");

  let total = cartItems.reduce(
    (sum, item) => sum + item.FinalPrice * (item.quantity || 1),
    0,
  );

  cartTotalElement.innerHTML = `Total: $${total.toFixed(2)}`;
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images.PrimaryLarge}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: ${item.quantity}</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>

  <button class="remove-item" data-id="${item.Id}">Remove</button>
</li>`;
  // The button for deleting the item. TODO: Make one crd for the same item but adding the quatities.
  return newItem;
}

function removeItemFromCart(product) {
  const productToRemove = product.target.dataset.id;

  let cartItems = getLocalStorage("so-cart") || [];

  // Eliminate just an item with this ID. The first one.
  const index = cartItems.findIndex((item) => item.Id == productToRemove);

  if (index !== -1) {
    // If there are more than 1 of that item with that index, remove 1.
    if (cartItems[index].quantity > 1) {
      cartItems[index].quantity -= 1;
    } else {
      // When the item is valid but just one, remove that item of that index (the ID) from the cart list

      cartItems.splice(index, 1);
    }
  }

  // Save the cart again.
  localStorage.setItem("so-cart", JSON.stringify(cartItems));

  // Load everything again.
  renderCartContents();
}

renderCartContents();
