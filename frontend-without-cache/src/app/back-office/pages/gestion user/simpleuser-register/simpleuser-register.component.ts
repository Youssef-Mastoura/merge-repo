import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-simpleuser-register',
  templateUrl: './simpleuser-register.component.html',
  styleUrls: ['./simpleuser-register.component.css']
})
export class SimpleuserRegisterComponent implements OnInit {
  signupForm!: FormGroup;
  signupError: string = '';
  showSignupSuccess: boolean = false;
  maxBirthDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    // Set max birth date to today
    this.maxBirthDate = new Date();
  }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      first_Name: ['', Validators.required],
      last_Name: ['', Validators.required],
      address: [''],
      phone_Number: [''],
      gender: [''],
      role: ['', Validators.required],
      date_Birthday: [''],
      is_Activated: [true]
    });
  }

  onSignupSubmit() {
    if (this.signupForm.invalid) {
      return;
    }

    const userData = this.signupForm.value;
    
    // Format date if provided
    if (userData.date_Birthday) {
      userData.date_Birthday = new Date(userData.date_Birthday).toISOString();
    }

    this.userService.addUser(userData).subscribe({
      next: (response) => {
        this.showSignupSuccess = true;
        this.signupError = '';
      },
      error: (error) => {
        this.signupError = error.message || 'An error occurred during registration';
        console.error('Signup error:', error);
      }
    });
  }

  navigateToLogin() {
    this.showSignupSuccess = false;
    this.router.navigate(['/admin/login-admin']);
  }
}