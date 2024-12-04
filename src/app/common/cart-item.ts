import { Product } from "./product";

export class CartItem {
    addToCart(theCartItem: CartItem) {
      throw new Error('Method not implemented.');
    }

    id: string;
    name: string;
    imageUrl: string;
    unitPrice: number;

    quantity: number;

    constructor(product: Product) {

        if (!product.id || !product.name || !product.imageUrl || product.unitPrice === undefined) {
            throw new Error('Invalid product data');
        }

        this.id = product.id;
        this.name = product.name;
        this.imageUrl = product.imageUrl;
        this.unitPrice = product.unitPrice;

        this.quantity = 1;
    }

}

