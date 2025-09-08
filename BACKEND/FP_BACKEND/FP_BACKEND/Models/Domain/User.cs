namespace FP_BACKEND.Models.Domain
{
    public class User
    {
        public int UserId { get; set; }
        public string Firstname { get; set; }

        public string Lastname { get; set; }

        public string PasswordHash { get; set; }

        public string address { get; set; }

        public string email  { get; set; }

        public string phone { get; set; }

        public int RoleId { get; set; }

        public string RoleName { get; set; }

    }
}
