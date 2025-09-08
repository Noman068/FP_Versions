using FP_BACKEND.Models.DTOs;
using FP_BACKEND.Repositories.PatientRepo.Interfaces;
using FP_BACKEND.Services.PatientSer.Interfaces;

namespace FP_BACKEND.Services.PatientSer.Implementations
{
    public class PatientService : IPatientService
    {
        private readonly IPatientRepository _repo;

        public PatientService(IPatientRepository repo)
        {
            _repo = repo;
        }

        public async Task<CreatePatientResponse> CreatePatientAsync(CreatePatientRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Firstname) ||
                string.IsNullOrWhiteSpace(request.Lastname) ||
                string.IsNullOrWhiteSpace(request.Gender) ||
                string.IsNullOrWhiteSpace(request.UserAddress) ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.PhoneNo) ||
                string.IsNullOrWhiteSpace(request.EmergencyPhone))
            {
                return new CreatePatientResponse
                {
                    Success = false,
                    Message = "All fields are required."
                };
            }

            return await _repo.CreatePatientAsync(request);
        }

        public async Task<UpdatePatientResponse> UpdatePatientAsync(UpdatePatientRequest request)
        {
            if (request.PatientId <= 0)
            {
                return new UpdatePatientResponse
                {
                    Success = false,
                    Message = "Invalid Patient ID."
                };
            }

            return await _repo.UpdatePatientAsync(request);
        }

        public async Task<IEnumerable<PatientDto>> GetAllPatientsAsync()
        {
            return await _repo.GetAllPatientsAsync();
        }

        public async Task<IEnumerable<PatientDto>> SearchPatientByNameAsync(string fullname)
        {
            if (string.IsNullOrWhiteSpace(fullname))
            {
                return new List<PatientDto>();
            }

            return await _repo.SearchPatientByNameAsync(fullname);
        }

        public async Task<DeletePatientResponse> DeletePatientAsync(DeletePatientRequest request)
        {
            if (request.PatientId <= 0)
            {
                return new DeletePatientResponse
                {
                    Success = false,
                    Message = "Invalid Patient ID."
                };
            }

            return await _repo.DeletePatientAsync(request);
        }
    }
}
