
using FP_BACKEND.Models.Domain;
using FP_BACKEND.Models.DTOs;

namespace FP_BACKEND.Repositories.PatientRepo.Interfaces
{
    public interface IPatientRepository
    {

        Task<CreatePatientResponse> CreatePatientAsync(CreatePatientRequest request);
        Task<UpdatePatientResponse> UpdatePatientAsync(UpdatePatientRequest request);
        Task<IEnumerable<Patient>> GetAllPatientsAsync();
        Task<IEnumerable<Patient>> SearchPatientByNameAsync(string fullname);
        Task<DeletePatientResponse> DeletePatientAsync(DeletePatientRequest request);

    }
}
