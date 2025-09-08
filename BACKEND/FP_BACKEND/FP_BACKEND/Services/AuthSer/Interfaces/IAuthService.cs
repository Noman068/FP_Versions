using FP_BACKEND.Models.Domain;
using FP_BACKEND.Models.DTOs;

namespace FP_BACKEND.Services.AuthSer.Interfaces
{
    public interface IAuthService
    {

        Task<(string token, User user)> LoginAsync(string email, string password);
        Task<SignupResponse> SignupAsync(SignupRequest request);
    }
}
