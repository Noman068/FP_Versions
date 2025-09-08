import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthResponse, User } from '../models/auth.models';
import { PatientDto } from '../models/patient.models';

export interface AppState {
  // Auth State
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  authLoading: boolean;
  authError: string | null;

  // Patient State
  patients: PatientDto[];
  selectedPatient: PatientDto | null;
  patientLoading: boolean;
  patientError: string | null;
  searchResults: PatientDto[];
  isSearching: boolean;
}

const initialState: AppState = {
  // Auth State
  isAuthenticated: false,
  user: null,
  token: null,
  authLoading: false,
  authError: null,

  // Patient State
  patients: [],
  selectedPatient: null,
  patientLoading: false,
  patientError: null,
  searchResults: [],
  isSearching: false
};

// Action Types
export enum ActionType {
  // Auth Actions
  AUTH_LOGIN_START = '[Auth] Login Start',
  AUTH_LOGIN_SUCCESS = '[Auth] Login Success',
  AUTH_LOGIN_FAILURE = '[Auth] Login Failure',
  AUTH_SIGNUP_START = '[Auth] Signup Start',
  AUTH_SIGNUP_SUCCESS = '[Auth] Signup Success',
  AUTH_SIGNUP_FAILURE = '[Auth] Signup Failure',
  AUTH_LOGOUT = '[Auth] Logout',
  AUTH_CLEAR_ERROR = '[Auth] Clear Error',
  AUTH_INITIALIZE = '[Auth] Initialize',

  // Patient Actions
  PATIENT_LOAD_START = '[Patient] Load Start',
  PATIENT_LOAD_SUCCESS = '[Patient] Load Success',
  PATIENT_LOAD_FAILURE = '[Patient] Load Failure',
  PATIENT_CREATE_START = '[Patient] Create Start',
  PATIENT_CREATE_SUCCESS = '[Patient] Create Success',
  PATIENT_CREATE_FAILURE = '[Patient] Create Failure',
  PATIENT_UPDATE_START = '[Patient] Update Start',
  PATIENT_UPDATE_SUCCESS = '[Patient] Update Success',
  PATIENT_UPDATE_FAILURE = '[Patient] Update Failure',
  PATIENT_DELETE_START = '[Patient] Delete Start',
  PATIENT_DELETE_SUCCESS = '[Patient] Delete Success',
  PATIENT_DELETE_FAILURE = '[Patient] Delete Failure',
  PATIENT_SEARCH_START = '[Patient] Search Start',
  PATIENT_SEARCH_SUCCESS = '[Patient] Search Success',
  PATIENT_SEARCH_FAILURE = '[Patient] Search Failure',
  PATIENT_CLEAR_SEARCH = '[Patient] Clear Search',
  PATIENT_SELECT = '[Patient] Select',
  PATIENT_CLEAR_ERROR = '[Patient] Clear Error',
  PATIENT_RESET = '[Patient] Reset'
}

// Action Interfaces
export interface Action {
  type: ActionType;
  payload?: any;
}

// Action Creators
export class AuthActions {
  static loginStart(): Action {
    return { type: ActionType.AUTH_LOGIN_START };
  }

  static loginSuccess(payload: AuthResponse): Action {
    return { type: ActionType.AUTH_LOGIN_SUCCESS, payload };
  }

  static loginFailure(payload: string): Action {
    return { type: ActionType.AUTH_LOGIN_FAILURE, payload };
  }

  static signupStart(): Action {
    return { type: ActionType.AUTH_SIGNUP_START };
  }

  static signupSuccess(payload: any): Action {
    return { type: ActionType.AUTH_SIGNUP_SUCCESS, payload };
  }

  static signupFailure(payload: string): Action {
    return { type: ActionType.AUTH_SIGNUP_FAILURE, payload };
  }

  static logout(): Action {
    return { type: ActionType.AUTH_LOGOUT };
  }

  static clearError(): Action {
    return { type: ActionType.AUTH_CLEAR_ERROR };
  }

  static initialize(payload: { user: User; token: string }): Action {
    return { type: ActionType.AUTH_INITIALIZE, payload };
  }
}

export class PatientActions {
  static loadStart(): Action {
    return { type: ActionType.PATIENT_LOAD_START };
  }

  static loadSuccess(payload: PatientDto[]): Action {
    return { type: ActionType.PATIENT_LOAD_SUCCESS, payload };
  }

  static loadFailure(payload: string): Action {
    return { type: ActionType.PATIENT_LOAD_FAILURE, payload };
  }

  static createStart(): Action {
    return { type: ActionType.PATIENT_CREATE_START };
  }

