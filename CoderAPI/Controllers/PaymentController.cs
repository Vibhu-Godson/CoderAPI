using CoderAPI.DTOs;
using CoderAPI.DTOs.plan;
using CoderAPI.Helper.Interface;
using CoderAPI.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CoderAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly ICustomLogger _logger;

        public PaymentController(IPaymentService paymentService, ICustomLogger logger)
        {
            _paymentService = paymentService;
            _logger = logger;
        }

        [HttpPost("create-order")]
        public async Task<ActionResult<CreateOrderResponse>> CreateOrder(long PlanId)
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _paymentService.CreateOrder(PlanId, userId);
                return Ok(response);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"unable to create order", ex);
                return BadRequest(ex);
            }
        }

        [HttpPost("verify-payment")]
        public async Task<ActionResult<StatusResponse>> VerifyPayment(VerifyPaymentRequest request)
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _paymentService.VerifyPayment(request, userId);
                return Ok(response);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, "unable to verify payment..!", ex);
                return BadRequest(ex.Message);
            }
        }
    }
}
