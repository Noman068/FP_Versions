using FP_BACKEND.Models.DTOs;

namespace FP_BACKEND.Services.PatientSer.Interfaces
{
    public interface IPatientService
    {

        Task<CreatePatientResponse> CreatePatientAsync(CreatePatientRequest request);
        Task<UpdatePatientResponse> UpdatePatientAsync(UpdatePatientRequest request);
        Task<IEnumerable<PatientDto>> GetAllPatientsAsync();
        Task<IEnumerable<PatientDto>> SearchPatientByNameAsync(string fullname);
        Task<DeletePatientResponse> DeletePatientAsync(DeletePatientRequest request);

    }
}
