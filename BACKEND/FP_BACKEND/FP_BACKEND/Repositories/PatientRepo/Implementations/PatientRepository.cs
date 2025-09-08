using FP_BACKEND.DBhelper.Connection;
using FP_BACKEND.Models.DTOs;
using FP_BACKEND.Repositories.PatientRepo.Interfaces;
using Microsoft.Data.SqlClient;
using System.Data;

namespace FP_BACKEND.Repositories.PatientRepo.Implementations
{
    public class PatientRepository : IPatientRepository
    {
        private readonly ISqlConnectionFactory _factory;

        public PatientRepository(ISqlConnectionFactory factory)
        {
            _factory = factory;
        }

        public async Task<CreatePatientResponse> CreatePatientAsync(CreatePatientRequest request)
        {
            var response = new CreatePatientResponse();
            try
            {
                using var conn = _factory.CreateConnection();
                using var cmd = new SqlCommand("STP_CREATE_PATIENT", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@FIRSTNAME", request.Firstname);
                cmd.Parameters.AddWithValue("@LASTNAME", request.Lastname);
                cmd.Parameters.AddWithValue("@GENDER", request.Gender);
                cmd.Parameters.AddWithValue("@USERADDRESS", request.UserAddress);
                cmd.Parameters.AddWithValue("@EMAIL", request.Email);
                cmd.Parameters.AddWithValue("@PHONENO", request.PhoneNo);
                cmd.Parameters.AddWithValue("@EMERGENCY_PHONE", request.EmergencyPhone);

                await conn.OpenAsync();
                var newId = (int)await cmd.ExecuteScalarAsync();

                response.PatientId = newId;
                response.Success = true;
                response.Message = "Patient created successfully.";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error creating patient: {ex.Message}";
            }
            return response;
        }

        public async Task<UpdatePatientResponse> UpdatePatientAsync(UpdatePatientRequest request)
        {
            var response = new UpdatePatientResponse();
            try
            {
                using var conn = _factory.CreateConnection();
                using var cmd = new SqlCommand("STP_UPDATE_PATIENT", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@ID", request.PatientId);
                cmd.Parameters.AddWithValue("@FIRSTNAME", request.Firstname);
                cmd.Parameters.AddWithValue("@LASTNAME", request.Lastname);
                cmd.Parameters.AddWithValue("@GENDER", request.Gender);
                cmd.Parameters.AddWithValue("@USERADDRESS", request.UserAddress);
                cmd.Parameters.AddWithValue("@EMAIL", request.Email);
                cmd.Parameters.AddWithValue("@PHONENO", request.PhoneNo);
                cmd.Parameters.AddWithValue("@EMERGENCY_PHONE", request.EmergencyPhone);

                await conn.OpenAsync();
                int rows = await cmd.ExecuteNonQueryAsync();

                response.Success = rows > 0;
                response.Message = rows > 0 ? "Patient updated successfully." : "Patient not found.";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error updating patient: {ex.Message}";
            }
            return response;
        }

        public async Task<IEnumerable<PatientDto>> GetAllPatientsAsync()
        {
            var patients = new List<PatientDto>();
            try
            {
                using var conn = _factory.CreateConnection();
                using var cmd = new SqlCommand("STP_GET_ALL_PATIENTS", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                await conn.OpenAsync();
                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    patients.Add(new PatientDto
                    {
                        PatientId = reader.GetInt32(0),     
                        Firstname = reader.GetString(1),    
                        Lastname = reader.GetString(2),   
                        Gender = reader.GetString(3),    
                        UserAddress = reader.GetString(4),  
                        Email = reader.GetString(5),        
                        PhoneNo = reader.GetString(6),      
                        EmergencyPhone = reader.GetString(7)
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching patients: {ex.Message}");
            }
            return patients;
        }

        public async Task<IEnumerable<PatientDto>> SearchPatientByNameAsync(string fullname)
        {
            var patients = new List<PatientDto>();
            try
            {
                using var conn = _factory.CreateConnection();
                using var cmd = new SqlCommand("STP_SEARCH_PATIENT_BY_NAME", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@FULLNAME", fullname);

                await conn.OpenAsync();
                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    patients.Add(new PatientDto
                    {
                        PatientId = reader.GetInt32(0),     
                        Firstname = reader.GetString(1),    
                        Lastname = reader.GetString(2),     
                        Gender = reader.GetString(3),       
                        UserAddress = reader.GetString(4),  
                        Email = reader.GetString(5),        
                        PhoneNo = reader.GetString(6),      
                        EmergencyPhone = reader.GetString(7)
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error searching patient: {ex.Message}");
            }
            return patients;
        }

        public async Task<DeletePatientResponse> DeletePatientAsync(DeletePatientRequest request)
        {
            var response = new DeletePatientResponse();
            try
            {
                using var conn = _factory.CreateConnection();
                using var cmd = new SqlCommand("STP_DELETE_PATIENT", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@ID", request.PatientId);

                await conn.OpenAsync();
                int rows = await cmd.ExecuteNonQueryAsync();

                response.Success = rows > 0;
                response.Message = rows > 0 ? "Patient deleted successfully." : "Patient not found.";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error deleting patient: {ex.Message}";
            }
            return response;
        }
    }
}
