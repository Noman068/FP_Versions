namespace FP_BACKEND.Models.DTOs
{
    public class LoginRequest
    {
        public string email { get; set; }
        public string Password { get; set; }
    }

    public class AuthResponse
    {
        public string Token { get; set; }
        public string Firstname { get; set; }

        public string Lastname { get; set; }

        public string Role { get; set; }
    }

    public class SignupRequest
    {
        public string Firstname { get; set; }

        public string Lastname { get; set; }

        public string PasswordHash { get; set; }

        public string ConfirmPassword { get; set; }

        public string address { get; set; }

        public string email { get; set; }

        public string phone { get; set; }

        public string Role { get; set; }

        public int RoleId { get; set; }

    }

    public class SignupResponse
    {
      
        public int userId { get; set; }
        public string Firstname { get; set; }

        public string Lastname { get; set; }

        public string address { get; set; }
        public string email { get; set; }

        public string phone { get; set; }

        public int RoleId { get; set; }

        public bool Success { get; set; }

        public string Message { get; set; }
    }
}
