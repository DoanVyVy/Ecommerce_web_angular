import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { CartItem, Order } from '../../core/model/object-model';
import { CustomerService } from './customer.service';
import { CartService } from './cart-service.service';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  constructor(
    private cartService: CartService,
    private customerService: CustomerService
  ) {}

  checkout(): Observable<any> {
    return this.cartService.getAllItems().pipe(
      mergeMap((cartItems: CartItem[]) => {
        // Calculate total price
        const totalAmount = this.cartService.getTotalPrice();

        const products = cartItems.map((item) => item.product);

        const order = {
          userId: Number(sessionStorage.getItem('user_session_id')), // Replace with actual user ID
          products,
          deliveryAddress: {
            id: 1,
            addLine1: sessionStorage.getItem('ad1') || '',
            addLine2: sessionStorage.getItem('ad1') || '',
          },
          contact: sessionStorage.getItem('contact') || '',
          dateTime: new Date().toISOString(),
          totalAmount,
        };

        // Insert order using customerService
        return this.customerService.insertNewOrder(order);
      })
    );
  }
}
