using CoderAPI.DBOs;
using CoderAPI.DTOs.ProblemDiscussion;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface.Problem;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.Repository.Implementation.Problem
{
    public class ProblemDiscussionRepository : IProblemDiscussionRepository
    {
        private readonly CodeDbContext _context;
        private readonly ICustomLogger _logger;

        public ProblemDiscussionRepository(CodeDbContext context, ICustomLogger logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<long> AddProblemDiscussion(ProblemDiscussion problemDiscussion)
        {
            try
            {
                await _context.ProblemDiscussions.AddAsync(problemDiscussion);
                await _context.SaveChangesAsync();
                return problemDiscussion.ProblemDiscussionId;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to add problem discussion for ProblemId: {problemDiscussion.ProblemId}", ex);
                throw;
            }
        }

        public async Task<bool> AddProblemDiscussionBlocks(List<ProblemDiscussionBlock> problemDiscussionBlocks)
        {
            try
            {
                await _context.ProblemDiscussionBlocks.AddRangeAsync(problemDiscussionBlocks);
                await _context.SaveChangesAsync();
                return true;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to add problem discussion blocks", ex);
                throw;
            }
        }

        public async Task<bool> AddProblemDiscussionTags(List<ProblemDiscussionTag> problemDiscussionTags)
        {
            try
            {
                await _context.ProblemDiscussionTags.AddRangeAsync(problemDiscussionTags);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to add problem discussion tags", ex);
                throw;
            }
        }

        public async Task<bool> AddProblemDiscussionView(ProblemDiscussionView view)
        {
            try
            {
                await _context.ProblemDiscussionViews.AddAsync(view);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to add problem discussion view", ex);
                throw;
            }
        }

        public async Task<bool> AddReaction(long ProblemDiscussionId, long UserId, string ReactionType)
        {
            try
            {
                await _context.ProblemDiscussionReactions.AddAsync(new ProblemDiscussionReaction
                {
                    ProblemDiscussionId = ProblemDiscussionId,
                    UserId = UserId,
                    ReactionType = ReactionType,
                    CreatedBy = UserId,
                    CreatedOn = DateTime.UtcNow,
                    IsActive = true
                });
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to add reaction to problem discussion: {ProblemDiscussionId}", ex);
                throw;
            }
        }

        public async Task<ProblemDiscussionDto> GetProblemDiscussion(long ProblemDiscussionId)
        {
            try
            {
                var response = await _context.ProblemDiscussions
                    .Where(pd => pd.ProblemDiscussionId == ProblemDiscussionId)
                    .Select(pd => new ProblemDiscussionDto
                    {
                        ProblemDiscussionId = pd.ProblemDiscussionId,
                        ProblemId = pd.ProblemId,
                        DiscussionBlocks = _context.ProblemDiscussionBlocks
                            .Where(pdb => pdb.ProblemDiscussionId == ProblemDiscussionId)
                            .Select(pdb => new ProblemDiscussionBlockDto
                            {
                                ProblemDiscussionId = pdb.ProblemDiscussionId,
                                Content = pdb.BigTextContent ?? pdb.ShortTextContent ?? "",
                                ImageUrl = pdb.BigTextContent,
                                ProblemDiscussionBlockId = pdb.BlockId,
                                SortOrder = pdb.SortOrder,
                                BlockType = pdb.BlockType,
                            })
                            .ToList(),
                        DiscussionViewCount = _context.ProblemDiscussionViews.Count(pdv => pdv.ProblemDiscussionId == ProblemDiscussionId),
                        Reactions = new ProblemDiscussionReactionDto
                        {
                            ReactionCounts = _context.ProblemDiscussionReactions
                                .Where(pdr => pdr.ProblemDiscussionId == ProblemDiscussionId)
                                .GroupBy(pdr => pdr.ReactionType)
                                .ToDictionary(g => g.Key, g => g.Count())
                        },
                        UserName = pd.User.UserName,
                        UserImage = pd.User.ProfileImage,
                        Tags = pd.ProblemDiscussionTags
                            .Select(pdt => new ProblemDiscussionTagDto
                            {
                                TagName = pdt.TagName,
                                ProblemDiscussionTagId = pdt.ProblemDiscussionTagId
                            })
                            .ToList(),
                        Comments = _context.ProblemDiscussions
                            .Where(ppd => ppd.ParentDiscussionId == ProblemDiscussionId)
                            .Select(ppd => new ProblemDiscussionComments
                            {
                                CommentViewCount = ppd.ProblemDiscussionViews.Count(),
                                CreatedOn = ppd.CreatedOn,
                                DiscussionBlocks = ppd.ProblemDiscussionBlocks
                                    .Select(x => new ProblemDiscussionBlockDto
                                    {
                                        ProblemDiscussionBlockId = x.ProblemDiscussionId,
                                        ProblemDiscussionId = x.ProblemDiscussionId,
                                        BlockType = x.BlockType,
                                        Content = x.BigTextContent ?? x.ShortTextContent ?? "",
                                        ImageUrl = x.ImageUrl,
                                        SortOrder = x.SortOrder,
                                    })
                                    .ToList(),
                                IsEdited = ppd.IsEdited,
                                Reactions = new ProblemDiscussionReactionDto
                                {
                                    ReactionCounts = ppd.ProblemDiscussionReactions
                                        .GroupBy(ppd => ppd.ReactionType)
                                        .ToDictionary(g => g.Key, g => g.Count()),
                                },
                                UserImage = ppd.User.ProfileImage,
                                UserName = ppd.User.UserName,
                            })
                            .ToList(),
                        CreatedOn = pd.CreatedOn
                    })
                    .FirstOrDefaultAsync();
                return response;

            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get problem discussion: {ProblemDiscussionId}", ex);
                throw;
            }
        }

        public async Task<(List<ProblemDiscussionCardView>, int)> GetProblemDiscussionCards(long ProblemId, int pageNumber, int pageSize)
        {
            try
            {
                var response = await _context.ProblemDiscussions
                    .Where(pd => pd.ProblemId == ProblemId)
                    .Select(pd => new 
                    {
                        Header = pd.ProblemDiscussionBlocks
                            .Where(pdb => pdb.SortOrder == 1)
                            .Select(pdb => pdb.ShortTextContent)
                            .FirstOrDefault() ?? "",
                        CommentCount = _context.ProblemDiscussions.Count(ppd => ppd.ParentDiscussionId == pd.ProblemDiscussionId),
                        ProblemDiscussionId = pd.ProblemDiscussionId,
                        Tags = pd.ProblemDiscussionTags
                            .Select(t => new ProblemDiscussionTagDto
                            {
                                ProblemDiscussionTagId = t.ProblemDiscussionTagId,
                                TagName = t.TagName,
                            })
                            .ToList(),
                        UserName = pd.User.UserName,
                        UserImage = pd.User.ProfileImage,
                        ReactionsRaw = pd.ProblemDiscussionReactions
                            .Select(r => new { r.ReactionType })
                            .ToList(),
                        CreatedOn = pd.CreatedOn,
                        ViewCount = pd.ProblemDiscussionViews.Count()
                    })
                    .Skip((pageNumber-1)*pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var result = response.Select(x => new ProblemDiscussionCardView
                {
                    Header = x.Header,
                    CommentCount = x.CommentCount,
                    ProblemDiscussionId = x.ProblemDiscussionId,
                    Tags = x.Tags,
                    UserName = x.UserName,
                    UserImage = x.UserImage,
                    CreatedOn = x.CreatedOn,
                    ViewCount = x.ViewCount,
                    Reactions = new ProblemDiscussionReactionDto
                    {
                        ReactionCounts = x.ReactionsRaw
                            .GroupBy(r => r.ReactionType)
                            .ToDictionary(g => g.Key, g => g.Count())
                    }
                }).ToList();


                var total = await _context.ProblemDiscussions.CountAsync(pd => pd.ProblemId == ProblemId);
                return (result, total);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get Problem Discussion Cards for ProblemId: {ProblemId}\n{ex.Message}\n{ex.StackTrace}", ex);
                throw;
            }
        }

        public async Task<bool> UpdateProblemDiscussion(long ProblemDiscussionId, long userId)
        {
            try
            {
                var discussion = await _context.ProblemDiscussions.FindAsync(ProblemDiscussionId);
                discussion.IsEdited = true;
                discussion.UpdatedOn = DateTime.UtcNow;
                discussion.UpdatedBy = userId;
                var ok = await _context.SaveChangesAsync();
                return ok>0 ? true : false;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: Unable to Update Problem Discussion with ProblemDiscussionId: {ProblemDiscussionId}\n{ex.Message}", ex);
                throw;
            }
        }

        public async Task<bool> UpdateProblemDiscussionBlocks(long ProblemDiscussionId, List<ProblemDiscussionBlock> problemDiscussionBlocks)
        {
            try
            {
                await _context.ProblemDiscussionBlocks
                    .Where(pdb => pdb.ProblemDiscussionId == ProblemDiscussionId)
                    .ExecuteDeleteAsync();

                await _context.ProblemDiscussionBlocks
                    .AddRangeAsync(problemDiscussionBlocks);

                var ok = await _context.SaveChangesAsync();
                return ok > 0;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to Update Problem Discussion Block for ProblemDiscussionid: {ProblemDiscussionId}\n{ex.Message}", ex);
                throw;
            }
        }

        public async Task<bool> UpdateProblemDiscussionTags(long ProblemDiscussionId, List<ProblemDiscussionTag> problemDiscussionTags)
        {
            try
            {
                await _context.ProblemDiscussionTags
                    .Where(pt => pt.ProblemDiscussionId == ProblemDiscussionId)
                    .ExecuteDeleteAsync();
                await _context.ProblemDiscussionTags.AddRangeAsync(problemDiscussionTags);
                var ok = await _context.SaveChangesAsync();
                return ok > 0;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to update Problem Discussion Tag for ProblemDiscussionId: {ProblemDiscussionId}\n{ex.Message}", ex);
                throw;
            }
        }
    }
}
