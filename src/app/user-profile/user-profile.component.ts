import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../core/model/object-model';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  userProfileForm!: FormGroup;
  userProfile: boolean = false;
  user_id!: number;
  user_data: any;
  user_update_data: any;
  user_dto!: User;
  user_profile_pic: any;
  user_role: any;
  orders: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private user_Service: UserService
  ) {}

  ngOnInit(): void {
    this.user_id = Number(sessionStorage.getItem('user_session_id'));
    this.userProfileForm = this.formBuilder.group({
      name: ['', Validators.required],
      mobNumber: ['', Validators.required],
      age: ['', Validators.required],
      dob: ['', Validators.required],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      addLine1: ['', Validators.required],
      addLine2: [],
      gender: ['', Validators.required],
      aboutYou: ['', Validators.required],
      // uploadPhoto: ['', Validators.required],
    });
    this.editUserData(this.user_id);
    this.loadOrders();
  }

  get rf() {
    return this.userProfileForm.controls;
  }
  editUserData(user_id: any) {
    this.user_Service.getUserData(user_id).subscribe(
      (data) => {
        this.user_data = data;
        this.user_profile_pic = this.user_data.uploadPhoto;
        this.user_role = this.user_data.role;
        this.userProfileForm.setValue({
          name: this.user_data.name,
          mobNumber: this.user_data.mobNumber,
          age: this.user_data.age,
          dob: this.user_data.dob,
          email: this.user_data.email,
          password: this.user_data.password,
          gender: this.user_data.gender,
          addLine1: this.user_data.address.addLine1,
          addLine2: this.user_data.address.addLine2,
          aboutYou: this.user_data.aboutYou,
          uploadPhoto: '',
        });
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }
  updateProfile() {
    this.userProfile = true;
    if (this.userProfileForm.invalid) {
      return;
    }
    this.user_update_data = this.userProfileForm.value;
    this.user_dto = {
      aboutYou: this.user_update_data.aboutYou,
      age: this.user_update_data.age,
      agreetc: this.user_update_data.agreetc,
      dob: this.user_update_data.dob,
      email: this.user_update_data.email,
      gender: this.user_update_data.gender,
      address: {
        id: 0,
        addLine1: this.user_update_data.addLine1,
        addLine2: this.user_update_data.addLine2,
      },
      mobNumber: this.user_update_data.mobNumber,
      name: this.user_update_data.name,
      password: this.user_update_data.password,
      // uploadPhoto:
      //   this.user_update_data.uploadPhoto == ''
      //     ? this.user_profile_pic
      //     : this.user_update_data.uploadPhoto,
      role: this.user_update_data.role,
    };
    this.user_Service.updateUserData(this.user_id, this.user_dto).subscribe(
      (data) => {
        alert('Profile Update Successfull !');
        if (this.user_role == 'admin') {
          this.router.navigateByUrl('/admin-dashboard');
        } else if (this.user_role == 'customer') {
          this.router.navigateByUrl('/customer-dashboard');
        }
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }

  loadOrders() {
    this.user_Service.getUserOrders(this.user_id).subscribe(
      (data) => {
        this.orders = data; // Gán dữ liệu đơn hàng vào biến orders
      },
      (error) => {
        console.log('Error loading orders:', error);
      }
    );
  }
}
