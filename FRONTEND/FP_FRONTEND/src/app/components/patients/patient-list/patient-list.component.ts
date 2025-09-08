import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PatientService } from '../../../services/patient.service';
import { PatientStore } from '../../../store/patient.store';
import { PatientDto } from '../../../models/patient.models';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  patients$ = this.patientStore.patients$;
  loading$ = this.patientStore.loading$;
  error$ = this.patientStore.error$;
  searchResults$ = this.patientStore.searchResults$;
  isSearching$ = this.patientStore.isSearching$;

  constructor(
    private patientService: PatientService,
    private patientStore: PatientStore
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
    this.patientStore.clearError();
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
