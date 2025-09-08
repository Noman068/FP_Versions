using Azure.Core;
using FP_BACKEND.Models.Domain;
using FP_BACKEND.Models.DTOs;

namespace FP_BACKEND.Repositories.AuthRepo.Interfaces
{
    public interface IAuthRepository
    {

        Task<User> GetUserByEmailAsync(string email,string password);
     
        Task<int> CreateUserAsync(SignupRequest request);


    }
}
