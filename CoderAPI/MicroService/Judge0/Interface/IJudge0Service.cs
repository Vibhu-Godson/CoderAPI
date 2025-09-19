using CoderAPI.DTOs.codeRunner;
using CoderAPI.Messages;

namespace CoderAPI.MicroService.Judge0.Interface
{
    public interface IJudge0Service
    {
        Task<Judge0Result> RunCode(RunCodeRequest request);
    }
}
