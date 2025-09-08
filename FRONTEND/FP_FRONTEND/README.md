# FP Frontend - Angular Application

A modern Angular frontend application for the FP (Final Project) system with patient management, authentication, and state management using RxJS subjects.

## Features

- **Authentication System**: Login and signup with JWT token management
- **Patient Management**: CRUD operations for patient records
- **State Management**: RxJS subjects and stores for reactive state management
- **Reactive Forms**: Form validation and user input handling
- **Custom Directives**: Name input validation and formatting
- **Modern Angular**: Uses Angular 18+ with standalone components and control flow syntax (@for, @if, @switch)
- **Responsive Design**: Mobile-first responsive UI
- **Role-based Access**: Different access levels for admin, staff, and doctors

## Technology Stack

- **Angular 17+**: Latest Angular framework with standalone components
- **RxJS**: Reactive programming with subjects and observables
- **TypeScript**: Type-safe development
- **SCSS**: Enhanced CSS with variables and mixins
- **Reactive Forms**: Form handling and validation
- **HTTP Client**: API communication with the backend

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── dashboard/
│   │   └── patients/
│   │       ├── patient-form/
│   │       ├── patient-list/
│   │       ├── patient-search/
│   │       └── patient-management/
│   ├── directives/
│   │   └── name-input.directive.ts
│   ├── models/
│   │   ├── auth.models.ts
│   │   ├── patient.models.ts
│   │   └── audit.models.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── patient.service.ts
│   ├── store/
│   │   ├── auth.store.ts
│   │   └── patient.store.ts
│   ├── app.component.ts
│   ├── app.routes.ts
│   └── main.ts
├── styles.scss
└── index.html
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (v17 or higher)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Install Angular CLI globally** (if not already installed):
   ```bash
   npm install -g @angular/cli@17
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:4200`

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Key Features Explained

### State Management with RxJS Subjects

The application uses RxJS subjects for state management:

- **AuthStore**: Manages authentication state, user information, and tokens
- **PatientStore**: Manages patient data, loading states, and search results

### Custom Directives

- **NameInputDirective**: Validates and formats first name and last name inputs
  - Capitalizes first letter of each word
  - Removes invalid characters
  - Validates length and format
  - Provides real-time feedback

### Reactive Forms

All forms use Angular reactive forms with:
- Real-time validation
- Custom validators
- Error handling
- Form state management

### Control Flow Syntax

The application uses Angular's new control flow syntax:
- `@if` for conditional rendering
- `@for` for list rendering
- `@switch` for multiple condition handling

### API Integration

The frontend integrates with the backend API:
- **Base URL**: `https://localhost:52668/api`
- **Authentication**: JWT token-based authentication
- **Endpoints**: Auth and Patient management endpoints

## Components Overview

### Authentication Components

- **LoginComponent**: User login with email and password
- **SignupComponent**: User registration with role selection

### Patient Management Components

- **PatientManagementComponent**: Main patient management interface
- **PatientFormComponent**: Create and edit patient forms
- **PatientSearchComponent**: Search patients by name
- **PatientListComponent**: Display patient list with actions

### Dashboard Component

- **DashboardComponent**: Main dashboard with statistics and quick actions

## Services

### AuthService
- Handles login, signup, and logout operations
- Manages JWT tokens and user sessions
- Integrates with AuthStore for state management

### PatientService
- CRUD operations for patients
- Search functionality
- Error handling and loading states

## Models

### Auth Models
- `LoginRequest`, `AuthResponse`
- `SignupRequest`, `SignupResponse`
- `User` interface

### Patient Models
- `PatientDto`, `CreatePatientRequest`
- `UpdatePatientRequest`, `SearchPatientRequest`
- Response models for all operations

## Styling

The application uses SCSS with:
- Global styles in `styles.scss`
- Component-specific styles
- Responsive design with mobile-first approach
- Modern UI with gradients and shadows
- Bootstrap-like utility classes

## Development

### Code Structure

- **Standalone Components**: All components are standalone for better tree-shaking
- **Lazy Loading**: Routes use lazy loading for better performance
- **Type Safety**: Full TypeScript support with strict mode
- **Reactive Programming**: RxJS for all async operations

### Best Practices

- Separation of concerns with services, stores, and components
- Reactive forms for all user input
- Custom directives for reusable functionality
- Proper error handling and loading states
- Responsive design principles

## API Endpoints

The frontend expects the following backend endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Patient Management
- `GET /api/patient/all` - Get all patients
- `POST /api/patient/create` - Create new patient
- `PUT /api/patient/update` - Update patient
- `DELETE /api/patient/delete/{id}` - Delete patient
- `POST /api/patient/search` - Search patients

## Contributing

1. Follow Angular style guide
2. Use TypeScript strict mode
3. Write meaningful commit messages
4. Test all functionality before submitting
5. Ensure responsive design works on all devices

## License

This project is part of the FP (Final Project) system.