# Onboarding Blank Screen Fix

## Problem Analysis

**Symptoms:**
- User completes onboarding (all steps filled)
- Button click sends them to `/home`
- `/onboarding` page shows blank screen
- API call `GET /api/UserOnboard/done` returns `{"status": false, "message": "User is not onboarded."}`

**Root Cause:**
The onboarding flow had **no error handling** on the API mutations. When a save failed (network error, timeout, validation error, etc.), the component would:
1. Not catch the error
2. Still advance to the next step
3. Reach `step="done"` and navigate to `/home`
4. RequireAuth component checks if user is onboarded
5. Sees incomplete/missing UserDetails record
6. Redirects back to `/onboarding` (causing blank screen)

The blank screen occurred because:
- User navigates to `/home` → RequireAuth checks `/api/UserOnboard/done`
- Returns false → redirects back to `/onboarding`
- But all the state was cleared during navigation
- User sees nothing for 1-2 seconds, then gets redirected back mid-render

## Solution Implemented

### 1. Added Error Handling to Mutations

**File:** `OnboardingPage.tsx`

Changed from:
```typescript
await saveRole({ value: res.role });
setState((s) => ({ ...s, role: res.role }));
```

To:
```typescript
try {
    await saveRole({ value: res.role }).unwrap();
    setState((s) => ({ ...s, role: res.role }));
    pushChat("bot", `You are a ${res.role.replaceAll("_", " ")}.`);
    setState((s) => ({ ...s, step: "education" }));
} catch (err) {
    pushChat("bot", "❌ Failed to save your role. Please try again.");
    console.error("Role save failed:", err);
}
```

**Applied to:**
- `applyLLMExtraction()` - All 5 extraction steps (role, education, experience, project, skills, motivation)
- `handleFormSubmit()` - All 6 form steps

**Key improvements:**
- `.unwrap()` makes the mutation throw on error instead of silently failing
- `try-catch` prevents advancement if save fails
- `pushChat()` gives user immediate feedback of what went wrong
- `console.error()` logs for debugging

### 2. Added Pre-Navigation Verification

**File:** `OnboardingPage.tsx`

Before: Navigated blindly after 1.5 seconds
```typescript
useEffect(() => {
    if (state.step === "done") {
        const t = setTimeout(() => navigate("/home"), 1500);
        return () => clearTimeout(t);
    }
}, [state.step, navigate]);
```

After: Verifies user is actually onboarded
```typescript
const [checkOnboarded] = useLazyUserOnboardDoneQuery();

useEffect(() => {
    if (state.step === "done") {
        const t = setTimeout(async () => {
            try {
                const result = await checkOnboarded().unwrap();
                if (result.status) {
                    navigate("/home");
                } else {
                    pushChat("bot", "⚠️ Verification failed. Your profile wasn't saved properly. Please refresh and try again.");
                }
            } catch (err) {
                pushChat("bot", "⚠️ Connection error. Please check your internet and try again.");
                console.error("Onboarding verification failed:", err);
            }
        }, 1500);
        return () => clearTimeout(t);
    }
}, [state.step, navigate, checkOnboarded]);
```

**Benefits:**
- Calls `/api/UserOnboard/done` before navigation
- If status is false → shows error message instead of blank screen
- If API fails → shows connection error
- Only navigates if verification succeeds

## User Experience Improvements

### Before
```
User fills form → [error happens silently] → Navigation to /home → 
RequireAuth sees incomplete profile → Redirects to /onboarding → 
[BLANK SCREEN for 2 seconds] → Redirects again → User confused
```

### After
```
User fills form → [error happens] → 
Bot says: "❌ Failed to save education. Please try again." → 
User sees exact step that failed → User can retry or refresh → 
If all steps succeed → Bot says: "All set! Your onboarding is complete 🎉" →
Verification runs → Navigate to /home or show error message
```

## Error Messages Added

1. **Role save fails:** `"❌ Failed to save your role. Please try again."`
2. **Education save fails:** `"❌ Failed to save education. Please try again."`
3. **Experience save fails:** `"❌ Failed to save experience. Please try again."`
4. **Project save fails:** `"❌ Failed to save project. Please try again."`
5. **Skills save fails:** `"❌ Failed to save skills. Please try again."`
6. **Motivation save fails:** `"❌ Failed to save motivation. Please try again."`
7. **Verification fails:** `"⚠️ Verification failed. Your profile wasn't saved properly. Please refresh and try again."`
8. **Network error during verification:** `"⚠️ Connection error. Please check your internet and try again."`

All errors are shown in the chat panel, so users see them in context of their onboarding journey.

## Code Changes Summary

| File | Changes | Impact |
|------|---------|--------|
| `OnboardingPage.tsx` | Added imports: `useLazyUserOnboardDoneQuery` | Enables verification before navigation |
| `OnboardingPage.tsx` | Wrapped `applyLLMExtraction` steps in try-catch | Prevents silent failures on chat extraction |
| `OnboardingPage.tsx` | Wrapped `handleFormSubmit` steps in try-catch | Prevents silent failures on form submission |
| `OnboardingPage.tsx` | Updated `useEffect` for step="done" | Verifies onboarding before navigating to /home |

## Testing Checklist

- [ ] Register new user
- [ ] Start onboarding with chat flow (role → all steps via chat)
- [ ] Verify each step saves and advances
- [ ] When complete, verify redirect to /home succeeds
- [ ] Manually pause network in DevTools before clicking submit
- [ ] Verify error message appears in chat
- [ ] Verify component stays on current step (doesn't advance)
- [ ] Resume network and retry
- [ ] Test with form flow (manual form submissions instead of chat)
- [ ] Test mixed flow (some steps via chat, some via form)
- [ ] Check browser console for error logs

## Future Improvements

1. **Retry logic:** Add "Retry" button in chat when save fails
2. **Session persistence:** Save onboarding state to localStorage so user can resume after refresh
3. **Optimistic updates:** Show user's input immediately, only disable if API fails
4. **Progress indicator:** Show "Step 2 of 6" so user knows how far they are
5. **Auto-save:** Save form changes without waiting for explicit "Next" click
6. **Timeout handling:** Set explicit timeout on API calls (currently uses default)
7. **Network detection:** Show offline banner if user loses connection during onboarding

## Files Modified

1. `CoderAPI/UI/coder-frontend/src/UserOnboard/pages/OnboardingPage.tsx`
   - Added import: `useLazyUserOnboardDoneQuery` from `../../auth/authApi`
   - Added error handling to `applyLLMExtraction` function (6 steps)
   - Added error handling to `handleFormSubmit` function (6 steps)
   - Enhanced `useEffect` for step="done" to verify before navigation

## Testing Status

✅ TypeScript: No errors
⏳ Integration: Awaiting manual testing
⏳ E2E: Awaiting Cypress/Playwright tests
