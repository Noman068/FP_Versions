import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { PatientService } from '../../../services/patient.service';
import { AppStore, PatientActions } from '../../../store/app.store';
import { CreatePatientRequest, UpdatePatientRequest, PatientDto } from '../../../models/patient.models';
import { NameInputDirective } from '../../../directives/name-input.directive';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NameInputDirective],
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss']
})
export class PatientFormComponent implements OnInit {
  private destroy$ = new Subject<void>();
  
  patientForm: FormGroup;
  loading$ = this.appStore.patientLoading$;
  error$ = this.appStore.patientError$;
  selectedPatient$ = this.appStore.selectedPatient$;
  
  isEditMode = false;
  patientId: number | null = null;

  genders = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
  ];

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private appStore: AppStore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.patientForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      gender: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNo: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      emergencyPhone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      userAddress: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.patientId = +params['id'];
        this.loadPatientForEdit();
      }
    });

    this.appStore.dispatch(PatientActions.clearError());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPatientForEdit(): void {
    // In a real app, you'd load the patient by ID
    // For now, we'll get it from the store if available
    this.selectedPatient$.pipe(takeUntil(this.destroy$)).subscribe(patient => {
      if (patient && patient.patientId === this.patientId) {
        this.patientForm.patchValue({
          firstname: patient.firstname,
          lastname: patient.lastname,
          gender: patient.gender,
          email: patient.email,
          phoneNo: patient.phoneNo,
          emergencyPhone: patient.emergencyPhone,
          userAddress: patient.userAddress
        });
      }
    });
  }

  onSubmit(): void {
    if (this.patientForm.valid) {
      if (this.isEditMode && this.patientId) {
        this.updatePatient();
      } else {
        this.createPatient();
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createPatient(): void {
    const createRequest: CreatePatientRequest = {
      firstname: this.patientForm.value.firstname,
      lastname: this.patientForm.value.lastname,
      gender: this.patientForm.value.gender,
      email: this.patientForm.value.email,
      phoneNo: this.patientForm.value.phoneNo,
      emergencyPhone: this.patientForm.value.emergencyPhone,
      userAddress: this.patientForm.value.userAddress
    };

    this.patientService.createPatient(createRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/patients']);
          }
        },
        error: (error) => {
          console.error('Create patient error:', error);
        }
      });
  }

  private updatePatient(): void {
    const updateRequest: UpdatePatientRequest = {
      patientId: this.patientId!,
      firstname: this.patientForm.value.firstname,
      lastname: this.patientForm.value.lastname,
      gender: this.patientForm.value.gender,
      email: this.patientForm.value.email,
      phoneNo: this.patientForm.value.phoneNo,
      emergencyPhone: this.patientForm.value.emergencyPhone,
      userAddress: this.patientForm.value.userAddress
    };

    this.patientService.updatePatient(updateRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/patients']);
          }
        },
        error: (error) => {
          console.error('Update patient error:', error);
        }
      });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.patientForm.controls).forEach(key => {
      const control = this.patientForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.patientForm.get(fieldName);
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
    }
    return '';
  }

  onCancel(): void {
    this.router.navigate(['/patients']);
  }

  clearError(): void {
    this.appStore.dispatch(PatientActions.clearError());
  }
}
