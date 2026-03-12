import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const productID = getParam("product");

const dataSource = new ExternalServices();

// console.log(dataSource.findProductById(productID));

const product = new ProductDetails(productID, dataSource);

product.init();
