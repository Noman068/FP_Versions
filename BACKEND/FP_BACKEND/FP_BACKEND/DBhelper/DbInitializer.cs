
using Microsoft.Data.SqlClient;

namespace FP_BACKEND.DBhelper
{
    public class DbInitializer
    {

        public static SqlConnection GetOpenConnection(string connectionString)
        {
            if (string.IsNullOrEmpty(connectionString))
                throw new InvalidOperationException("Connection string is not configured.");

            var conn = new SqlConnection(connectionString);
            conn.Open();
            return conn; 
        }

        public static void ExecuteStoredProcedure(string connectionString, string procedureName, params SqlParameter[] parameters)
        {
            using var conn = GetOpenConnection(connectionString);
            using var cmd = new SqlCommand(procedureName, conn)
            {
                CommandType = System.Data.CommandType.StoredProcedure
            };

            if (parameters != null && parameters.Length > 0)
                cmd.Parameters.AddRange(parameters);

            cmd.ExecuteNonQuery();
        }
    }

}

