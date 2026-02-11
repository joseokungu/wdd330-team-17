import ProductData from './ProductData.mjs';
import ProductList from "./ProductList.mjs";

// creates a data source for the category you want to display
const dataSource = new ProductData('tents');

// selects the element where the product list will render
const element = document.querySelector('.product-list');

// creates the ProductList instance
const productList = new ProductList('Tents', dataSource, element);

// initializes it
productList.init();
