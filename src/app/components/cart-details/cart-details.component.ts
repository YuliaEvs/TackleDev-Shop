import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css'
})
export class CartDetailsComponent implements OnInit {
  
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    
    // Get a handle to the cart items
    this.cartItems = this.cartService.cartItems;

    // Subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    // Subscribe to the cart totalQuantity
    this.cartService.totalQuanity.subscribe(
      data => this.totalQuantity = data
    );

    // Compute cart total price and quantity
    this.cartService.computeCartTotals();
  }


}
