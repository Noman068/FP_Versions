import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AppStore } from './store/app.store';
import { map } from 'rxjs/operators';

// Guards
const authGuard = () => {
  const appStore = inject(AppStore);
  return appStore.isAuthenticated$;
};

const guestGuard = () => {
  const appStore = inject(AppStore);
  return appStore.isAuthenticated$.pipe(
    map(isAuth => !isAuth)
  );
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'signup',
    loadComponent: () => import('./components/auth/signup/signup.component').then(m => m.SignupComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'patients',
    loadComponent: () => import('./components/patients/patient-management/patient-management.component').then(m => m.PatientManagementComponent),
    canActivate: [authGuard]
  },
  {
    path: 'patients/create',
    loadComponent: () => import('./components/patients/patient-form/patient-form.component').then(m => m.PatientFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'patients/edit/:id',
    loadComponent: () => import('./components/patients/patient-form/patient-form.component').then(m => m.PatientFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'patients/search',
    loadComponent: () => import('./components/patients/patient-search/patient-search.component').then(m => m.PatientSearchComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];