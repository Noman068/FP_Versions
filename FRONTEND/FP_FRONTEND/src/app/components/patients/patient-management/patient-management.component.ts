import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PatientService } from '../../../services/patient.service';
import { AppStore, PatientActions } from '../../../store/app.store';
import { PatientDto } from '../../../models/patient.models';
import { PatientSearchComponent } from '../patient-search/patient-search.component';

@Component({
  selector: 'app-patient-management',
  standalone: true,
  imports: [CommonModule, RouterModule, PatientSearchComponent],
  templateUrl: './patient-management.component.html',
  styleUrls: ['./patient-management.component.scss']
})
export class PatientManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  patients$ = this.appStore.patients$;
  loading$ = this.appStore.patientLoading$;
  error$ = this.appStore.patientError$;
  searchResults$ = this.appStore.searchResults$;
  isSearching$ = this.appStore.isSearching$;

  constructor(
    private patientService: PatientService,
    private appStore: AppStore
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPatients(): void {
    this.patientService.getAllPatients()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  deletePatient(patientId: number): void {
    if (confirm('Are you sure you want to delete this patient?')) {
      this.patientService.deletePatient(patientId)
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    }
  }

  clearError(): void {
    this.appStore.dispatch(PatientActions.clearError());
  }

  getGenderIcon(gender: string): string {
    switch (gender.toLowerCase()) {
      case 'male':
        return '👨';
      case 'female':
        return '👩';
      default:
        return '👤';
    }
  }

  getGenderClass(gender: string): string {
    switch (gender.toLowerCase()) {
      case 'male':
        return 'gender-male';
      case 'female':
        return 'gender-female';
      default:
        return 'gender-other';
    }
  }
}
