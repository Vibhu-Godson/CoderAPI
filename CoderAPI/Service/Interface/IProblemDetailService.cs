using CoderAPI.DTOs;

namespace CoderAPI.Service.Interface
{
    public interface IProblemDetailService
    {
        Task<ListDto<Language>> GetLanguagesByProblemId(long ProblemId);
        Task<CustomString> GetCommonCodeByProblemDetail(long ProblemDetailId);
    }
}
