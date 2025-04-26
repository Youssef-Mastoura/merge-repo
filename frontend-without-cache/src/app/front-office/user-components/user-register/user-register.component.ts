import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class UserRegisterComponent {
  errorMessage: string = '';
  isLoading: boolean = false;


  registerForm!: FormGroup;

  SignUpOptions = [
    {
      image: 'assets/images/authentication/google.svg',
      name: 'Google'
    },
    {
      image: 'assets/images/authentication/twitter.svg',
      name: 'Twitter'
    },
    {
      image: 'assets/images/authentication/facebook.svg',
      name: 'Facebook'
    }
    
  ];
  


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      first_Name: ['', Validators.required],
      last_Name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: [''],
      phone_Number: ['', Validators.pattern('[0-9]{8}')],
      gender: ['', Validators.required],
      role: ['', Validators.required],
      date_Birthday: [''],
      photo: [null]
    });
  }


  onSubmit() {
    if (this.registerForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      const formData = new FormData();
      
      // Ajoutez tous les champs au FormData
      Object.keys(this.registerForm.value).forEach(key => {
        const value = this.registerForm.value[key];
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      // Conversion de la date si nécessaire
      if (this.registerForm.value.date_Birthday) {
        formData.append('date_Birthday', 
          new Date(this.registerForm.value.date_Birthday).toISOString());
      }

     // this.userService.register(formData).subscribe({
      //  next: (response) => {
        //  console.log('Registration successful:', response);
      //  //  this.router.navigate(['/login']); // Redirection après succès
        //},
       //// error: (err) => {
         // console.error('Registration error:', err);
        //  this.errorMessage = err.message || 'Registration failed. Please try again.';
         //// this.isLoading = false;
      ////  },
       // complete: () => {
          this.isLoading = false;
      //  }
     // });
    }
  }



  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.registerForm.patchValue({ photo: file });
      this.registerForm.get('photo')?.updateValueAndValidity();
    }
  }






















  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    console.error('Image non trouvée:', img.src);
    img.style.border = '2px solid red';
  }
  

}