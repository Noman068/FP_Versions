using FP_BACKEND.TokenGenerator;
using FP_BACKEND.Models.DTOs;
using FP_BACKEND.Repositories.AuthRepo.Interfaces;
using FP_BACKEND.Services.AuthSer.Interfaces;
using FP_BACKEND.Models.Domain;


namespace FP_BACKEND.Services.AuthSer.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _repo;
        private readonly TokenService _tokenService;

        public AuthService(IAuthRepository repo, TokenService tokenService)
        {
            _repo = repo;
            _tokenService = tokenService;
        }
                



        public async Task<(string token, User user)> LoginAsync(string email, string password)
        {
            if( string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            {
                return (null, null);
            }
            
                
                User user = await _repo.GetUserByEmailAsync(email, password);
                
                if (user == null) return (null, null);
                var token = _tokenService.GenerateToken(user);
            Console.WriteLine(token);
            Console.WriteLine(user);
                return (token, user);
            
         
        }

        public async Task<SignupResponse> SignupAsync(SignupRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.email) || string.IsNullOrWhiteSpace(request.PasswordHash))
            {
                return new SignupResponse
                {
                    Success = false,
                    Message = "Username and password are required"
                };
            }

            if (request.PasswordHash != request.ConfirmPassword)
            {
                return new SignupResponse
                {
                    Success = false,
                    Message = "Passwords do not match"
                };
            }

            if (request.PasswordHash.Length < 6)
            {
                return new SignupResponse
                {
                    Success = false,
                    Message = "Password must be at least 6 characters long"
                };
            }

            var validRoles = new[] { "admin", "clinician", "staff" };

            

            if (!validRoles.Contains(request.Role))
            {
                return new SignupResponse
                {
                    Success = false,
                    Message = "Invalid role. Must be Admin, Clinician, or Staff"
                };
            }

            //if (await _repo.EmailExistsAsync(request.email))
            //{
            //    return new SignupResponse
            //    {
            //        Success = false,
            //        Message = "Email already exists"
            //    };
            //}


            int success = await _repo.CreateUserAsync(request);
            Console.WriteLine(success);

            if (success != null)
            {
                return new SignupResponse
                {
                    userId = success,
                    Success = true,
                    Message = "User created successfully",
                    Firstname = request.Firstname,
                    Lastname = request.Lastname,
                    address = request.address,
                    email = request.email,
                    phone = request.phone,
                    RoleId = request.RoleId
                };
            }
            else
            {
                return new SignupResponse
                {
                    Success = false,
                    Message = "Failed to create "
                };
            }

        }

    }
}
