import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {

    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }
    
    async init() {
        this.product = await this.dataSource.findProductById(this.productId);
        this.renderProductDetails();
        document.getElementById('addToCart')
            .addEventListener('click', this.addProductToCart.bind(this));
    }

    addProductToCart() {
        const cartItems = getLocalStorage("so-cart") || [];

        const existingItem = cartItems.find((item) => item.Id === this.product.Id);

        if (existingItem) {

                existingItem.quantity += 1;            
            
        } else {
            
            this.product.quantity = 1;
            cartItems.push(this.product);
        }
        

        setLocalStorage("so-cart", cartItems);
    }

    renderProductDetails() {

        const product = this.product

        let category = document.querySelector('.category-detail');
        category.textContent = product.Category.charAt(0).toUpperCase() + product.Category.slice(1);

        let h3 = document.querySelector('.card__brand');
        h3.textContent = product.Brand.Name;
        
        let h2 = document.querySelector('.card__name');
        h2.textContent = product.NameWithoutBrand;

        let productImage = document.getElementById('productImage');
        productImage.src = product.Images.PrimaryLarge;
        productImage.alt = product.NameWithoutBrand;

        let price = document.querySelector('.product-card__price');
        price.textContent = `Price: $4${product.FinalPrice}`;
        
        let color = document.querySelector('.product__color');
        color.textContent = `Color(s): ${product.Colors[0].ColorName}`;

        let description = document.querySelector('.product__description')
        description.innerHTML = `Descripton: ${product.DescriptionHtmlSimple}`;

        let addToCart = document.getElementById('addToCart')
        addToCart.dataset.id = product.Id;
    }
}