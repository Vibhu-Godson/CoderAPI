using CoderAPI.DTOs;

namespace CoderAPI.Repository.Interface.Problem
{
    public interface IProblemDetailRepository
    {
        Task<List<Language>> GetLanguagesByProblemId(long ProblemId);
        Task<CustomString> GetHiddenCode(long ProblemId, string language);
        Task<CustomString> GetStarterCodeByProblemDetailId(long ProblemDetailId);
    }
}
