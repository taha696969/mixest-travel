import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials = {
    username: '',
    password: ''
  };
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {
    // If already logged in, redirect to admin
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/admin']);
    }
  }

  onSubmit() {
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/admin']);
        }
      },
      error: (err) => {
        this.error = 'Identifiants invalides. Veuillez réessayer.';
        console.error(err);
      }
    });
  }
}
