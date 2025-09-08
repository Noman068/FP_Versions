using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using FP_BACKEND.Models.Domain;


namespace FP_BACKEND.TokenGenerator
{
    public class TokenService
    {

        private readonly IConfiguration _config;

        public TokenService(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateToken(User user)
        {
            
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
{
    new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
    new Claim(JwtRegisteredClaimNames.UniqueName, user.email),
    new Claim("firstname", user.Firstname ?? string.Empty),
    new Claim("lastname", user.Lastname ?? string.Empty),
    new Claim(ClaimTypes.Role, user.RoleName ?? string.Empty)
};

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1), 
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


    }
}
