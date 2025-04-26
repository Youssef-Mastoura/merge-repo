import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service'; 
import { UserService } from 'src/app/services/user.service'; 

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserLoginComponent implements OnInit{
  loginForm: FormGroup;
  errorMessage: String = '';

  showWelcomeMessage = false;
  showAdminError = false;
  showAuthError = false;
  welcomeEmail = '';
  isLoading=false;

  showResetPasswordModal = false;
  resetEmail = '';
  resetPasswordSuccess = false;
  resetPasswordError = '';


  showCodeVerificationModal = false;
showPasswordChangedModal = false;
verificationEmail = '';
verificationCode = '';
newPassword = '';
codeVerificationError = '';
socialUser!: SocialUser;
isLoggedin?: boolean;

  SignInOptions = [
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
    private authService:AuthService,
    private socialAuthService: SocialAuthService,

    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });


  }


  ngOnInit() {
   // localStorage.clear();
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.isLoggedin = user != null;
      if (this.isLoggedin) {
        this.handleSocialLogin(user);
      }
    });
  }
  private handleSocialLogin(user: SocialUser) {
    this.userService.registerWithGoogle(user).subscribe({
      next: (response: any) => {
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
          this.authService.setAuthToken(response.token);
          this.router.navigate(['user/home']);
        }
      },
      error: (err) => {
        console.error('Erreur lors de la connexion avec Google', err);
      }
    });
  }

  // Ajoutez cette méthode à votre classe existante


// Ajoutez cette méthode pour gérer le logout Google si nécessaire
signOut(): void {
  this.socialAuthService.signOut()
    .then(() => {
      console.log('Déconnexion Google réussie');
      this.authService.clearAuth();
    })
    .catch((err) => {
      console.error('Erreur lors de la déconnexion Google', err);
    });
}
 
  onSubmit() {
    this.errorMessage = '';
    this.showWelcomeMessage = false;
    this.showAdminError = false;
    this.showAuthError = false;
    
    if (this.loginForm.invalid) {
      return;
    }
  
    const { email, password } = this.loginForm.value;
    
    this.userService.login({ email, password }).subscribe({
      next: (response) => {
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
          this.authService.setAuthToken(response.token);

          const userInfo = this.authService.getUserInfoFromToken(response.token);
          console.log('Token reçu:', response.token); // ou response.access_token selon votre API

          this.welcomeEmail = userInfo?.email || '';
          this.showWelcomeMessage = true;

          // Retarder la redirection pour laisser voir le message
          setTimeout(() => {
            // Redirection ou autre action après connexion
          }, 2000); // 2 secondes de délai
        } else {
          this.showAuthError = true;
        }
      },
      error: () => {
        this.showAuthError = true;
      }
    });
}
  
  
  navigateToUser() {
    this.showWelcomeMessage = false; // Cache la modal
    this.router.navigate(['user/home']); // Redirection
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    console.error('Image non trouvée:', img.src);
    img.style.border = '2px solid red';
  }

  openResetPasswordModal(event: Event) {
    event.preventDefault();
    this.resetEmail = '';
    this.isLoading = true;

    this.resetPasswordSuccess = false;
    this.resetPasswordError = '';
    this.showResetPasswordModal = true;
  }

  onResetPassword() {
    if (!this.resetEmail) {
      this.resetPasswordError = 'Veuillez entrer une adresse email';
      return;
    }
  
    this.resetPasswordError = '';
    this.resetPasswordSuccess = false;
  
    this.userService.resetPassword(this.resetEmail).subscribe({
      next: (response) => {
        // Le serveur a répondu avec un statut 200
        this.resetPasswordSuccess = true;
        this.isLoading = false;

        this.resetPasswordError = '';
      },
      error: (err) => {
        // Il y a eu une erreur HTTP ou le serveur a renvoyé une erreur
        this.resetPasswordError = err.message || 'Une erreur est survenue';
        this.resetPasswordSuccess = false;
        this.isLoading = false;

        console.error('Erreur reset password:', err);
      }
    });
  }


  
  
  // Nouvelle méthode pour gérer la fermeture du premier modal
  closeResetPasswordModal() {
    this.showResetPasswordModal = false;
    if (this.resetPasswordSuccess) {
      this.showCodeVerificationModal = true;
    }
  }
  
  // Nouvelle méthode pour valider le code et changer le mot de passe
  onSubmitNewPassword() {
    if (!this.verificationCode || !this.newPassword) {
      this.codeVerificationError = 'Veuillez remplir tous les champs';
      return;
    }
  
    this.isLoading = true;
    this.codeVerificationError = '';
  
    this.userService.changePassword(this.verificationCode, this.newPassword).subscribe({
      next: () => {
        this.isLoading = false;
        this.showCodeVerificationModal = false;
        this.showPasswordChangedModal = true;
      },
      error: (err) => {
        this.codeVerificationError = err.message || 'Code invalide ou erreur lors du changement';
        this.isLoading = false;
      }
    });
  }
  
  // Méthode pour rediriger vers la page de login
  navigateToLogin() {
    this.showPasswordChangedModal = false;
    this.router.navigate(['user/home']); // Adaptez le chemin selon votre configuration
  }


  
  
  
}
