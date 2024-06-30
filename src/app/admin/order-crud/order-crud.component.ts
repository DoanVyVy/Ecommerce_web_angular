import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { SearchService } from '../../shared/services/search.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Subject } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-order-crud',
  imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: './order-crud.component.html',
  styleUrls: ['./order-crud.component.css'],
  standalone: true,
})
export class OrderCrudComponent implements OnInit {
  all_order_data: any;
  searchString: string = '';
  addEditOrderForm!: FormGroup;
  add_order: boolean = false;
  edit_order: boolean = false;
  popup_header!: string;

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.getAllOrders();
    this.addEditOrderForm = this.formBuilder.group({
      id: [''],
      userId: [''],
      dateTime: [''],
      totalAmount: [''],
      status: [''],
    });
  }

  getAllOrders() {
    this.adminService.allOrders().subscribe(
      (data) => {
        this.all_order_data = data;
      },
      (error) => {
        console.log('Error', error);
      }
    );
  }

  searchOrder() {
    if (this.searchString) {
      this.searchService
        .searchByName('orders', '?id', this.searchString)
        .subscribe(
          (data) => {
            this.all_order_data = data;
          },
          (error) => {
            console.log('Error', error);
          }
        );
    } else {
      this.getAllOrders();
    }
  }

  addOrderPopup() {
    this.edit_order = false;
    this.add_order = true;
    this.popup_header = 'Add New Order';
    this.addEditOrderForm.reset();
  }

  addOrder() {
    this.adminService.addOrder(this.addEditOrderForm.value).subscribe(
      (data) => {
        this.getAllOrders();
        $('#addEditOrderModal').modal('toggle');
      },
      (error) => {
        console.log('Error', error);
      }
    );
  }

  editOrderPopup(order_id: any) {
    this.adminService.getOrder(order_id).subscribe(
      (data) => {
        this.addEditOrderForm.patchValue(data);
        this.popup_header = 'Edit Order';
        this.edit_order = true;
        this.add_order = false;
        $('#addEditOrderModal').modal('toggle');
      },
      (error) => {
        console.log('Error', error);
      }
    );
  }

  updateOrder() {
    // Tạo một đối tượng mới chỉ chứa các trường cần thiết để cập nhật
    const updatedOrder = {
      id: this.addEditOrderForm.get('id')?.value,
      userId: this.addEditOrderForm.get('userId')?.value,
      dateTime: this.addEditOrderForm.get('dateTime')?.value,
      totalAmount: this.addEditOrderForm.get('totalAmount')?.value,
      status: this.addEditOrderForm.get('status')?.value,
    };
    // Gọi service để cập nhật đơn hàng với đối tượng mới này
    this.adminService.updateOrder(updatedOrder.id, updatedOrder).subscribe(
      (data) => {
        this.getAllOrders();
        $('#addEditOrderModal').modal('toggle');
      },
      (error) => {
        console.log('Error', error);
      }
    );
  }

  deleteOrder(order_id: any) {
    if (confirm('Are you sure you want to delete this order?')) {
      this.adminService.deleteOrder(order_id).subscribe(
        (data) => {
          this.getAllOrders();
        },
        (error) => {
          console.log('Error', error);
        }
      );
    }
  }
}
