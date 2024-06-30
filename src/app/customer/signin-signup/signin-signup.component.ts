import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../core/model/object-model';
import { LoginSignupService } from '../../shared/services/login-signup.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-signin-signup',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './signin-signup.component.html',
  styleUrl: './signin-signup.component.css',
})
export class SigninSignupComponent {
  regForm: boolean = false;
  signUpfrom!: FormGroup;
  signInfrom!: FormGroup;
  signUpsubmitted = false;
  href: string = '';
  user_data: any;
  user_dto!: User;
  user_reg_data: any;
  signInFormValue: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginSignupService,
  ) {}
  ngOnInit(): void {
    this.href = this.router.url;
    this.regForm = this.href === '/sign-up';

    this.signUpfrom = this.formBuilder.group({
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
      agreetc: ['', Validators.required],
      uploadPhoto: [''],
      role: '',
    });
  }

  get rf() {
    return this.signUpfrom.controls;
  }

  onSubmitSignUp() {
    this.signUpsubmitted = true;
    if (this.signUpfrom.invalid) {
      return;
    }
    const formData = this.signUpfrom.value;
    // Sau khi upload thành công, gán storageKey vào user_dto
    this.user_dto = {
      aboutYou: formData.aboutYou,
      age: formData.age,
      agreetc: formData.agreetc,
      dob: formData.dob,
      email: formData.email,
      gender: formData.gender,
      address: {
        id: 0,
        addLine1: formData.addLine1,
        addLine2: formData.addLine2,
      },
      mobNumber: formData.mobNumber,
      name: formData.name,
      password: formData.password,
      // uploadPhoto: storageKey, // Lưu storage key vào user_dto
      role: 'customer',
    };

    // Gọi service đăng ký user
    this.loginService.userRegister(this.user_dto).subscribe(
      (data) => {
        alert('User Register Successful ☺');
        this.router.navigateByUrl('/sign-in');
      },
      (error) => {
        console.error('User Register Error:', error);
      }
    );
  }

  onSubmitSignIn() {
    this.loginService
      .authLogin(
        this.signInFormValue.userEmail,
        this.signInFormValue.userPassword
      )
      .subscribe(
        (data) => {
          this.user_data = data;
          if (this.user_data.length == 1) {
            if (this.user_data[0].role == 'customer') {
              sessionStorage.setItem('user_session_id', this.user_data[0].id);
              sessionStorage.setItem('role', this.user_data[0].role);
              sessionStorage.setItem('contact', this.user_data[0].mobNumber);
              sessionStorage.setItem('ad1', this.user_data[0].addLine1);
              sessionStorage.setItem('ad2', this.user_data[0].addLine2);
              this.router.navigateByUrl('/customer-dashboard');
            } else {
              alert('Invalid login details');
            }
          } else {
            alert('Invalid');
          }
          console.log(this.user_data);
        },
        (error) => {
          console.log('My error', error);
        }
      );
  }
}
