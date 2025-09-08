
using FP_BACKEND.Models.Domain;
using FP_BACKEND.Repositories.AuditRepo.Interfaces;
using FP_BACKEND.Services.AuditSer.Interfaces;

namespace FP_BACKEND.Services.AuditSer.Implementations
{
    public class AuditService : IAuditService
    {
        
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IAuditRepository _auditReository;

        public AuditService( IHttpContextAccessor httpContextAccessor,IAuditRepository auditRepository)
        {
            
            _httpContextAccessor = httpContextAccessor;
            _auditReository = auditRepository;
            
        }

        public async Task LogAuditAsync(Audit audit)
        {
            try
            {
                if (_httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated == true
                    || audit.Action == "Login"
                    || audit.Action == "Signup")
                {
                    await _auditReository.LogAuditinDBAsync(audit);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error logging activity: {ex.Message}");
            }
        }


    }
}
