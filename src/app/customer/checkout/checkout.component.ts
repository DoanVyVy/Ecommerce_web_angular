import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Order, Product, User, Address } from '../../core/model/object-model';
import { CustomerService } from '../services/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'], // Corrected to `styleUrls`
})
export class CheckoutComponent implements OnInit {
  single_product_id: any;
  user_id: any;
  individual_product!: Product;
  user_detail!: User;
  user_address!: Address;
  user_contact_no: any;
  order_dto!: Order;

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.customerService.currentProduct.subscribe(
      (product) => (this.single_product_id = product)
    );
    this.user_id = Number(sessionStorage.getItem('user_session_id'));
    this.productDetail(this.single_product_id);
    this.userAddress(this.user_id);
  }

  productDetail(single_product_id: any): void {
    this.customerService.individualProduct(single_product_id).subscribe(
      (data) => {
        this.individual_product = data;
        console.warn('my single Product', this.individual_product);
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }

  userAddress(user_id: any): void {
    this.customerService.userDetail(user_id).subscribe(
      (data) => {
        this.user_address = data.address;
        this.user_contact_no = data.mobNumber;
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }

  placeOrder(): void {
    this.order_dto = {
      userId: this.user_id,
      products: [this.individual_product], // Updated to include products array
      deliveryAddress: this.user_address,
      contact: this.user_contact_no,
      dateTime: new Date().toLocaleDateString(),
      totalAmount: this.individual_product.dp, // Assuming the total amount is the discounted price for a single product
    };

    console.log('Place Order DTL', this.order_dto);
    this.customerService.insertNewOrder(this.order_dto).subscribe(
      (data) => {
        alert('Your order was placed successfully!');
        this.router.navigateByUrl('/customer-dashboard');
      },
      (error) => {
        console.log('order error', error);
      }
    );
  }
}
