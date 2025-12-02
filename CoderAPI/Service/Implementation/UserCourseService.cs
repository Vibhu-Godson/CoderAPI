using CoderAPI.DBOs;
using CoderAPI.DTOs;
using CoderAPI.DTOs.Course;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface;
using CoderAPI.Service.Interface;
using Microsoft.AspNetCore.Http.HttpResults;

namespace CoderAPI.Service.Implementation
{
    public class UserCourseService : IUserCourseService
    {
        private readonly IUserCourseRepository _userCourseRepository;
        private readonly ICustomLogger _logger;

        public UserCourseService(IUserCourseRepository userCourseRepository, ICustomLogger logger)
        {
            _userCourseRepository = userCourseRepository;
            _logger = logger;
        }

        public async Task<MyCourseDetail> GetCourseByUserCourseId(long userCourseId, long userId)
        {
            try
            {
                var response = await _userCourseRepository.GetCourseByUserCourseId(userCourseId, userId);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to get course by user course Id: {userCourseId} and userid: {userId}", ex);
                throw;
            }
        }

        public async Task<ListDto<MyCourseCard>> GetMyCourses(long userId)
        {
            try
            {
                var response = await _userCourseRepository.GetMyCourses(userId);
                return new ListDto<MyCourseCard> { Items = response, TotalCount = response.Count()};
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to get my courses by userid: {userId}", ex);
                throw;
            }
        }

        public async Task<MyTopic> GetTopicByUserCourseAndTopic(long userCourseId, long TopicId, long userId)
        {
            try
            {
                var response = await _userCourseRepository.GetTopicByUserCourseAndTopic(userCourseId, TopicId, userId);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to get course by user course Id: {userCourseId} and userid: {userId}", ex);
                throw;
            }
        }

        public async Task<StatusResponse> UpdateUserTopicAssetStatus(long usertopicAssetId, string status, long userId)
        {
            try
            {
                var ok = await _userCourseRepository.UpdateUserTopicAssetStatus(usertopicAssetId, status, userId);
                return new StatusResponse
                {
                    Status = ok,
                    Message = ok ? "Updated Successfully..!" : "Updation Failed..!"
                };
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to update user topic asset status", ex);
                throw;
            }
        }

        public async Task<StatusResponse> UpdateUserTopicStatus(long userTopicId, string status, long userId)
        {
            try
            {
                var ok = await _userCourseRepository.UpdateUserTopicStatus(userTopicId, status, userId);
                return new StatusResponse
                {
                    Status = ok,
                    Message = ok ? "Updated Successfully..!" : "Updation Failed..!"
                };
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to update user topic status by userTopicId: {userTopicId}", ex);
                throw;
            }
        }
    }
}