  static createSuccess(payload: PatientDto): Action {
    return { type: ActionType.PATIENT_CREATE_SUCCESS, payload };
  }

  static createFailure(payload: string): Action {
    return { type: ActionType.PATIENT_CREATE_FAILURE, payload };
  }

  static updateStart(): Action {
    return { type: ActionType.PATIENT_UPDATE_START };
  }

  static updateSuccess(payload: PatientDto): Action {
    return { type: ActionType.PATIENT_UPDATE_SUCCESS, payload };
  }

  static updateFailure(payload: string): Action {
    return { type: ActionType.PATIENT_UPDATE_FAILURE, payload };
  }

  static deleteStart(): Action {
    return { type: ActionType.PATIENT_DELETE_START };
  }

  static deleteSuccess(payload: number): Action {
    return { type: ActionType.PATIENT_DELETE_SUCCESS, payload };
  }

  static deleteFailure(payload: string): Action {
    return { type: ActionType.PATIENT_DELETE_FAILURE, payload };
  }

  static searchStart(): Action {
    return { type: ActionType.PATIENT_SEARCH_START };
  }

  static searchSuccess(payload: PatientDto[]): Action {
    return { type: ActionType.PATIENT_SEARCH_SUCCESS, payload };
  }

  static searchFailure(payload: string): Action {
    return { type: ActionType.PATIENT_SEARCH_FAILURE, payload };
  }

  static clearSearch(): Action {
    return { type: ActionType.PATIENT_CLEAR_SEARCH };
  }

  static select(payload: PatientDto | null): Action {
    return { type: ActionType.PATIENT_SELECT, payload };
  }

  static clearError(): Action {
    return { type: ActionType.PATIENT_CLEAR_ERROR };
  }

  static reset(): Action {
    return { type: ActionType.PATIENT_RESET };
  }
}

