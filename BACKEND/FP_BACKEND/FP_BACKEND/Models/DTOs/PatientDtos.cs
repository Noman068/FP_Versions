namespace FP_BACKEND.Models.DTOs
{
    
    public class CreatePatientRequest
    {
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Gender { get; set; }
        public string UserAddress { get; set; }
        public string Email { get; set; }
        public string PhoneNo { get; set; }
        public string EmergencyPhone { get; set; }
    }

    
    public class CreatePatientResponse
    {
        public int PatientId { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; }
    }

    
    public class UpdatePatientRequest
    {
        public int PatientId { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Gender { get; set; }
        public string UserAddress { get; set; }
        public string Email { get; set; }
        public string PhoneNo { get; set; }
        public string EmergencyPhone { get; set; }
    }

    public class UpdatePatientResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }

    }



    public class PatientDto
    {
        public int PatientId { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Gender { get; set; }
        public string UserAddress { get; set; }
        public string Email { get; set; }
        public string PhoneNo { get; set; }
        public string EmergencyPhone { get; set; }
    }

    public class DeletePatientRequest
    {
        public int PatientId { get; set; }
    }

    public class DeletePatientResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }

    public class SearchPatientRequest
    {
        public string FullName { get; set; }

      
    }


}
