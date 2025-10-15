namespace CoderAPI.DTOs.plan
{
    public class CreateOrderResponse
    {
        public decimal Price { get; set; }
        public string RazorPayOrderId { get; set; }
        public string Key { get; set; }
        public long UserPlanId { get; set; }
        public long UserCourseId { get; set; }
        public string Currency { get; set; }
    }
    public class VerifyPaymentRequest
    {
        public string PaymentId { get; set; }
        public string RayzorpayOrderId { get; set; }
        public long UserPlanId { get; set; }
        public long UserCourseId { get; set; }
        public long UserBundleId { get; set; }
        public string Signature { get; set; }
    }
}
