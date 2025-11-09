using CoderAPI.DBOs;
using CoderAPI.DTOs;
using CoderAPI.DTOs.User;
using CoderAPI.Helper.Interface;
using CoderAPI.MicroService.LLM.Interface;
using CoderAPI.Repository.Interface.User;
using CoderAPI.Service.Interface.UserDetails;
using System.Text.Json;

namespace CoderAPI.Service.Implementation.UserDetail
{
    public class UserDetailService : IUserDetailsService
    {
        private readonly IUserDetailsRepository _userDetailsRepository;
        private readonly IPromptSelector _promptSelector;
        private readonly IGeminiHelper _geminiHelper;
        private readonly IGeminiLLM _geminiLLM;
        private readonly ICustomLogger _logger;

        public UserDetailService(IUserDetailsRepository userDetailsRepository, IPromptSelector promptSelector, IGeminiHelper geminiHelper, IGeminiLLM geminiLLM, ICustomLogger logger)
        {
            _userDetailsRepository = userDetailsRepository;
            _promptSelector = promptSelector;
            _geminiHelper = geminiHelper;
            _geminiLLM = geminiLLM;
            _logger = logger;
        }

        public async Task<StatusResponse> AddUserCurrentRole(CustomString roleName, long userId)
        {
            try
            {
                var added = await _userDetailsRepository.AddUserCurrentRole(roleName.Value, userId);
                return added ? 
                    new StatusResponse { Status = true, Message = "Role name added successfully..!" } : 
                    new StatusResponse { Status = false, Message = "Couldn't add role name" };
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to add user current role for userId: {userId}", ex);
                throw;
            }
        }

        public async Task<StatusResponse> AddUserEducation(UserEducationDto education, long UserId)
        {
            try
            {
                var userEdu = JsonSerializer.Serialize(education);
                var added = await _userDetailsRepository.AddUserEducation(userEdu, UserId);
                return added ?
                    new StatusResponse { Status = true, Message = "User education added successfully..!" } :
                    new StatusResponse { Status = false, Message = "Couldn't add education..!" };
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to add user education for userId: {UserId}", ex);
                throw;
            }
        }

        public async Task<StatusResponse> AddUserExperience(UserExperienceDto experience, long UserId)
        {
            try
            {
                var userExp = JsonSerializer.Serialize(experience);
                var added = await _userDetailsRepository.AddUserExperience(userExp, UserId);
                return added ?
                    new StatusResponse { Status = true, Message = "User Experience added successfully..!" } :
                    new StatusResponse { Status = false, Message = "Couldn't add experience..!" };
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to add user experience for userId: {UserId}", ex);
                throw;
            }
        }

        public async Task<StatusResponse> AddUserMotivation(CustomString motivation, long UserId)
        {
            try
            {
                var added = await _userDetailsRepository.AddUserMotivation(motivation.Value, UserId);
                return added ?
                    new StatusResponse { Status = true, Message = "User project added successfully..!" } :
                    new StatusResponse { Status = false, Message = "Couldn't add project..!" };
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to add user motivation for userId: {UserId}", ex);
                throw;
            }
        }

        public async Task<StatusResponse> AddUserProject(UserProjectDto project, long UserId)
        {
            try
            {
                var userProject = JsonSerializer.Serialize(project);
                var added = await _userDetailsRepository.AddUserProject(userProject, UserId);
                return added ? 
                    new StatusResponse { Status = true, Message = "User project added successfully..!"} :
                    new StatusResponse { Status = false, Message = "Couldn't add project..!" };
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to add user project for userId: {UserId}", ex);
                throw;
            }
        }

        public async Task<StatusResponse> AddUserSkills(CustomString skills, long userId)
        {
            try
            {
                var added = await _userDetailsRepository.AddUserSkills(skills.Value, userId);
                return added ?
                    new StatusResponse { Status = true, Message = "User skills added successfully..!" } :
                    new StatusResponse { Status = false, Message = "Couldn't add skills..!" };
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to add user skills for userId: {userId}", ex);
                throw;
            }
        }

        public async Task<UserOnboardChatResponse> GetUserChatResponse(CustomString chat, long userId)
        {
            try
            {
                var prompt = _promptSelector.BuildOnboardingPrompt(chat.Value);
                var rawResponse = await _geminiLLM.GetGeminiResponse(prompt);
                var response = _geminiHelper.ExtractOnboardMessage(rawResponse);
                return response;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to get user chat resposne", ex);
                throw;
            }
        }
    }
}
