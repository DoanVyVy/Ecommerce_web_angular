import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart-service.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartItem } from '../../core/model/object-model';
import { CheckoutNumService } from '../../shared/services/checkout-num.service';
import { CheckoutService } from '../services/checkout.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  shippingFee: number = 0;
  totalIncludingTaxes: number = 0;

  constructor(
    private cartService: CartService,
    private checkoutNum: CheckoutNumService,
    private checkoutService: CheckoutService
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      this.calculateTotals();
    });
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.calculateTotals();
    this.checkoutNum.updateCheckoutNum(this.cartItems.length);
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  private calculateTotals(): void {
    this.subtotal = this.getTotalPrice();
    this.totalIncludingTaxes = this.subtotal + this.shippingFee;
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity > 0) {
      item.quantity = quantity;
      this.calculateTotals();
    }
  }

  checkout(): void {
    this.checkoutService.checkout().subscribe(
      () => {
        alert(`Your order has been successfully placed.`);
        this.cartItems = []; // Clear cart items if needed
        this.checkoutNum.updateCheckoutNum(0);
      },
      (error) => {
        console.error('Failed to place order:', error);
        alert(`Failed to place order. Please try again later.`);
      }
    );
  }
}
