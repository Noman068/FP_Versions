using FP_BACKEND.Models.Domain;
using FP_BACKEND.Models.DTOs;
using FP_BACKEND.Services.PatientSer.Interfaces;
using FP_BACKEND.Services.AuditSer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FP_BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "admin,staff")]
    public class PatientController : ControllerBase
    {
        private readonly IPatientService _patientService;
        private readonly IAuditService _auditService;

        public PatientController(IPatientService patientService, IAuditService auditService)
        {
            _patientService = patientService;
            _auditService = auditService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreatePatient([FromBody] CreatePatientRequest request)
        {
            var result = await _patientService.CreatePatientAsync(request);

            
            var audit = new Audit(
                "CreatePatient",
                result.Success,
                DateTime.Now,
                result.Success
                    ? $"Patient {request.Firstname} {request.Lastname} created successfully."
                    : $"Failed to create patient {request.Firstname} {request.Lastname}.",
                GetCurrentUserId()
            );
            await _auditService.LogAuditAsync(audit);

            if (result.Success) return Ok(result);
            return BadRequest(result);
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdatePatient([FromBody] UpdatePatientRequest request)
        {
            var result = await _patientService.UpdatePatientAsync(request);

            
            var audit = new Audit(
                "UpdatePatient",
                result.Success,
                DateTime.Now,
                result.Success
                    ? $"Patient {request.PatientId} updated successfully."
                    : $"Failed to update patient {request.PatientId}.",
                GetCurrentUserId()
            );
            await _auditService.LogAuditAsync(audit);

            if (result.Success) return Ok(result);
            return BadRequest(result);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var result = await _patientService.DeletePatientAsync(new DeletePatientRequest { PatientId = id });

          
            var audit = new Audit(
                "DeletePatient",
                result.Success,
                DateTime.Now,
                result.Success
                    ? $"Patient {id} deleted successfully."
                    : $"Failed to delete patient {id}.",
                GetCurrentUserId()
            );
            await _auditService.LogAuditAsync(audit);

            if (result.Success) return Ok(result);
            return BadRequest(result);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllPatients()
        {
            var patients = await _patientService.GetAllPatientsAsync();

            
            var audit = new Audit(
                "GetAllPatients",
                true,
                DateTime.Now,
                $"Retrieved {patients.Count()} patients.",
                GetCurrentUserId()
            );
            await _auditService.LogAuditAsync(audit);

            return Ok(patients);
        }

        [HttpPost("search")]
        public async Task<IActionResult> SearchPatient([FromBody] SearchPatientRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.FullName))
            {
                return BadRequest("Full name is required for search.");
            }

            var patients = await _patientService.SearchPatientByNameAsync(request.FullName);

            
            var audit = new Audit(
                "SearchPatient",
                true,
                DateTime.Now,
                $"Searched patient by name: {request.FullName}, found {patients.Count()} record(s).",
                GetCurrentUserId()
            );
            await _auditService.LogAuditAsync(audit);

            return Ok(patients);
        }

        
        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)
                      ?? User.FindFirst("sub");

            if (userIdClaim == null)
                throw new Exception("UserId not found in token.");

            return int.Parse(userIdClaim.Value);
        }
    }
}
