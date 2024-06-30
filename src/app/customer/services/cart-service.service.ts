import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, CartItem, Product } from '../../core/model/object-model'; // Adjust the import path as necessary
import { CheckoutNumService } from '../../shared/services/checkout-num.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemsSubject: BehaviorSubject<CartItem[]> = new BehaviorSubject<
    CartItem[]
  >([]);
  cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  constructor(private checkoutNumService: CheckoutNumService) {
    // Retrieve cart items from storage (could be local storage or session storage)
    const storedCartItems = JSON.parse(
      localStorage.getItem('cartItems') || '[]'
    );
    this.cartItemsSubject.next(storedCartItems);
  }

  addToCart(product: Product, quantity: number): void {
    let currentCartItems = this.cartItemsSubject.getValue();
    const existingItemIndex = currentCartItems.findIndex(
      (i) => i.product.id === product.id
    );

    if (existingItemIndex !== -1) {
      // Item already exists in cart, update quantity
      currentCartItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      const cartItem: CartItem = {
        productId: product.id,
        product,
        quantity,
      };
      currentCartItems = [...currentCartItems, cartItem];
    }

    // Update local storage
    localStorage.setItem('cartItems', JSON.stringify(currentCartItems));
    // Notify subscribers
    this.cartItemsSubject.next(currentCartItems);
  }

  removeFromCart(productId: number): void {
    let currentCartItems = this.cartItemsSubject.getValue();
    currentCartItems = currentCartItems.filter(
      (i) => i.productId !== productId
    );

    // Update local storage
    localStorage.setItem('cartItems', JSON.stringify(currentCartItems));
    // Notify subscribers
    this.cartItemsSubject.next(currentCartItems);
  }

  getCartItemById(productId: number): CartItem | undefined {
    const currentCartItems = this.cartItemsSubject.getValue();
    return currentCartItems.find((item) => item.productId === productId);
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.getValue();
  }

  getAllItems(): Observable<CartItem[]> {
    return this.cartItems$;
  }

  getTotalPrice(): number {
    const currentCartItems = this.cartItemsSubject.getValue();
    return currentCartItems.reduce(
      (acc, item) => acc + item.product.dp * item.quantity,
      0
    );
  }

  clearCart(): void {
    localStorage.removeItem('cartItems');
    this.cartItemsSubject.next([]);
  }
}
