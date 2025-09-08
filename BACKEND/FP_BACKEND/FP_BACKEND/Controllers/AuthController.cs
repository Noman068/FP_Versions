using FP_BACKEND.Models.Domain;
using FP_BACKEND.Models.DTOs;
using FP_BACKEND.Services.AuthSer.Interfaces;
using FP_BACKEND.Services.AuditSer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;



namespace FP_BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IAuditService _auditLogService;
        


        public AuthController(IAuthService authService, IAuditService auditLogService)
        {
            _authService = authService;
            _auditLogService = auditLogService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            try
            {
                var result = await _authService.LoginAsync(req.email, req.Password);
                if (result.token == null)
                {
                    return Unauthorized();
                }

               User userDetails = result.user;
                Audit audit = new Audit("Login", true,DateTime.Now ,$"Successful login for user {userDetails.Firstname} {userDetails.Lastname}", userDetails.UserId);

                await _auditLogService.LogAuditAsync(audit);

                return Ok(new AuthResponse { Token = result.token,Firstname=userDetails.Firstname,Lastname=userDetails.Lastname,Role=userDetails.RoleName});
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during login for user {req.email}: {ex.Message}");
                throw;
            }
        }

        [HttpPost("signup")]
        [AllowAnonymous]
        public async Task<IActionResult> Signup([FromBody] SignupRequest req)
        {
            try
            {
                SignupResponse result = await _authService.SignupAsync(req);
                Console.WriteLine(result.userId);
                Audit audit = new Audit("Login", true, DateTime.Now, $"Successful login for user {req.Firstname} {req.Lastname}", result.userId);
                if (result.Success)
                {
                    await _auditLogService.LogAuditAsync(audit);
                    return Ok(result);
                }
                else
                {
  
                    return BadRequest(result);
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
