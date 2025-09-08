import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AppStore } from '../../store/app.store';
import { PatientService } from '../../services/patient.service';
import { User } from '../../models/auth.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  user$ = this.appStore.user$;
  patients$ = this.appStore.patients$;
  loading$ = this.appStore.patientLoading$;

  stats = {
    totalPatients: 0,
    recentPatients: 0
  };

  constructor(
    private authService: AuthService,
    private appStore: AppStore,
    private patientService: PatientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPatients();
    
    
    this.patients$.pipe(takeUntil(this.destroy$)).subscribe(patients => {
      this.stats.totalPatients = patients.length;
      this.stats.recentPatients = patients.length; 
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPatients(): void {
    this.patientService.getAllPatients()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getUserRole(user: User | null): string {
    return user?.roleName || 'Unknown';
  }

  canManagePatients(user: User | null): boolean {
    const role = this.getUserRole(user);
    return role === 'admin' || role === 'staff';
  }
}
