import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { CheckoutNumService } from '../../shared/services/checkout-num.service';
import { CartService } from '../services/cart-service.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../core/model/object-model';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { SearchService } from '../../shared/services/search.service';

@Component({
  selector: 'app-buyer-dashboad',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule], // Include FormsModule
  templateUrl: './customer-dashboad.component.html',
  styleUrls: ['./customer-dashboad.component.css'],
})
export class CustomerDashboardComponent implements OnInit {
  all_products: Product[] = [];
  show_Checkout: boolean = false;
  searchString: string = '';

  constructor(
    private router: Router,
    private customerService: CustomerService,
    private cartService: CartService,
    private checkoutNumService: CheckoutNumService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.getAllProduct();
  }

  getAllProduct(): void {
    this.customerService.allProduct().subscribe(
      (data: Product[]) => {
        this.all_products = data;
      },
      (error) => {
        console.log('Error fetching products', error);
      }
    );
  }

  search(): void {
    if (!this.searchString.trim()) {
      this.getAllProduct();
      return;
    }
    this.searchService
      .searchByName('products', '?q',this.searchString.trim())
      .subscribe(
        (data: Product[]) => {
          console.log(data);
          if (data === null) {
            this.all_products = [];
          } else {
            this.all_products = data;
          }
        },
        (error) => {
          console.log('Error searching products', error);
          // Optionally handle errors here, e.g., display an error message to the user
        }
      );
  }

  buyProduct(id: number): void {
    this.show_Checkout = true;
    this.customerService.quickBuyProduct(id);
    this.router.navigateByUrl('/checkout');
  }

  addToCart(id: number): void {
    this.customerService.getProductById(id).subscribe((product: Product) => {
      const quantity = 1; // Default quantity

      this.cartService.addToCart(product, quantity);

      const currentCheckoutNum = this.checkoutNumService.getCheckoutNum();
      const updatedCheckoutNum = currentCheckoutNum + quantity;
      this.checkoutNumService.updateCheckoutNum(updatedCheckoutNum);

      alert(`Added ${quantity} ${product.name}(s) to your cart.`);
    });
  }
}
