using FP_BACKEND.DBhelper.Connection;
using FP_BACKEND.Repositories.AuditRepo.Implementations;
using FP_BACKEND.Repositories.AuditRepo.Interfaces;
using FP_BACKEND.Repositories.AuthRepo.Implementations;
using FP_BACKEND.Repositories.AuthRepo.Interfaces;
using FP_BACKEND.Repositories.PatientRepo.Implementations;
using FP_BACKEND.Repositories.PatientRepo.Interfaces;
using FP_BACKEND.Services.AuditSer.Interfaces;
using FP_BACKEND.Services.AuditSer.Implementations;
using FP_BACKEND.Services.AuthSer.Interfaces;
using FP_BACKEND.Services.AuthSer.Implementations;
using FP_BACKEND.Services.PatientSer.Interfaces;
using FP_BACKEND.Services.PatientSer.Implementations;
using FP_BACKEND.TokenGenerator;


namespace FP_BACKEND.Infrastructure
{
    public static class Registerar
    {

        public static IServiceCollection Register(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddHttpContextAccessor();
            services.AddScoped<ISqlConnectionFactory>(sp =>
            {
                var connectionString = configuration.GetConnectionString("DefaultConnection");
                return new SqlConnectionFactory(connectionString!);
            });


            services.AddScoped<TokenService>();
            services.AddScoped<IAuditService, AuditService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IAuditRepository, AuditRepository>();
            services.AddScoped<IAuthRepository, AuthRepository>();
            services.AddScoped<IPatientService, PatientService>();
            services.AddScoped<IPatientRepository, PatientRepository>();
            return services;
        }

    }
}
