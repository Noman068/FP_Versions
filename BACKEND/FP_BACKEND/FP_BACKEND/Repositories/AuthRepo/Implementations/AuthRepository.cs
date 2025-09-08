using FP_BACKEND.DBhelper.Connection;
using FP_BACKEND.Models.Domain;
using FP_BACKEND.Models.DTOs;
using FP_BACKEND.Repositories.AuthRepo.Interfaces;
using System.Data;
using System.Data.Common;

namespace FP_BACKEND.Repositories.AuthRepo.Implementations
{
    public class AuthRepository : IAuthRepository
    {

        private readonly ISqlConnectionFactory _connectionFactory;

        public AuthRepository(ISqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<User> GetUserByEmailAsync(string email,string password)
        {
            using var conn = _connectionFactory.CreateConnection();
            var db = (DbConnection)conn;
            await db.OpenAsync();
            using var cmd = db.CreateCommand();


            cmd.CommandText = "STP_FETCH_USER";
            cmd.CommandType = CommandType.StoredProcedure;
            AddParam(cmd, "@email", email);
            AddParam(cmd, "@USERPASSWORD", password);
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                Console.WriteLine(reader);
                return new User
                {
                    UserId = reader.GetInt32(0),
                    Firstname = reader.GetString(1),
                    Lastname = reader.GetString(2),
                    address = reader.GetString(4),
                    email = reader.GetString(5),
                    phone = reader.GetString(6),
                    RoleId = reader.GetInt32(7),
                    RoleName=reader.GetString(8)

                };
            }
            return null;
        }


       

        public async Task<int> CreateUserAsync(SignupRequest req)
        {
            using var conn = _connectionFactory.CreateConnection();
            var db = (DbConnection)conn;
            await db.OpenAsync();
            using var cmd = db.CreateCommand();

            cmd.CommandText = "STP_CREATE_USER";
            cmd.CommandType = CommandType.StoredProcedure;
            AddParam(cmd, "@fname", req.Firstname);
            AddParam(cmd, "@lname", req.Lastname);
            AddParam(cmd, "@userPassword", req.ConfirmPassword);
            AddParam(cmd, "@userAddress", req.address);
            AddParam(cmd, "@email", req.email);
            AddParam(cmd, "@pno", req.phone);
            AddParam(cmd, "@roleId", req.RoleId);

            var result = await cmd.ExecuteScalarAsync();
            int newUserId = Convert.ToInt32(result);
            return newUserId;
        }

        private static void AddParam(IDbCommand cmd, string name, object value)
        {
            var p = cmd.CreateParameter();
            p.ParameterName = name;
            p.Value = value ?? DBNull.Value; // Ensure nulls are handled
            cmd.Parameters.Add(p);
        }

    }
}
