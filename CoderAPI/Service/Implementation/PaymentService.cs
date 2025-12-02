using CoderAPI.DBOs;
using CoderAPI.DTOs;
using CoderAPI.DTOs.plan;
using CoderAPI.Enum;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface;
using CoderAPI.Service.Interface;
using Newtonsoft.Json;
using Razorpay.Api;
using System.Net.Http.Headers;
using System.Numerics;
using System.Text.Encodings;
using static MassTransit.Logging.OperationName;

namespace CoderAPI.Service.Implementation
{
    public class PaymentService : IPaymentService
    {
        private readonly IUserPlanRepository _userPlanRepository;
        private readonly IUserCourseRepository _userCourseRepository;
        private readonly ICourseRepository _courseRepository;
        private readonly IConfiguration _config;
        private readonly string _key, _secret;
        private readonly ICustomLogger _logger;

        public PaymentService(IUserPlanRepository userPlanRepository, IConfiguration config, ICustomLogger logger, 
            IUserCourseRepository userCourseRepository, ICourseRepository courseRepository)
        {
            _userPlanRepository = userPlanRepository;
            _config = config;
            _logger = logger;
            _key = _config["Razorpay:Key"];
            _secret = _config["Razorpay:Secret"];
            _userCourseRepository = userCourseRepository;
            _courseRepository = courseRepository;
        }

        public async Task<CreateOrderResponse> CreatePlanOrder(long PlanId, long userId)
        {
            try
            {
                var plan = await _userPlanRepository.GetPlanById(PlanId);
                
                RazorpayClient client = new RazorpayClient(_key, _secret);

                var option = new Dictionary<string, object>
                {
                    { "amount", (int)(plan.Price * 100) },
                    { "currency", "INR" },
                    { "receipt", "rcpt_" + DateTimeOffset.UtcNow.ToUnixTimeSeconds() }
                };

                Order order = client.Order.Create(option);


                var userPlan = new UserPlan
                {
                    PlanId = PlanId,
                    UserId = userId,
                    Status = PaymentStatus.Pending.ToString(),
                    CreatedBy = userId,
                    CreatedOn = DateTime.UtcNow,
                    StartDate = DateTime.UtcNow,
                    EndDate = DateTime.UtcNow.AddDays((int)plan.DurationDays),
                    IsActive = false,
                    SubscriptionLevel = GetSubscriptionLevelFromPlan(plan.Name),
                    RazorpayOrderId = order["id"].ToString(),
                };
                userPlan.UserPlanId = await _userPlanRepository.AddUserPlan(userPlan);

                return new CreateOrderResponse
                {
                    Price = plan.Price,
                    Currency = "INR",
                    Key = _key,
                    RazorPayOrderId = order["id"].ToString(),
                    UserPlanId = userPlan.UserPlanId,
                };                
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to buy PlanId: {PlanId} for userId:{userId}",ex);
                throw;
            }
        }

        public async Task<StatusResponse> VerifyPlanPayment(VerifyPaymentRequest request, long userId)
        {
            try
            {
                var attributes = new Dictionary<string, string>
                {
                    { "razorpay_payment_id", request.PaymentId },
                    { "razorpay_order_id", request.RayzorpayOrderId },
                    { "razorpay_signature", request.Signature }
                };

                Utils.verifyPaymentSignature(attributes);

                var paymentDetails = await this.GetRazorpayPayementDetails(request.PaymentId);

                var ok = await _userPlanRepository.UpdateUserPlan(request.UserPlanId, PaymentStatus.Completed.ToString(), paymentDetails.Id);
                if (ok > 0) return new StatusResponse { Status = true, Message = "Payment verified..!" };
                return new StatusResponse { Status = false, Message = "Couldn't verify payment..!" };
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to verify payment for userPlanId: {request.UserPlanId} and userId: {userId}", ex);
                throw;
            }
        }
        
        private string GetSubscriptionLevelFromPlan(string plan)
        {
            if (plan.Contains(SubscriptionLevel.Basic.ToString())) return SubscriptionLevel.Basic.ToString();
            else if (plan.Contains(SubscriptionLevel.Premium.ToString())) return SubscriptionLevel.Premium.ToString();
            return SubscriptionLevel.Free.ToString();
        }
        private async Task<RazorpayPaymentResponse> GetRazorpayPayementDetails(string paymentId)
        {
            using (var client = new HttpClient())
            {
                var byteArray = System.Text.Encoding.ASCII.GetBytes($"{_key}:{_secret}");
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));

