import { getLocalStorage, setLocalStorage, alertMessage, removeAllAlerts } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
  // convert the form data to a JSON object
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

function packageItems(items) {
  const simplifiedItems = items.map((item) => {
    console.log(item);
    return {
      id: item.Id,
      price: item.FinalPrice,
      name: item.Name,
      quantity: 1,
    };
  });
  return simplifiedItems;
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key);
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    // calculate and display the total dollar amount of the items in the cart, and the number of items.
    const orderSummary = document.querySelector(this.outputSelector);

    const itemCount = this.list.reduce((sum, item) => sum + (item.quantity || 1), 0);
    this.itemTotal = this.list.reduce(
      (sum, item) => sum + (item.FinalPrice * item.quantity),
      0
    );

    const subtotalEl = orderSummary.querySelector("#cartTotal");
    if (subtotalEl) subtotalEl.innerText = `$${this.itemTotal.toFixed(2)}`;

    const itemsEl = orderSummary.querySelector("#num-items");
    if (itemsEl) itemsEl.innerText = `${itemCount} items`;
  }

  calculateOrderTotal() {
    // calculate the tax and shipping amounts. Add those to the cart total to figure out the order total

    this.tax = this.itemTotal * 0.06;
    this.shipping = 10 + (this.list.reduce((sum, item) => sum + (item.quantity || 1), 0) - 1) * 2;
    
    this.orderTotal = (
      
      parseFloat(this.itemTotal) +
      parseFloat(this.tax) +
      parseFloat(this.shipping)
    )

    // display the totals.
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    // once the totals are all calculated display them in the order summary page

    const orderSummary = document.querySelector(this.outputSelector);

    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotal = document.querySelector(`${this.outputSelector} #orderTotal`);
    const tax = orderSummary.querySelector("#tax");

    tax.innerText = `$${this.tax.toFixed(2)}`;
    shipping.innerText = `$${this.shipping.toFixed(2)}`;
    orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;

  }

  async checkout() {

    const formElement = document.forms["checkoutForm"];

    const order = formDataToJSON(formElement);

    order.orderDate = new Date().toISOString();
    order.orderTotal = this.orderTotal;
    order.tax = this.tax;
    order.shipping = this.shipping;
    order.items = packageItems(this.list);
    console.log(order);

    try {
      const response = await services.checkout(order);

      console.log(response);
      
      // Empty the cart once the checkout works
      setLocalStorage("so-cart", []);

      // Go to a page for succesfull shipment
      location.assign("/checkout/success.html");

    } catch (err) {

      removeAllAlerts();
      
      for (let message in err.message) {
        
        alertMessage(err.message[message]);
      
      }
        // console.log(err);
    }
  }
}