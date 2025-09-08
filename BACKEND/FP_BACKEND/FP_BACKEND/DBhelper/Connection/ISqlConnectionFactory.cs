using Microsoft.Data.SqlClient;

namespace FP_BACKEND.DBhelper.Connection
{
    public interface ISqlConnectionFactory
    {
        SqlConnection CreateConnection();
    }
}
