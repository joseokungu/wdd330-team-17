import { setLocalStorage, getLocalStorage } from '../js/utils.mjs';
import ProductData from '../js/ProductData.mjs';

// create the data source
const dataSource = new ProductData('tents');

// get the product id from the URL
const productId = new URLSearchParams(window.location.search).get('product');

// add product to cart (cart must be an array)
function addProductToCart(product) {
  let cart = getLocalStorage('so-cart');

  if (!cart) {
    cart = [];
  }

  cart.push(product);
  setLocalStorage('so-cart', cart);
}

// add to cart button handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// product detail HTML template
function productDetailTemplate(product) {
  return `
    <h2 class="divider">${product.Brand}</h2>
    <h1 class="divider">${product.Name}</h1>
    <img
      class="divider"
      src="${product.Image}"
      alt="Image of ${product.Name}"
    />
    <p class="product-card__price">$${product.Price}</p>
    <p class="divider">${product.Description}</p>
  `;
}

// initialize page
async function init() {
  const product = await dataSource.findProductById(productId);

  // render product
  const productElement = document.querySelector('.product-detail');
  productElement.innerHTML = productDetailTemplate(product);

  // set product id on button
  const addToCartButton = document.getElementById('addToCart');
  addToCartButton.dataset.id = product.Id;
  addToCartButton.addEventListener('click', addToCartHandler);
}

// run when page loads
init();
