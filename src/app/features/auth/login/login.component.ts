import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Component, inject } from '@angular/core';

import { AuthService } from '../../../core/services/authorization/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isLoading = false;
  flag = true;
  erorrMsg = '';

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    ]),
  });

  signIn() {
    if (this.loginForm.valid) {
      this.isLoading = true;

      this.authService.signin(this.loginForm.value).subscribe({
        next: (res) => {
          this.router.navigate(['/home']);
          this.isLoading = false;

          localStorage.setItem('token', res.data.token);
          localStorage.setItem('userData', JSON.stringify(res.data.user));
        },
        error: (err) => {
          this.isLoading = false;
          this.erorrMsg = err.error.message;
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  showPassword(): void {
    this.flag = !this.flag;
  }
}
