import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { log } from 'console';
import { AuthService } from '../../services/authorization/auth.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);

  private readonly router = inject(Router);

  isLoading: boolean = false;

  registerForm: FormGroup = new FormGroup(
    {
      name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      username: new FormControl(),
      email: new FormControl(null, [Validators.required, Validators.email]),
      dateOfBirth: new FormControl(null, [
        Validators.required,
        (control) => {
          if (!control.value) return null;

          const selectedDate = new Date(control.value);
          const today = new Date();

          return selectedDate > today ? { futureDate: true } : null;
        },
      ]),
      gender: new FormControl('', [Validators.required]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
      ]),
      rePassword: new FormControl(null, [Validators.required]),
    },
    { validators: this.confirmPassword },
  );

  signup() {
    if (this.registerForm.valid) {
      this.isLoading = true;

      this.authService.signup(this.registerForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['/login']);
          this.isLoading = false;
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  confirmPassword(group: any) {
    let passwordValue = group.get('password').value;
    let rePasswordValue = group.get('rePassword').value;

    if (passwordValue === rePasswordValue) {
      return null;
    } else {
      return { mismatch: true };
    }
  }
}
