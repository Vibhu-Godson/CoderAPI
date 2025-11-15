using CoderAPI.DTOs.Settings;

namespace CoderAPI.Repository.Interface.Setting
{
    public interface ISettingsRepository
    {
        Task<bool> ResetUserSettings(long userId);
        Task<SettingResponseDto> GetAllSettings(long userId);
        Task<bool> UpdateSetting(UpdateSettingDto request, long userId);
    }
}