// Reducer Function
function appReducer(state: AppState = initialState, action: Action): AppState {
  switch (action.type) {
    // Auth Reducers
    case ActionType.AUTH_LOGIN_START:
    case ActionType.AUTH_SIGNUP_START:
      return {
        ...state,
        authLoading: true,
        authError: null
      };

    case ActionType.AUTH_LOGIN_SUCCESS:
      const authResponse = action.payload as AuthResponse;
      const user: User = {
        userId: 0,
        firstname: authResponse.firstname,
        lastname: authResponse.lastname,
        passwordHash: '',
        address: '',
        email: '',
        phone: '',
        roleId: 0,
        roleName: authResponse.role
      };
      return {
        ...state,
        isAuthenticated: true,
        user,
        token: authResponse.token,
        authLoading: false,
        authError: null
      };

    case ActionType.AUTH_SIGNUP_SUCCESS:
      return {
        ...state,
        authLoading: false,
        authError: null
      };

    case ActionType.AUTH_LOGIN_FAILURE:
    case ActionType.AUTH_SIGNUP_FAILURE:
      return {
        ...state,
        authLoading: false,
        authError: action.payload
      };

    case ActionType.AUTH_LOGOUT:
      return {
        ...initialState,
        patients: [],
        searchResults: [],
        selectedPatient: null
      };

    case ActionType.AUTH_CLEAR_ERROR:
      return {
        ...state,
        authError: null
      };

    case ActionType.AUTH_INITIALIZE:
      const { user: initUser, token } = action.payload;
      return {
        ...state,
        isAuthenticated: true,
        user: initUser,
        token,
        authLoading: false,
        authError: null
      };

    // Patient Reducers
    case ActionType.PATIENT_LOAD_START:
    case ActionType.PATIENT_CREATE_START:
    case ActionType.PATIENT_UPDATE_START:
    case ActionType.PATIENT_DELETE_START:
    case ActionType.PATIENT_SEARCH_START:
      return {
        ...state,
        patientLoading: true,
        patientError: null
      };

    case ActionType.PATIENT_LOAD_SUCCESS:
      return {
        ...state,
        patients: action.payload,
        patientLoading: false,
        patientError: null
      };

    case ActionType.PATIENT_CREATE_SUCCESS:
      return {
        ...state,
        patients: [...state.patients, action.payload],
        patientLoading: false,
        patientError: null
      };

    case ActionType.PATIENT_UPDATE_SUCCESS:
      const updatedPatient = action.payload as PatientDto;
      return {
        ...state,
        patients: state.patients.map(patient =>
          patient.patientId === updatedPatient.patientId ? updatedPatient : patient
        ),
        selectedPatient: state.selectedPatient?.patientId === updatedPatient.patientId
          ? updatedPatient
          : state.selectedPatient,
        patientLoading: false,
        patientError: null
      };

    case ActionType.PATIENT_DELETE_SUCCESS:
      const patientId = action.payload as number;
      return {
        ...state,
        patients: state.patients.filter(patient => patient.patientId !== patientId),
        selectedPatient: state.selectedPatient?.patientId === patientId
          ? null
          : state.selectedPatient,
        patientLoading: false,
        patientError: null
      };

    case ActionType.PATIENT_SEARCH_SUCCESS:
      return {
        ...state,
        searchResults: action.payload,
        isSearching: true,
        patientLoading: false,
        patientError: null
      };

    case ActionType.PATIENT_CLEAR_SEARCH:
      return {
        ...state,
        searchResults: [],
        isSearching: false
      };

    case ActionType.PATIENT_SELECT:
      return {
        ...state,
        selectedPatient: action.payload
      };

    case ActionType.PATIENT_LOAD_FAILURE:
    case ActionType.PATIENT_CREATE_FAILURE:
    case ActionType.PATIENT_UPDATE_FAILURE:
    case ActionType.PATIENT_DELETE_FAILURE:
    case ActionType.PATIENT_SEARCH_FAILURE:
      return {
        ...state,
        patientLoading: false,
        patientError: action.payload
      };

    case ActionType.PATIENT_CLEAR_ERROR:
      return {
        ...state,
        patientError: null
      };

    case ActionType.PATIENT_RESET:
      return {
        ...state,
        patients: [],
        selectedPatient: null,
        patientLoading: false,
        patientError: null,
        searchResults: [],
        isSearching: false
      };

    default:
      return state;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AppStore {
  private readonly _appState = new BehaviorSubject<AppState>(initialState);
  
  // Observable streams
  public readonly appState$ = this._appState.asObservable();
  
  // Auth observables
  public readonly isAuthenticated$ = this._appState.pipe(
    map(state => state.isAuthenticated)
  );
  public readonly user$ = this._appState.pipe(
    map(state => state.user)
  );
  public readonly token$ = this._appState.pipe(
    map(state => state.token)
  );
  public readonly authLoading$ = this._appState.pipe(
    map(state => state.authLoading)
  );
  public readonly authError$ = this._appState.pipe(
    map(state => state.authError)
  );

  // Patient observables
  public readonly patients$ = this._appState.pipe(
    map(state => state.patients)
  );
  public readonly selectedPatient$ = this._appState.pipe(
    map(state => state.selectedPatient)
  );
  public readonly patientLoading$ = this._appState.pipe(
    map(state => state.patientLoading)
  );
  public readonly patientError$ = this._appState.pipe(
    map(state => state.patientError)
  );
  public readonly searchResults$ = this._appState.pipe(
    map(state => state.searchResults)
  );
  public readonly isSearching$ = this._appState.pipe(
    map(state => state.isSearching)
  );

  // Getters
  get currentState(): AppState {
    return this._appState.value;
  }

  get isAuthenticated(): boolean {
    return this._appState.value.isAuthenticated;
  }

  get currentUser(): User | null {
    return this._appState.value.user;
  }

  get currentToken(): string | null {
    return this._appState.value.token;
  }

  get patients(): PatientDto[] {
    return this._appState.value.patients;
  }

  get selectedPatient(): PatientDto | null {
    return this._appState.value.selectedPatient;
  }

  get isLoading(): boolean {
    return this._appState.value.patientLoading;
  }

  get error(): string | null {
    return this._appState.value.patientError;
  }

  get searchResults(): PatientDto[] {
    return this._appState.value.searchResults;
  }

  get isSearching(): boolean {
    return this._appState.value.isSearching;
  }

  // Dispatch Method - Core of the Store Pattern
  dispatch(action: Action): void {
    const currentState = this._appState.value;
    const newState = appReducer(currentState, action);
    this._appState.next(newState);

    // Handle side effects for specific actions
    this.handleSideEffects(action, newState);
  }

  // Handle side effects (localStorage, etc.)
  private handleSideEffects(action: Action, state: AppState): void {
    switch (action.type) {
      case ActionType.AUTH_LOGIN_SUCCESS:
        const authResponse = action.payload as AuthResponse;
        localStorage.setItem('token', authResponse.token);
        localStorage.setItem('user', JSON.stringify(state.user));
        break;

      case ActionType.AUTH_LOGOUT:
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        break;

      case ActionType.AUTH_INITIALIZE:
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        break;
    }
  }

  // Convenience methods for common actions
  initializeAuth(): void {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.dispatch(AuthActions.initialize({ user, token }));
      } catch (error) {
        this.dispatch(AuthActions.logout());
      }
    }
  }
}
