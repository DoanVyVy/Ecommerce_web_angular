import { Injectable } from '@angular/core';
import { ApiService } from '../../core/service/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  public user_url = 'http://localhost:3000/user/';
  public product_url = 'http://localhost:3000/products/';
  public all_user = 'http://localhost:3000/user/';
  public all_order = 'http://localhost:3000/orders/';

  constructor(private apiService: ApiService) {}

  userDashboardData() {
    return this.apiService.get(this.user_url);
  }

  productDashboardData() {
    return this.apiService.get(this.product_url);
  }

  allUser(): Observable<any> {
    return this.apiService.get(this.all_user);
  }

  addUser(user_dto: any) {
    return this.apiService.post(this.user_url, user_dto);
  }

  singleuUser(user_id: any) {
    return this.apiService.get(this.user_url + user_id);
  }

  editUser(user_id: any, user_dto: any): Observable<any> {
    return this.apiService.patch(this.user_url + user_id, user_dto);
  }

  deleteUser(user_id: any) {
    return this.apiService.delete(this.user_url + user_id);
  }

  // Order methods
  allOrders(): Observable<any> {
    return this.apiService.get(this.all_order);
  }

  getOrder(order_id: string): Observable<any> {
    return this.apiService.get(this.all_order + order_id);
  }

  addOrder(orderData: any): Observable<any> {
    return this.apiService.post(this.all_order, orderData);
  }

  updateOrder(order_id: any, orderData: any): Observable<any> {
    return this.apiService.patch(this.all_order + order_id, orderData);
  }

  deleteOrder(order_id: string): Observable<any> {
    return this.apiService.delete(this.all_order + order_id);
  }
}