                var response = await client.GetAsync($"https://api.razorpay.com/v1/payments/{paymentId}");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var paymentResponse = JsonConvert.DeserializeObject<RazorpayPaymentResponse>(json);
                return paymentResponse;
            }
        }

        public async Task<CreateOrderResponse> CreateCourseOrder(long CourseId, long userId)
        {
            try
            {
                var course = await _courseRepository.GetCourseById(CourseId);
                RazorpayClient client = new RazorpayClient(_key, _secret);

                var option = new Dictionary<string, object>
                {
                    { "amount", (int)(course.Price * 100) },
                    { "currency", "INR" },
                    { "receipt", "rcpt_" + DateTimeOffset.UtcNow.ToUnixTimeSeconds() }
                };

                Order order = client.Order.Create(option);

                var userCourse = new UserCourse
                {
                    CourseId = CourseId,
                    UserId = userId,
                    IsActive = false,
                    CreatedBy = userId,
                    CreatedOn = DateTime.UtcNow,
                    RazorpayOrderId = order["id"].ToString(),
                    PaymentStatus = PaymentStatus.Pending.ToString(),
                    ProgressStatus = CourseStatus.NotStarted.ToString(),
                    PurchaseDate = DateTime.UtcNow,
                };
                userCourse.UserCourseId = await _userCourseRepository.AddUserCourse(userCourse);
                return new CreateOrderResponse
                {
                    Price = course.Price,
                    Currency = "INR",
                    Key = _key,
                    RazorPayOrderId = order["id"].ToString(),
                    UserCourseId = userCourse.UserCourseId,
                };
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: Unable to create order for user course", ex);
                throw;
            }
        }

        public async Task<StatusResponse> VerifyCoursePayment(VerifyPaymentRequest request, long userId)
        {
            try
            {
                var attributes = new Dictionary<string, string>
                {
                    { "razorpay_payment_id", request.PaymentId },
                    { "razorpay_order_id", request.RayzorpayOrderId },
                    { "razorpay_signature", request.Signature }
                };

                Utils.verifyPaymentSignature(attributes);

                var paymentDetails = await this.GetRazorpayPayementDetails(request.PaymentId);

                var ok = await _userCourseRepository.UpdateUserCourse(request.UserCourseId, paymentDetails.Id, PaymentStatus.Completed.ToString(), userId);
                if (ok > 0) return new StatusResponse { Status = true, Message = "Payment verified..!" };
                return new StatusResponse { Status = false, Message = "Couldn't verify payment..!" };
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to verify course payment", ex);
                throw;
            }
        }

        public async Task<CreateOrderResponse> CreateBundleOrder(long BundleId, long userId)
        {
            try
            {
                var bundle = await _courseRepository.GetBundleById(BundleId);
                RazorpayClient client = new RazorpayClient(_key, _secret);

                var option = new Dictionary<string, object>
                {
                    { "amount", (int)(bundle.Price * 100) },
                    { "currency", "INR" },
                    { "receipt", "rcpt_" + DateTimeOffset.UtcNow.ToUnixTimeSeconds() }
                };

                Order order = client.Order.Create(option);

                var userCourse = bundle.Courses.Select(c => new UserCourse
                {
                    CourseId = c.CourseId,
                    UserId = userId,
                    IsActive = false,
                    CreatedBy = userId,
                    CreatedOn = DateTime.UtcNow,
                    RazorpayOrderId = order["id"].ToString(),
                    PaymentStatus = PaymentStatus.Pending.ToString(),
                    ProgressStatus = CourseStatus.NotStarted.ToString(),
                    PurchaseDate = DateTime.UtcNow,
                })
                    .ToList();

                var ok = await _userCourseRepository.AddUserCourseRange(userCourse);
                if (!ok) throw new Exception();
                return new CreateOrderResponse
                {
                    Price = bundle.Price,
                    Currency = "INR",
                    Key = _key,
                    RazorPayOrderId = order["id"].ToString(),
                };

            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to create bundle order with BundleId: {BundleId}", ex);
                throw;
            }
        }

        public async Task<StatusResponse> VerifyBundlePayment(VerifyPaymentRequest request, long userId)
        {
            try
            {
                var attributes = new Dictionary<string, string>
                {
                    { "razorpay_payment_id", request.PaymentId },
                    { "razorpay_order_id", request.RayzorpayOrderId },
                    { "razorpay_signature", request.Signature }
                };

                Utils.verifyPaymentSignature(attributes);

                var paymentDetails = await this.GetRazorpayPayementDetails(request.PaymentId);

                var ok = await _userCourseRepository.UpdateUserCoursebyRazorpayOrderId(request.RayzorpayOrderId, paymentDetails.Id, PaymentStatus.Completed.ToString(), userId);
                if (ok) return new StatusResponse { Status = true, Message = "Payment verified..!" };
                return new StatusResponse { Status = false, Message = "Couldn't verify payment..!" };
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to verify bundle payment ", ex);
                throw;
            }
        }
    }
}
