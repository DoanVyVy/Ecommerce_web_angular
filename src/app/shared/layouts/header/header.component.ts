import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CheckoutNumService } from '../../services/checkout-num.service';
import { CartService } from '../../../customer/services/cart-service.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  logged_in: boolean = false;
  user_role: string | null = null;
  checkoutNum: number = 0;

  constructor(
    private router: Router,
    private checkoutNumService: CheckoutNumService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.user_role = sessionStorage.getItem('role');
    const user_session_id = sessionStorage.getItem('user_session_id');
    if (user_session_id) {
      this.logged_in = true;
    }

    // Subscribe to checkoutNum$ to update checkoutNum
    this.checkoutNumService.checkoutNum$.subscribe((num) => {
      this.checkoutNum = num;
      sessionStorage.setItem('checkoutNum', num.toString()); // Store in session storage
    });

    // Initialize checkoutNum from session storage if available
    const savedCheckoutNum = sessionStorage.getItem('checkoutNum');
    if (savedCheckoutNum) {
      this.checkoutNum = parseInt(savedCheckoutNum, 10);
    }
  }

  ngDoCheck(): void {
    // Update user_role and logged_in status
    this.user_role = sessionStorage.getItem('role');
    const user_session_id = sessionStorage.getItem('user_session_id');
    if (user_session_id) {
      this.logged_in = true;
    } else {
      this.logged_in = false;
      this.checkoutNum = 0; // Reset checkoutNum when user logs out
      sessionStorage.removeItem('checkoutNum'); // Remove from session storage
    }
  }

  logout(): void {
    // Clear session storage and navigate to sign-in page
    sessionStorage.removeItem('user_session_id');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('checkoutNum');
    sessionStorage.removeItem('contact');
    sessionStorage.removeItem('ad1');
    sessionStorage.removeItem('ad2'); // Remove checkoutNum from session storage
    this.router.navigateByUrl('/sign-in');
  }
}
