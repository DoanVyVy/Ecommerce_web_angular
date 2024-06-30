import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckoutNumService {
  private checkoutNumSubject: BehaviorSubject<number>;
  checkoutNum$: Observable<number>;

  constructor() {
    // Kiểm tra xem có dữ liệu checkoutNum trong sessionStorage không
    const savedCheckoutNum = sessionStorage.getItem('checkoutNum');
    this.checkoutNumSubject = new BehaviorSubject<number>(
      savedCheckoutNum ? +savedCheckoutNum : 0
    );
    this.checkoutNum$ = this.checkoutNumSubject.asObservable();
  }

  getCheckoutNum(): number {
    return this.checkoutNumSubject.value;
  }

  updateCheckoutNum(num: number): void {
    this.checkoutNumSubject.next(num);
    // Lưu checkoutNum vào sessionStorage
    sessionStorage.setItem('checkoutNum', num.toString());
  }
}
