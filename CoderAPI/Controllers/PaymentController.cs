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

        [HttpPost("Plan/create-order")]
        public async Task<ActionResult<CreateOrderResponse>> CreateOrder(long PlanId)
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _paymentService.CreatePlanOrder(PlanId, userId);
                return Ok(response);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"unable to create order", ex);
                return BadRequest(ex);
            }
        }

        [HttpPost("Plan/verify-payment")]
        public async Task<ActionResult<StatusResponse>> VerifyPayment(VerifyPaymentRequest request)
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _paymentService.VerifyPlanPayment(request, userId);
                return Ok(response);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, "unable to verify payment..!", ex);
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("Course/create-order")]
        public async Task<ActionResult<CreateOrderResponse>> CreateCourseOrder(long CourseId)
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _paymentService.CreateCourseOrder(CourseId, userId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"unable to create order", ex);
                return BadRequest(ex);
            }
        }

        [HttpPost("Course/verify-payment")]
        public async Task<ActionResult<StatusResponse>> VerifyCoursePayment(VerifyPaymentRequest request)
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _paymentService.VerifyPlanPayment(request, userId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, "unable to verify payment..!", ex);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("Bundle/create-order")]
        public async Task<ActionResult<CreateOrderResponse>> CreateBundleOrder(long BundleId)
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _paymentService.CreateBundleOrder(BundleId, userId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"unable to create order", ex);
                return BadRequest(ex);
            }
        }

        [HttpPost("Bundle/verify-payment")]
        public async Task<ActionResult<StatusResponse>> VerifyBundlePayment(VerifyPaymentRequest request)
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _paymentService.VerifyBundlePayment(request, userId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, "unable to verify payment..!", ex);
                return BadRequest(ex.Message);
            }
        }
    }
}
