import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Product, User, Order } from '../../core/model/object-model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private currentProductSubject = new BehaviorSubject<any>(null);
  currentProduct = this.currentProductSubject.asObservable();

  constructor(private http: HttpClient) {}

  allProduct(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products');
  }

  individualProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`/api/products/${id}`);
  }

  userDetail(id: number): Observable<User> {
    return this.http.get<User>(`/api/users/${id}`);
  }

  insertNewOrder(order: Order): Observable<any> {
    return this.http.post<any>('/api/orders', order);
  }

  quickBuyProduct(id: number): void {
    this.currentProductSubject.next(id);
  }

  orderDashboardData(): Observable<Order[]> {
    // Replace with actual API endpoint for fetching order dashboard data
    return this.http.get<Order[]>('/api/orders/dashboard');
  }

  productDashboardData(): Observable<Product[]> {
    // Replace with actual API endpoint for fetching product dashboard data
    return this.http.get<Product[]>('/api/products/dashboard');
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`/api/products/${id}`);
  }
}
