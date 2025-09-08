using FP_BACKEND.Models.Domain;

namespace FP_BACKEND.Services.AuditSer.Interfaces
{
    public interface IAuditService
    {
        Task LogAuditAsync(Audit audit);
       

    }
}
