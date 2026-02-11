import { renderListWithTemplate } from "./utils.mjs";

export default class ShoppingCart {

    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async init() {
        // the dataSource will return a Promise...so you can use await to resolve it.
        const list = await this.dataSource.getData();
        this.renderList(list);
    }
        
    renderList(list) {

        renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", true);

    }
}