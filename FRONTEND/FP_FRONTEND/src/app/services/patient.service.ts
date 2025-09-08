import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { 
  CreatePatientRequest, 
  CreatePatientResponse, 
  UpdatePatientRequest, 
  UpdatePatientResponse,
  DeletePatientRequest,
  DeletePatientResponse,
  SearchPatientRequest,
  PatientDto
} from '../models/patient.models';
import { AppStore, PatientActions } from '../store/app.store';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private readonly baseUrl = 'http://localhost:5268/api/patient';

  constructor(
    private http: HttpClient,
    private appStore: AppStore,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  createPatient(request: CreatePatientRequest): Observable<CreatePatientResponse> {
    this.appStore.dispatch(PatientActions.createStart());
    
    return this.http.post<CreatePatientResponse>(`${this.baseUrl}/create`, request, {
      headers: this.getHeaders()
    })
      .pipe(
        tap(response => {
          if (response.success) {
            // Note: In a real app, you'd get the created patient from the response
            // For now, we'll just dispatch success without adding to store
            this.appStore.dispatch(PatientActions.createSuccess(response as any));
          } else {
            this.appStore.dispatch(PatientActions.createFailure(response.message || 'Failed to create patient'));
          }
        }),
        catchError(error => {
          this.appStore.dispatch(PatientActions.createFailure(error.error?.message || 'Failed to create patient'));
          return throwError(() => error);
        })
      );
  }

  updatePatient(request: UpdatePatientRequest): Observable<UpdatePatientResponse> {
    this.appStore.dispatch(PatientActions.updateStart());
    
    return this.http.put<UpdatePatientResponse>(`${this.baseUrl}/update`, request, {
      headers: this.getHeaders()
    })
      .pipe(
        tap(response => {
          if (response.success) {
            // Note: In a real app, you'd get the updated patient from the response
            this.appStore.dispatch(PatientActions.updateSuccess(request as any));
          } else {
            this.appStore.dispatch(PatientActions.updateFailure(response.message || 'Failed to update patient'));
          }
        }),
        catchError(error => {
          this.appStore.dispatch(PatientActions.updateFailure(error.error?.message || 'Failed to update patient'));
          return throwError(() => error);
        })
      );
  }

  deletePatient(patientId: number): Observable<DeletePatientResponse> {
    this.appStore.dispatch(PatientActions.deleteStart());
    
    return this.http.delete<DeletePatientResponse>(`${this.baseUrl}/delete/${patientId}`, {
      headers: this.getHeaders()
    })
      .pipe(
        tap(response => {
          if (response.success) {
            this.appStore.dispatch(PatientActions.deleteSuccess(patientId));
          } else {
            this.appStore.dispatch(PatientActions.deleteFailure(response.message || 'Failed to delete patient'));
          }
        }),
        catchError(error => {
          this.appStore.dispatch(PatientActions.deleteFailure(error.error?.message || 'Failed to delete patient'));
          return throwError(() => error);
        })
      );
  }

  getAllPatients(): Observable<PatientDto[]> {
    this.appStore.dispatch(PatientActions.loadStart());
    
    return this.http.get<PatientDto[]>(`${this.baseUrl}/all`, {
      headers: this.getHeaders()
    })
      .pipe(
        tap(patients => {
          this.appStore.dispatch(PatientActions.loadSuccess(patients));
        }),
        catchError(error => {
          this.appStore.dispatch(PatientActions.loadFailure(error.error?.message || 'Failed to fetch patients'));
          return throwError(() => error);
        })
      );
  }

  searchPatient(request: SearchPatientRequest): Observable<PatientDto[]> {
    this.appStore.dispatch(PatientActions.searchStart());
    
    return this.http.post<PatientDto[]>(`${this.baseUrl}/search`, request, {
      headers: this.getHeaders()
    })
      .pipe(
        tap(patients => {
          this.appStore.dispatch(PatientActions.searchSuccess(patients));
        }),
        catchError(error => {
          this.appStore.dispatch(PatientActions.searchFailure(error.error?.message || 'Failed to search patients'));
          return throwError(() => error);
        })
      );
  }

  clearSearchResults(): void {
    this.appStore.dispatch(PatientActions.clearSearch());
  }

  setSelectedPatient(patient: PatientDto | null): void {
    this.appStore.dispatch(PatientActions.select(patient));
  }

  clearError(): void {
    this.appStore.dispatch(PatientActions.clearError());
  }
}
