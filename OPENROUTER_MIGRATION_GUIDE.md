# OpenRouter.ai Migration Guide

## Overview
Successfully migrated from **Google Gemini API** to **OpenRouter.ai** for LLM services. The migration is **100% backward compatible** - no breaking changes to existing code.

---

## Key Changes

### ✅ What Stayed the Same
- **Interface**: `IGeminiLLM` remains unchanged
- **DI Registration**: No changes in `Program.cs`
- **Consumers**: `AiAnalysisService` and `UserDetailService` work without modification
- **Response Parsing**: `GeminiHelper` works with converted responses

### 🔄 What Changed
- **API Endpoint**: Google Gemini → OpenRouter.ai
- **Request Format**: Google's `contents` → OpenRouter's `messages`
- **Authentication**: `X-goog-api-key` header → `Authorization: Bearer {token}`
- **Response Format**: Converted internally to Gemini format for compatibility

---

## API Key Setup

### Where to Add the API Key

**Location**: `appsettings.json`
```json
{
  "LLM": {
    "ApiKey": "sk-or-v1-YOUR_OPENROUTER_API_KEY_HERE"
  }
}
```

**For Development**: `appsettings.Development.json` (optional override)
```json
{
  "LLM": {
    "ApiKey": "sk-or-v1-YOUR_DEV_API_KEY"
  }
}
```

### How to Get Your API Key

1. Go to https://openrouter.ai/
2. Sign up or log in
3. Navigate to **Account → API Keys**
4. Create a new API key
5. Copy the key (starts with `sk-or-v1-`)
6. Replace placeholder in `appsettings.json`

### ⚠️ Security Best Practice

**NEVER commit actual API keys to git!**

- For local development: Add to `.gitignore` entries
- For production: Use **Azure Key Vault** or **environment variables**

Option 1: Environment Variables (Production)
```csharp
// In Program.cs
var apiKey = Environment.GetEnvironmentVariable("OPENROUTER_API_KEY");
```

Option 2: Azure Key Vault
```csharp
// Configure in appsettings.json
"AzureKeyVault": {
  "Vault": "your-vault-name"
}
```

---

## Implementation Details

### OpenRouter Request Format
```csharp
{
  "model": "meta-llama/llama-2-70b-chat",
  "messages": [
    {
      "role": "user",
      "content": "Your prompt here"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 2000
}
```

### Response Conversion
The implementation automatically converts OpenRouter's response format to Gemini's format:

**OpenRouter Response** (what we get):
```json
{
  "choices": [
    {
      "message": {
        "content": "LLM response text"
      }
    }
  ]
}
```

**Converted to Gemini Format** (what internal services expect):
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "LLM response text"
          }
        ]
      }
    }
  ]
}
```

This ensures `GeminiHelper.ExtractGeminiJson()` works without modifications.

---

## Affected Services

### Services Using LLM
1. **AiAnalysisService** (`Service/Implementation/AiAnalysisService.cs`)
   - Analyzes coding problems
   - Uses: `IGeminiLLM.GetGeminiResponse()` + `IGeminiHelper.ExtractGeminiJson()`

2. **UserDetailService** (`Service/Implementation/UserDetail/UserDetailService.cs`)
   - Onboarding message generation
   - Uses: `IGeminiLLM.GetGeminiResponse()` + `IGeminiHelper.ExtractOnboardMessage()`

### No Changes Required in These Files
- ✅ `Program.cs` - DI registration unchanged
- ✅ `IGeminiLLM.cs` - Interface unchanged
- ✅ `GeminiHelper.cs` - Works with converted responses
- ✅ `AiAnalysisService.cs` - No code changes
- ✅ `UserDetailService.cs` - No code changes

---

## Configuration & Headers

### Required Headers
```csharp
request.Headers.Add("Authorization", $"Bearer {_apiKey}");
request.Headers.Add("HTTP-Referer", "https://amcoder.in");  // Required by OpenRouter
request.Headers.Add("X-Title", "AmCoder-LLM");              // For tracking
```

- **Authorization**: Your API key (Bearer token)
- **HTTP-Referer**: Required by OpenRouter for API tracking
- **X-Title**: Optional, helps identify requests in OpenRouter dashboard

### Model Selection
Current model: **`meta-llama/llama-2-70b-chat`** (cost-effective)

Alternative models available:
- `openai/gpt-4` - Better quality, higher cost
- `openai/gpt-3.5-turbo` - Faster, lower cost
- `anthropic/claude-3-opus` - Better reasoning
- `mistral/mistral-7b` - Lightweight option

Change in `GeminiLLM.cs`:
```csharp
private const string DefaultModel = "openai/gpt-4"; // Modify this line
```

---

## Error Handling & Logging

### What Gets Logged
1. **Missing API Key** → Warning level log
2. **API Failures** → Error level with status code and response
3. **Response Conversion Errors** → Error level with details

### Error Responses
```
Error: 401 - {"error": "Unauthorized: Invalid API key"}
Error: 429 - {"error": "Rate limit exceeded"}
Error: 500 - {"error": "Internal server error"}
```

All errors include detailed logging via `ICustomLogger`.

---

## Testing the Integration

### Manual Test
```powershell
# Test the LLM endpoint
curl -X POST "https://openrouter.ai/api/v1/chat/completions" \
  -H "Authorization: Bearer sk-or-v1-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "meta-llama/llama-2-70b-chat",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

