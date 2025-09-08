export interface CreatePatientRequest {
  firstname: string;
  lastname: string;
  gender: string;
  userAddress: string;
  email: string;
  phoneNo: string;
  emergencyPhone: string;
}

export interface CreatePatientResponse {
  patientId: number;
  success: boolean;
  message: string;
}

export interface UpdatePatientRequest {
  patientId: number;
  firstname: string;
  lastname: string;
  gender: string;
  userAddress: string;
  email: string;
  phoneNo: string;
  emergencyPhone: string;
}

export interface UpdatePatientResponse {
  success: boolean;
  message: string;
}

export interface PatientDto {
  patientId: number;
  firstname: string;
  lastname: string;
  gender: string;
  userAddress: string;
  email: string;
  phoneNo: string;
  emergencyPhone: string;
}

export interface DeletePatientRequest {
  patientId: number;
}

export interface DeletePatientResponse {
  success: boolean;
  message: string;
}

export interface SearchPatientRequest {
  fullName: string;
}
