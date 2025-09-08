namespace FP_BACKEND.Models.Domain
{
    public class Audit
    {
        public string Action { get; set; }
        public bool Status { get; set; }
        public DateTime Timestamp { get; set; }
        public string Details { get; set; }
        public int UserId { get; set; }

        public Audit(string action, bool status, DateTime timestamp, string details, int userId)
        {
            Action = action;
            Status = status;
            Timestamp = timestamp;
            Details = details;
            UserId = userId;
        }

    }
}
