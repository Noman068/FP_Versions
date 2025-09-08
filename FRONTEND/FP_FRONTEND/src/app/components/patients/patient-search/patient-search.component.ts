import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { PatientService } from '../../../services/patient.service';
import { AppStore, PatientActions } from '../../../store/app.store';
import { SearchPatientRequest } from '../../../models/patient.models';

@Component({
  selector: 'app-patient-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-search.component.html',
  styleUrls: ['./patient-search.component.scss']
})
export class PatientSearchComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  searchForm: FormGroup;
  loading$ = this.appStore.patientLoading$;
  error$ = this.appStore.patientError$;
  searchResults$ = this.appStore.searchResults$;
  isSearching$ = this.appStore.isSearching$;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private appStore: AppStore
  ) {
    this.searchForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    // Setup debounced search
    this.searchForm.get('fullName')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        if (value && value.length >= 2) {
          this.performSearch(value);
        } else if (value === '') {
          this.clearSearch();
        }
      });

    this.appStore.dispatch(PatientActions.clearError());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(): void {
    if (this.searchForm.valid) {
      const fullName = this.searchForm.value.fullName;
      this.performSearch(fullName);
    }
  }

  private performSearch(fullName: string): void {
    const searchRequest: SearchPatientRequest = {
      fullName: fullName.trim()
    };

    this.patientService.searchPatient(searchRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  clearSearch(): void {
    this.searchForm.patchValue({ fullName: '' });
    this.patientService.clearSearchResults();
  }

  clearError(): void {
    this.appStore.dispatch(PatientActions.clearError());
  }

  getFieldError(): string {
    const field = this.searchForm.get('fullName');
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Search term is required';
      }
      if (field.errors['minlength']) {
        return 'Search term must be at least 2 characters';
      }
    }
    return '';
  }
}
