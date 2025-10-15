using CoderAPI.DTOs;
using CoderAPI.DTOs.plan;

namespace CoderAPI.Service.Interface
{
    public interface IPaymentService
    {
        Task<CreateOrderResponse> CreatePlanOrder(long PlanId, long userId);
        Task<StatusResponse> VerifyPlanPayment(VerifyPaymentRequest request, long userId);
        Task<CreateOrderResponse> CreateCourseOrder(long CourseId, long userId);
        Task<StatusResponse> VerifyCoursePayment(VerifyPaymentRequest request, long userId);
        Task<CreateOrderResponse> CreateBundleOrder(long BundleId, long userId);
        Task<StatusResponse> VerifyBundlePayment(VerifyPaymentRequest request, long userId);

    }
}
