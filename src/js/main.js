import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';

// creates a data source for the category you want to display
const dataSource = new ProductData('tents');

// selects the element where the product list will render
const listElement = document.querySelector('.product-list');

// creates the ProductList instance
const productList = new ProductList('tents', dataSource, listElement);

// initializes it
productList.init();
