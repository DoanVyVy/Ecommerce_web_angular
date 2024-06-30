import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { User } from '../../core/model/object-model';
import { HttpClientModule } from '@angular/common/http';
import { SearchService } from '../../shared/services/search.service';
declare var $: any;
@Component({
  selector: 'app-user-crud',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-crud.component.html',
  styleUrl: './user-crud.component.css',
})
export class UserCrudComponent implements OnInit {
  all_user_data: any;
  single_user_data: any;
  addEditUserForm!: FormGroup;
  user_dto!: User;
  user_reg_data: any;
  edit_user_id: any;
  upload_file_name!: string;
  addEditUser: boolean = false; // For Form validation
  add_user: boolean = false;
  edit_user: boolean = false;
  popup_header!: string;
  signInFormValue: any = {};
  searchString: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private adminService: AdminService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.getAllUser();
    this.addEditUserForm = this.formBuilder.group({
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
      uploadPhoto: [''],
      agreetc: ['', Validators.required],
      role: ['', Validators.required],
    });
  }
  getAllUser() {
    this.adminService.allUser().subscribe(
      (data) => {
        this.all_user_data = data;
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }
  get rf() {
    return this.addEditUserForm.controls;
  }

  addUserPopup() {
    this.edit_user = false;
    this.add_user = true;
    this.popup_header = 'Add New User';
    this.addEditUserForm.reset();
  }

  addUser() {
    this.addEditUser = true;
    if (this.addEditUserForm.invalid) {
      alert('Error!! :-)\n\n' + JSON.stringify(this.addEditUserForm.value));
      return;
    }
    this.user_reg_data = this.addEditUserForm.value;
    this.user_dto = {
      aboutYou: this.user_reg_data.aboutYou,
      age: this.user_reg_data.age,
      agreetc: this.user_reg_data.agreetc,
      dob: this.user_reg_data.dob,
      email: this.user_reg_data.email,
      gender: this.user_reg_data.gender,
      address: {
        id: 0,
        addLine1: this.user_reg_data.addLine1,
        addLine2: this.user_reg_data.addLine2,
      },
      mobNumber: this.user_reg_data.mobNumber,
      name: this.user_reg_data.name,
      password: this.user_reg_data.password,
      // uploadPhoto: this.user_reg_data.uploadPhoto,
      role: this.user_reg_data.role,
    };
    this.adminService.addUser(this.user_dto).subscribe(
      (data) => {
        this.addEditUserForm.reset();
        this.getAllUser();
        $('#addEditUserModal').modal('toggle');
      },
      (error) => {
        console.log('my wrong ', error);
      }
    );
  }
  editUserPopup(user_id: any) {
    this.edit_user_id = user_id;
    this.edit_user = true;
    this.add_user = false;
    this.popup_header = 'Edit User';
    this.adminService.singleuUser(user_id).subscribe(
      (data) => {
        this.single_user_data = data;
        this.upload_file_name = this.single_user_data.uploadPhoto;
        this.addEditUserForm.setValue({
          name: this.single_user_data.name,
          mobNumber: this.single_user_data.mobNumber,
          age: this.single_user_data.age,
          dob: this.single_user_data.dob,
          email: this.single_user_data.email,
          password: this.single_user_data.password,
          gender: this.single_user_data.gender,
          addLine1: this.single_user_data.address.addLine1,
          addLine2: this.single_user_data.address.addLine2,
          aboutYou: this.single_user_data.aboutYou,
          uploadPhoto: '',
          agreetc: this.single_user_data.agreetc,
          role: this.single_user_data.role,
        });
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }
  updateUser() {
    if (this.addEditUserForm.invalid) {
      alert('Error!! :-)\n\n' + JSON.stringify(this.addEditUserForm.value));
      return;
    }
    this.user_reg_data = this.addEditUserForm.value;
    this.user_dto = {
      aboutYou: this.user_reg_data.aboutYou,
      age: this.user_reg_data.age,
      agreetc: this.user_reg_data.agreetc,
      dob: this.user_reg_data.dob,
      email: this.user_reg_data.email,
      gender: this.user_reg_data.gender,
      address: {
        id: 0,
        addLine1: this.user_reg_data.addLine1,
        addLine2: this.user_reg_data.addLine2,
      },
      mobNumber: this.user_reg_data.mobNumber,
      name: this.user_reg_data.name,
      password: this.user_reg_data.password,
      // uploadPhoto:
      //   this.user_reg_data.uploadPhoto == ''
      //     ? this.upload_file_name
      //     : this.user_reg_data.uploadPhoto,
      role: this.user_reg_data.role,
    };
    this.adminService.editUser(this.edit_user_id, this.user_dto).subscribe(
      (data) => {
        this.addEditUserForm.reset();
        this.getAllUser();
        $('#addEditUserModal').modal('toggle');
      },
      (error) => {
        console.log('my wrong ', error);
      }
    );
  }
  deleteUser(user_id: any) {
    const confirmed = confirm('Are you sure you want to delete this user?');
    if (confirmed) {
      this.adminService.deleteUser(user_id).subscribe(
        (data) => {
          this.getAllUser();
        },
        (error) => {
          console.log('My error', error);
        }
      );
    } else {
      console.log('User deletion cancelled');
    }
  }

  searchUsers(): void {
    if (!this.searchString.trim()) {
      this.getAllUser();
      return;
    }

    this.searchService.searchByName('user','?q',this.searchString.trim()).subscribe(
      (data: any) => {
        this.all_user_data = data;
      },
      (error) => {
        console.log('Error searching users', error);
      }
    );
  }
}
