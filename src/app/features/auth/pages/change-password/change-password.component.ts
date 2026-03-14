import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { AuthService } from '../../models/auth.service';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  private readonly authService = inject(AuthService);

  message = signal<string | null>(null);

  changePasswordForm = new FormGroup(
    {
      password: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordMatchValidator },
  );

  changePassword() {
    if (this.changePasswordForm.valid) {
      const { confirmPassword, ...passwordData } = this.changePasswordForm.value;

      this.authService.changePassword(passwordData).subscribe({
        next: (res) => {
          console.log('changePass', res);

          this.message.set(res.message);

          setTimeout(() => {
            this.message.set(null);
          }, 5000);
        },
        error: (err) => {
          console.log('erorrrrPasss', err);
          this.message.set(err.error?.message || err.message || 'An error occurred');
        },
      });
    }
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const newPassword = control.get('newPassword');
      const confirmPassword = control.get('confirmPassword');

      if (!newPassword || !confirmPassword) {
        return null;
      }

      return newPassword.value === confirmPassword.value ? null : { passwordMismatch: true };
    };
  }
}
