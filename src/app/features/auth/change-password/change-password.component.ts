import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/authorization/auth.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  private readonly authService = inject(AuthService);

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
        },
        error: (err) => {
          console.log('erorrrrPasss', err);
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