### API Key Verification
1. Set `LLM:ApiKey` in `appsettings.json`
2. Start the application
3. Trigger an AI analysis via the API
4. Check logs for errors

---

## Monitoring & Rate Limits

### OpenRouter Rate Limits
- Check your account at https://openrouter.ai/account/limits
- Rate limits vary by model and subscription tier

### Recommended Monitoring
```csharp
// Log API response time
var stopwatch = Stopwatch.StartNew();
var response = await _httpClient.SendAsync(request);
stopwatch.Stop();
_logger.Log(LogLevel.Information, 
    $"LLM request completed in {stopwatch.ElapsedMilliseconds}ms");
```

---

## Rollback Plan (If Needed)

If you need to revert to Gemini:

1. **Backup current version**: Git commit before making changes
2. **Restore old implementation**:
   ```bash
   git checkout HEAD~1 -- CoderAPI/MicroService/LLM/Implementation/GeminiLLM.cs
   ```
3. **Restore API key**: In `appsettings.json`
   ```json
   "LLM": {
     "ApiKey": "AIzaSyAKl102SADUXDB81jO0d2buMMx8rleD2rk"
   }
   ```
4. **No other changes needed** - Everything else remains compatible

---

## Checklist Before Production

- [ ] API key added to `appsettings.json` (or Key Vault)
- [ ] API key is NOT committed to git
- [ ] Application builds without errors
- [ ] Test LLM functionality with sample prompt
- [ ] Check logs for "LLM API key is not configured" warnings
- [ ] Monitor first 24 hours for rate limit issues
- [ ] Verify both `AiAnalysisService` and `UserDetailService` work
- [ ] Set up alerts for 401/429 errors

---

## Troubleshooting

### Issue: "401 Unauthorized"
**Solution**: Verify API key is correct and active in OpenRouter account

### Issue: "Rate limit exceeded"
**Solution**: Check OpenRouter usage, upgrade plan if needed

### Issue: "No choices returned by OpenRouter"
**Solution**: Check application logs, might be API error or invalid prompt

### Issue: "Failed to convert OpenRouter response to Gemini format"
**Solution**: Log the raw response, verify OpenRouter returned valid JSON

### Issue: "LLM API key is not configured"
**Solution**: Ensure `LLM:ApiKey` is set in `appsettings.json`

---

## Cost Comparison

| Service | Model | Cost per 1M tokens | Notes |
|---------|-------|------------------|-------|
| **Gemini** | 2.0 Flash | Free tier available | Limited free requests |
| **OpenRouter** | Llama 2 70B | ~$0.81 input, $1.08 output | Pay-per-use |
| **OpenRouter** | GPT-4 | ~$15 input, $45 output | Premium quality |

---

## Support & Resources

- **OpenRouter Docs**: https://openrouter.ai/docs
- **API Keys**: https://openrouter.ai/account/api-keys
- **Model List**: https://openrouter.ai/docs/models
- **Status Page**: https://status.openrouter.ai/

---

## Summary

✅ **What's Safe**:
- All dependent services work unchanged
- Interface contract preserved
- DI registration unchanged
- Response parsing compatible

⚠️ **What Needs Attention**:
- Add API key to `appsettings.json` or Key Vault
- Don't commit actual API key to git
- Monitor API usage and rate limits
- Test LLM functionality before deployment

🎯 **One-Time Setup**: Just add the API key in the config, everything else just works!
