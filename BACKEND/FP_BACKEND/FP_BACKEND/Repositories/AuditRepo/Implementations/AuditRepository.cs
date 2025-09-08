using FP_BACKEND.DBhelper.Connection;
using FP_BACKEND.Models.Domain;
using FP_BACKEND.Repositories.AuditRepo.Interfaces;
using Microsoft.Data.SqlClient;
using System.Data;



namespace FP_BACKEND.Repositories.AuditRepo.Implementations
{

    public class AuditRepository : IAuditRepository
    {
        private readonly ISqlConnectionFactory _factory;
        public AuditRepository(ISqlConnectionFactory factory) { _factory = factory; }


        public async Task LogAuditinDBAsync(Audit audit)
        {
            try
            {
                using var conn = _factory.CreateConnection();
                var db = (SqlConnection)conn;
                await db.OpenAsync();
                using var cmd = (SqlCommand)db.CreateCommand();
                cmd.CommandText = "STP_INSERT_AUDITLOG";
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Action", audit.Action));
                cmd.Parameters.Add(new SqlParameter("@Status", audit.Status));
                cmd.Parameters.Add(new SqlParameter("@_time", DateTime.Now));
                cmd.Parameters.Add(new SqlParameter("@Details", audit.Details));
                cmd.Parameters.Add(new SqlParameter("@UserId", audit.UserId));
                await cmd.ExecuteNonQueryAsync();
            }
            catch (Exception ex)
            {
                
                Console.WriteLine($"Error logging activity: {ex.Message}");
            }
        }

    }
}


