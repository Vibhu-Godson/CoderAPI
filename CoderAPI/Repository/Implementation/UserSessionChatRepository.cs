using CoderAPI.DBOs;
using CoderAPI.DTOs.Session;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.Repository.Implementation
{
    public class UserSessionChatRepository : IUserSessionChatRepository
    {
        private readonly CodeDbContext _context;
        private readonly ICustomLogger _logger;

        public UserSessionChatRepository(CodeDbContext context, ICustomLogger logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<long> AddUserSessionChat(UserSessionChat userSessionChat)
        {
            try
            {
                await _context.UserSessionChats.AddAsync(userSessionChat);
                await _context.SaveChangesAsync();
                return userSessionChat.UserSessionChatId;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to add user session chat for userProblemSessionId: {userSessionChat.UserProblemSessionId}", ex);
                throw;
            }
        }

        public async Task<List<UserSessionChatDto>> GetSessionChat(long UserProblemSessionId)
        {
            try
            {
                var response = await _context.UserSessionChats
                    .Where(ch => ch.UserProblemSessionId == UserProblemSessionId)
                    .Select(ch => new UserSessionChatDto
                    {
                        ChatMessage = ch.ChatMessage,
                        AiReply = ch.AiReply,
                    })
                    .ToListAsync();
                return response;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get session chat by userProblemSessionId: {UserProblemSessionId}.", ex);
                throw;
            }
        }
    }
}
