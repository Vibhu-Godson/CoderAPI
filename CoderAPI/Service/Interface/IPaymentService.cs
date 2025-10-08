using CoderAPI.DTOs;
using CoderAPI.DTOs.plan;

namespace CoderAPI.Service.Interface
{
    public interface IPaymentService
    {
        Task<CreateOrderResponse> CreateOrder(long PlanId, long userId);
        Task<StatusResponse> VerifyPayment(VerifyPaymentRequest request, long userId);

    }
}
