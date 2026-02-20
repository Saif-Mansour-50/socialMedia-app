import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/authorization/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);

  private readonly router = inject(Router);

  isLoading: boolean = false;

  erorrMsg: string = '';

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    ]),
  });

  signIn() {
    if (this.loginForm.valid) {
      this.isLoading = true;

      this.authService.signin(this.loginForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['/home']);
          this.isLoading = false;

          localStorage.setItem('token', res.data.token);
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
          this.erorrMsg = err.error.message;
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
