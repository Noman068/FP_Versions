using FP_BACKEND.Models.Domain;

namespace FP_BACKEND.Repositories.AuditRepo.Interfaces
{
    public interface IAuditRepository
    {
        Task LogAuditinDBAsync(Audit audit);
    }
}
