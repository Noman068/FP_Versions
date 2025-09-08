import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { AppStore, AuthActions } from '../../../store/app.store';
import { SignupRequest } from '../../../models/auth.models';
import { NameInputDirective } from '../../../directives/name-input.directive';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NameInputDirective],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  loading$ = this.appStore.authLoading$;
  error$ = this.appStore.authError$;

  roles = [
    { id: 1, name: 'admin' },
    { id: 2, name: 'staff' },
    { id: 3, name: 'doctor' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private appStore: AppStore,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      role: ['', [Validators.required]],
      roleId: [0, [Validators.required, Validators.min(1)]],
      passwordHash: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Clear any previous errors
    this.appStore.dispatch(AuthActions.clearError());
    
    // Redirect if already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }

    // Watch role changes to update roleId
    this.signupForm.get('role')?.valueChanges.subscribe(roleName => {
      const role = this.roles.find(r => r.name === roleName);
      this.signupForm.patchValue({ roleId: role?.id || 0 });
    });
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: any } | null {
    const password = control.get('passwordHash');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const signupRequest: SignupRequest = {
        firstname: this.signupForm.value.firstname,
        lastname: this.signupForm.value.lastname,
        email: this.signupForm.value.email,
        phone: this.signupForm.value.phone,
        address: this.signupForm.value.address,
        role: this.signupForm.value.role,
        roleId: this.signupForm.value.roleId,
        passwordHash: this.signupForm.value.passwordHash,
        confirmPassword: this.signupForm.value.confirmPassword
      };

      this.authService.signup(signupRequest).subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/login']);
          }
        },
        error: (error) => {
          console.error('Signup error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.signupForm.controls).forEach(key => {
      const control = this.signupForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.signupForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} cannot exceed ${field.errors['maxlength'].requiredLength} characters`;
      }
      if (field.errors['pattern']) {
        return 'Please enter a valid phone number';
      }
      if (field.errors['min']) {
        return 'Please select a valid role';
      }
    }
    return '';
  }

  getFormError(): string {
    if (this.signupForm.errors && this.signupForm.touched) {
      if (this.signupForm.errors['passwordMismatch']) {
        return 'Passwords do not match';
      }
    }
    return '';
  }
}
