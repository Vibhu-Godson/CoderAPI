# Onboarding Testing Strategy: The "Living System" Verification Framework

## Overview

Testing a "living system" isn't just about feature coverage. It's about verifying that every layer works in harmony—that the nervous system (state) coordinates with the skeleton (forms), that sensory input is processed faithfully, and that the system recovers gracefully from chaos.

This framework ensures your onboarding doesn't just work—it **feels alive and trustworthy**.

---

## 1. Sensory Input Layer (Chat + Form)

This is where reality enters the system. Reality is messy.

### Edge Cases to Cover

**Ambiguous natural language**
- "I studied CS" (degree? diploma? bootcamp?)
- "I work at Google" (intern? contractor? full-time?)
- "Graduated last year" (relative time, timezone-sensitive)

**Overloaded messages**
- One chat message containing education + experience + skills
- Copy-pasted résumé text (multi-paragraph, bullets)
- Mixed formatting (emojis, line breaks, inconsistent capitalization)

**Contradictory inputs**
- Chat says "5 years experience"
- Form says "2–5 years"
- Later chat says "I started in 2022"
- Profile shows graduation in 2024 (math doesn't work)

**Partial intent**
- "I studied at IIT" (missing campus, degree, year)
- "I'm a backend dev" (no tech stack)
- "I know Java" (skill level unknown)

**Non-cooperative input**
- Emojis only: "🎓📱💻"
- Dismissive: "skip", "idk", "whatever"
- Sarcasm: "Yeah, I'm a billionaire 💰"
- Jokes: "I code in English"

### Frontend Tests

```typescript
// Test 1: Long text handling
test('Chat accepts 5000+ character input without UI freeze', () => {
  const longText = 'a'.repeat(5000);
  const { container } = render(<ChatPanel />);
  const input = container.querySelector('textarea');
  
  fireEvent.change(input, { target: { value: longText } });
  
  expect(input.value.length).toBe(5000);
  expect(container).not.toHaveClass('opacity-50'); // No freeze indicator
});

// Test 2: Form doesn't auto-fill on low confidence
test('Form field remains empty when extraction confidence < threshold', () => {
  const lowConfidenceResponse = {
    education: { value: 'IIT', confidence: 0.3 }, // Below 0.7 threshold
  };
  
  const { queryByDisplayValue } = render(<EducationForm />);
  fireEvent.click(screen.getByText('Extract from chat'));
  
  // Simulate API response
  expect(queryByDisplayValue('IIT')).not.toBeInTheDocument();
  expect(screen.getByText('Unclear response—please clarify')).toBeInTheDocument();
});

// Test 3: Conflicting values are flagged
test('Conflicting extraction values show warning, not silent override', () => {
  const state = {
    formData: { yearsOfExperience: '7-10' },
    chatExtracted: { yearsOfExperience: '2-5' },
  };
  
  const { container } = render(<ExperienceField {...state} />);
  
  expect(container.querySelector('[data-testid="conflict-warning"]')).toBeVisible();
  expect(screen.getByText(/mismatch detected/i)).toBeInTheDocument();
});

// Test 4: User can ignore suggestions and continue manually
test('User can override auto-filled values and submit', () => {
  const { getByRole } = render(<EducationForm initialValue="Bachelor's" />);
  
  const dropdown = getByRole('combobox');
  fireEvent.change(dropdown, { target: { value: 'Master\'s' } });
  
  fireEvent.click(screen.getByText('Next'));
  
  expect(mockOnSubmit).toHaveBeenCalledWith({
    degree: 'Master\'s', // User override, not extraction
  });
});
```

### Backend Tests

```csharp
// Test 1: LLM extraction returns confidence scores
[Test]
public async Task ExtractFromChat_ReturnsConfidenceScores()
{
  var input = "I studied Computer Science at IIT";
  var result = await _llmService.ExtractEducation(input);
  
  Assert.That(result.Degree.Confidence, Is.GreaterThan(0.7));
  Assert.That(result.Institution.Confidence, Is.LessThan(0.5)); // Ambiguous campus
  Assert.That(result.Year, Is.Null); // Missing year
}

// Test 2: Ambiguous fields remain null, not guessed
[Test]
public async Task ExtractFromChat_AmbiguousCampusReturnsNull()
{
  var input = "I studied at IIT"; // Which campus?
  var result = await _llmService.ExtractEducation(input);
  
  Assert.That(result.Campus, Is.Null);
  Assert.That(result.Campus_Raw, Is.EqualTo("IIT")); // Raw stored separately
}

// Test 3: No state transition on partial extraction
[Test]
public async Task OnboardingService_DoesNotAdvanceOnPartialData()
{
  var onboarding = new OnboardingSession();
  await _service.ProcessChatMessage("I'm a developer", onboarding);
  
  Assert.That(onboarding.CurrentStep, Is.EqualTo(OnboardingStep.Role)); // Still on role
  Assert.That(onboarding.ConfirmedRole, Is.Null); // Not confirmed
}

// Test 4: Idempotency—same message processed twice = same result
[Test]
public async Task ExtractFromChat_IsIdempotent()
{
  var input = "I worked at Microsoft for 3 years";
  
  var result1 = await _llmService.ExtractFromChat(input);
  var result2 = await _llmService.ExtractFromChat(input);
  
  Assert.That(result1.Company, Is.EqualTo(result2.Company));
  Assert.That(result1.YearsOfExperience, Is.EqualTo(result2.YearsOfExperience));
}
```

### Why This Matters

**If you get this wrong, users feel misunderstood.** That's emotional damage, not just bad data. When a form auto-fills something wrong and silently uses it, users learn the system is against them, not helping them. Ambiguity should trigger clarification, not guesses.

---

## 2. Cognition Layer (State Machine)

This is the nervous system. Most bugs hide here.

### Edge Cases to Cover

**Out-of-order actions**
- User fills Step 3 form before Step 2 is confirmed
- User goes back, edits Step 1 after reaching Step 4
- User jumps directly to Step 5 via URL manipulation

**Concurrent updates**
- Chat extraction running while user edits form
- Two browser tabs with same onboarding session
- Mobile app backgrounded mid-update, resumed later

**Invalid transitions**
- Jumping to "experience" without role confirmation
- Completing onboarding with required fields missing
- Going backward from final step (should be allowed)

**Session resurrection**
- User refreshes mid-step
- User resumes after 3 days
- User switches from phone to desktop

### Frontend Tests

```typescript
// Test 1: UI reflects backend state, not local optimism
test('Form shows backend state after refresh', async () => {
  const { rerender } = render(<OnboardingPage />);
  
  // Step 1: User confirms role
  fireEvent.click(screen.getByRole('button', { name: /student/i }));
  fireEvent.click(screen.getByRole('button', { name: /next/i }));
  
  // Simulate page refresh
  const newState = await fetchOnboardingState();
  expect(newState.currentStep).toBe(2);
  
  rerender(<OnboardingPage />);
  expect(screen.getByText('Step 2: Education')).toBeInTheDocument();
});

// Test 2: Back button restores previous confirmed state
test('Back button does not apply draft changes', () => {
  // User is on Step 2
  // User starts typing in chat but doesn't send
  // User clicks Back
  
  const draftText = 'I studied at...';
  const chatInput = screen.getByPlaceholderText('Your message');
  fireEvent.change(chatInput, { target: { value: draftText } });
  
  fireEvent.click(screen.getByRole('button', { name: /back/i }));
  
  // Should return to Step 1, not apply draft
  expect(screen.getByText('Step 1: Your Role')).toBeInTheDocument();
  expect(screen.queryByDisplayValue(draftText)).not.toBeInTheDocument();
});

// Test 3: Step indicator never lies
test('Progress bar matches actual backend state', () => {
  const { getByTestId } = render(<OnboardingPage />);
  
  const progressElement = getByTestId('progress-indicator');
  // If backend says step 3/6, UI must show 50% (not 40% from optimistic update)
  
  expect(progressElement).toHaveAttribute('aria-valuenow', '3');
  expect(progressElement).toHaveAttribute('aria-valuemax', '6');
});

// Test 4: Disabled "Next" when state is invalid
test('Next button disabled until required field is confirmed', () => {
  const { getByRole } = render(<EducationForm />);
  const nextButton = getByRole('button', { name: /next/i });
  
  expect(nextButton).toBeDisabled();
  
  // User selects degree
  fireEvent.click(screen.getByRole('combobox'));
  fireEvent.click(screen.getByText("Bachelor's"));
  
  expect(nextButton).toBeEnabled();
});
```

### Backend Tests

```csharp
// Test 1: State transitions are explicit and enumerable
[Test]
public void OnboardingStateMachine_AllowedTransitionsAreExplicit()
{
  var validTransitions = new Dictionary<OnboardingStep, OnboardingStep[]>
  {
    { OnboardingStep.Role, new[] { OnboardingStep.Education } },
    { OnboardingStep.Education, new[] { OnboardingStep.Experience, OnboardingStep.Role } },
    { OnboardingStep.Experience, new[] { OnboardingStep.Skills, OnboardingStep.Education } },
    // ... all transitions documented
  };
  
  foreach (var (from, tos) in validTransitions)
  {
    Assert.That(tos.Length, Is.GreaterThan(0), $"No transitions defined from {from}");
  }
}

// Test 2: Illegal transitions are rejected with reason codes
[Test]
public async Task OnboardingService_RejectsInvalidTransition_WithReasonCode()
{
  var session = new OnboardingSession { CurrentStep = OnboardingStep.Role };
  
  var result = await _service.MoveToStep(session, OnboardingStep.Experience);
  
  Assert.That(result.IsSuccess, Is.False);
  Assert.That(result.ReasonCode, Is.EqualTo("PREREQUISITE_NOT_MET"));
  Assert.That(result.Message, Contains.Substring("Education"));
}

// Test 3: Versioned state snapshots for rollback/debug
[Test]
public async Task OnboardingService_MaintainsVersionHistory()
{
  var session = new OnboardingSession();
  
  await _service.UpdateRole(session, "Student");
  var version1 = session.Version; // Version 1
  
  await _service.UpdateEducation(session, "Bachelor's");
  var version2 = session.Version; // Version 2
  
  var snapshot1 = await _service.GetSnapshot(session.Id, version1);
  Assert.That(snapshot1.Role, Is.EqualTo("Student"));
  Assert.That(snapshot1.Education, Is.Null);
}

// Test 4: Optimistic locking prevents concurrent overwrites
[Test]
public async Task OnboardingService_OptimisticLock_PreventsConflict()
{
  var session = new OnboardingSession { Version = 1 };
  
  // Tab 1 updates
  session.Education = "Bachelor's";
  session.Version = 2;
  
  // Tab 2 tries to update with stale version
  var result = await _service.UpdateExperience(session, "3-5 years", expectedVersion: 1);
  
  Assert.That(result.IsSuccess, Is.False);
  Assert.That(result.ConflictingVersion, Is.EqualTo(2));
}
```

### Why This Matters

**Without this, your "living system" develops multiple personalities.** Users see Step 2 on screen but backend thinks they're on Step 1. Back button loses progress. Multiple tabs create chaos. State machines that aren't explicit breed bugs that only manifest under load or in specific user flows.

---

## 3. Extraction & Normalization (LLM + Rules)

This is where AI causes the most subtle damage.

### Edge Cases to Cover

**Hallucination pressure**
- User says: "I studied at a small local college"
- LLM "helpfully" maps it to a famous university (IIT, MIT, etc.)
- System confidently uses the hallucination

**Cultural variance**
- Degrees outside US/India formats (e.g., German Diplom, UK First-Class Hons)
- Job titles that don't map cleanly (e.g., "Grad Trainee" vs "Junior Developer")
- Non-Gregorian academic calendars

**Entity overlap**
- "Java" as skill vs "Java University"
- "React" as library vs action word
- "Lead" as job title vs past tense

**Confidence drift**
- First extraction: low confidence
- Later message clarifies it
- System must update, not lock early guess

### Frontend Tests

```typescript
// Test 1: Show why a field was filled
test('Auto-filled fields show extraction source', () => {
  const extractedData = {
    degree: {
      value: "Bachelor's",
      source: 'chat_message_2',
      confidence: 0.85,
    },
  };
  
  const { getByText } = render(<EducationForm {...extractedData} />);
  
  const badge = getByText(/extracted from your message/i);
  expect(badge).toBeVisible();
  
  // Click to see exact message
  fireEvent.click(badge);
  expect(screen.getByText('I have a Bachelor\'s degree')).toBeVisible();
});

// Test 2: Editable auto-filled fields are clearly marked
test('Auto-filled form field shows edit affordance', () => {
  const { container } = render(
    <DegreeField value="Bachelor's" isAutoFilled={true} />
  );
  
  const field = container.querySelector('[data-autofilled]');
  expect(field).toHaveAttribute('data-autofilled', 'true');
  expect(field).toHaveStyle('border: 2px dashed var(--color-amber)');
});

// Test 3: Confidence UI prevents blind trust
test('Low confidence extraction shows warning', () => {
  const extraction = {
    institution: {
      value: 'IIT',
      confidence: 0.4,
    },
  };
  
  const { getByText } = render(<InstitutionField {...extraction} />);
  
  expect(getByText(/we\'re not sure/i)).toBeVisible();
  expect(getByText(/please confirm/i)).toBeVisible();
});

// Test 4: Confidence updates when message clarifies
test('Later clarification updates confidence and triggers UI update', async () => {
  const { rerender } = render(
    <EducationField initial={{ institution: { value: 'IIT', confidence: 0.4 } }} />
  );
  
  // User sends clarifying message
  const clarification = await _llmService.Extract("I studied at IIT Bombay");
  
  rerender(
    <EducationField updated={{ institution: { value: 'IIT Bombay', confidence: 0.95 } }} />
  );
  
  expect(screen.getByDisplayValue('IIT Bombay')).toBeInTheDocument();
  expect(screen.queryByText(/we\'re not sure/i)).not.toBeInTheDocument();
});
```

### Backend Tests

```csharp
// Test 1: Confidence thresholds are configurable
[Test]
public void NormalizationService_AppliesConfiguredThresholds()
{
  var config = new ExtractionConfig { ConfidenceThreshold = 0.8 };
  var service = new NormalizationService(config);
  
  var lowConfidence = new ExtractionResult { Value = "MIT", Confidence = 0.6 };
  var result = service.Normalize(lowConfidence);
  
  Assert.That(result.IsApplied, Is.False);
  Assert.That(result.RequiresUserConfirmation, Is.True);
}

// Test 2: Normalization rules override LLM when deterministic
[Test]
public void NormalizationService_DeterministicRulesOverrideLLM()
{
  var llmResult = new ExtractionResult
  {
    Institution = "I.I.T", // Malformed
    Confidence = 0.9, // High confidence but wrong format
  };
  
  var normalized = _service.Normalize(llmResult);
  
  Assert.That(normalized.Institution, Is.EqualTo("IIT")); // Rule-based fix
  Assert.That(normalized.NormalizationReason, Contains.Substring("formatted"));
}

// Test 3: Raw extraction stored separately from normalized data
[Test]
public async Task OnboardingService_StoresRawAndNormalizedSeparately()
{
  var message = "I work at Google in Mountain View";
  var extraction = await _llmService.Extract(message);
  
  var session = new OnboardingSession();
  await _service.ProcessChatMessage(message, session);
  
  var record = await _repository.GetExtractionRecord(session.Id, message);
  Assert.That(record.RawExtraction, Contains.Substring("Google"));
  Assert.That(record.NormalizedExtraction.Company, Is.EqualTo("GOOGLE")); // Normalized
}

// Test 4: Reprocessing old messages with improved models doesn't corrupt state
[Test]
public async Task ExtractionService_ReprocessingDoesNotOverwriteUserConfirmedValues()
{
  var message = "I studied at a small college";
  var oldExtraction = new { Institution = null, Confidence = 0.3 };
  
  // User manually confirmed: "Cornell University"
  var session = new OnboardingSession { ConfirmedEducation = "Cornell University" };
  
  // Later: improved model available
  var improvedExtraction = new { Institution = "Cornell University", Confidence = 0.95 };
  
  await _service.ReprocessMessage(session, message, improvedExtraction);
  
  // User's confirmed value should not change
  Assert.That(session.ConfirmedEducation, Is.EqualTo("Cornell University"));
  Assert.That(session.ExtractionHistory).Contains("improved_extraction_ignored_user_confirmed");
}
```

### Why This Matters

**AI errors that look confident are worse than errors that look broken.** A high-confidence hallucination that sneaks into the database is worse than an obvious error. Normalizing data is fine—but you must show users what you changed and let them override. And when models improve, you can't silently reprocess; user confirmations are sacred.

---

## 4. Structural Response Layer (Forms)

Forms are where intent becomes contract.

### Edge Cases to Cover

**Auto-fill mismatch**
- LLM fills degree = "Bachelor's"
- User selects "Master's"
- System must respect override **permanently** (don't re-suggest Bachelor's later)

**Validation deadlocks**
- Required field inferred but invalid
- User can't proceed, but doesn't know why

**Progressive disclosure**
- Fields appear/disappear based on role
- Previously entered data becomes hidden
- What happens to hidden data when user submits?

**Localization**
- Date formats (DD/MM/YYYY vs MM/DD/YYYY)
- Numeric ranges (experience years: "3-5" vs "3 to 5")

### Frontend Tests

```typescript
// Test 1: User edits always win over AI
test('User override persists across chat updates', () => {
  const { getByRole } = render(<EducationForm />);
  
  // LLM extracted: "Bachelor's"
  fireEvent.click(screen.getByText("Master's")); // User overrides
  
  // Later, new chat message arrives
  // If LLM tries to re-extract "Bachelor's", form should keep "Master's"
  
  expect(getByRole('combobox')).toHaveValue("Master's");
});

// Test 2: Hidden fields retain values but are not submitted if invalid
test('Hidden fields preserve data but do not appear in submission', () => {
  const { queryByLabelText } = render(
    <DynamicForm role="student" />
  );
  
  // Company field should be hidden for students
  expect(queryByLabelText(/company/i)).not.toBeInTheDocument();
  
  // But if student switches to "working professional"
  fireEvent.click(screen.getByRole('radio', { name: /working/i }));
  
  // Company field should appear and retain any previous value
  expect(queryByLabelText(/company/i)).toBeInTheDocument();
});

// Test 3: Validation errors explain consequences, not rules
test('Validation error message is user-focused', () => {
  const { getByText } = render(<YearsOfExperienceField />);
  
  fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '50' } });
  fireEvent.click(screen.getByText('Next'));
  
  // Bad: "Value must be between 0 and 40"
  // Good: "We need to understand your experience level. 50 years is beyond reasonable."
  expect(getByText(/beyond reasonable/i)).toBeInTheDocument();
});

// Test 4: Keyboard-only navigation across dynamic fields
test('Tab order remains correct when fields appear/disappear', () => {
  const { container } = render(<DynamicForm />);
  
  const inputs = container.querySelectorAll('input, select, textarea');
  const tabOrder = Array.from(inputs).map((el) => el.tabIndex);
  
  // No gaps in tab order (no -1s except intentionally hidden)
  const visibleTabOrder = tabOrder.filter((idx) => idx >= 0);
  for (let i = 0; i < visibleTabOrder.length - 1; i++) {
    expect(visibleTabOrder[i + 1]).toBe(visibleTabOrder[i] + 1);
  }
});
```

### Backend Tests

```csharp
// Test 1: Server-side validation mirrors frontend logic
[Test]
public void OnboardingValidator_RejectsInvalidYearsOfExperience()
{
  var data = new OnboardingData
  {
    Role = "Working Professional",
    YearsOfExperience = 50,
  };
  
  var errors = _validator.Validate(data);
  
  Assert.That(errors, Contains.Item("YearsOfExperience"));
  Assert.That(errors["YearsOfExperience"], Contains.Substring("reasonable"));
}

// Test 2: Partial submissions allowed and saved
[Test]
public async Task OnboardingService_AllowsPartialSave()
{
  var data = new OnboardingData
  {
    Role = "Student",
    Education = "Bachelor's",
    // Experience: missing (not applicable for student)
  };
  
  var result = await _service.SaveOnboarding(data, isFinal: false);
  
  Assert.That(result.IsSuccess, Is.True);
  Assert.That(result.Session.CompletionPercentage, Is.EqualTo(50)); // 2 of 4 steps
}

// Test 3: Validation errors mapped to field-level feedback
[Test]
public void OnboardingValidator_ReturnsFieldLevelErrors()
{
  var errors = _validator.Validate(invalidData);
  
  var errorResponse = errors.ToFieldMap();
  
  Assert.That(errorResponse["yearsOfExperience"], Is.Not.Null);
  Assert.That(errorResponse["yearsOfExperience"].Message, Contains.Substring("reasonable"));
  Assert.That(errorResponse["yearsOfExperience"].FieldName, Is.EqualTo("yearsOfExperience"));
}

// Test 4: Schema evolution doesn't break old drafts
[Test]
public async Task OnboardingService_HandlesSchemaVersionMigration()
{
  // Old draft with v1 schema
  var oldDraft = new OnboardingSession
  {
    SchemaVersion = 1,
    Data = new Dictionary<string, object>
    {
      { "role", "student" },
      // New field "mentor" doesn't exist in v1
    }
  };
  
  // Load with v2 schema
  var migrated = await _service.MigrateToLatestSchema(oldDraft);
  
  Assert.That(migrated.SchemaVersion, Is.EqualTo(2));
  Assert.That(migrated.Data.ContainsKey("mentor"), Is.True); // New field added
  Assert.That(migrated.Data.ContainsKey("role"), Is.True); // Old data preserved
}
```

### Why This Matters

**This is where users decide if they trust you with their identity.** Forms are contracts. When auto-fill contradicts what the user typed, trust dies. When validation errors don't explain why, users feel stupid. When hidden fields lose data, users learn your system is lossy. When schema changes break old drafts, users feel abandoned.

---

## 5. Persistence & Recovery (Memory)

Memory defines whether the system feels alive or fragile.

### Edge Cases to Cover

**Network failures**
- Offline during submit
- Timeout after submit but before response
- Duplicate submits on retry

**Data corruption**
- Partial save succeeded (education saved, experience not)
- Related save failed
- Inconsistent state across tables

**Privacy boundaries**
- User deletes account mid-onboarding
- User intentionally restarts onboarding (new session needed)

### Frontend Tests

```typescript
// Test 1: Clear "Saved" vs "Saving…" states
test('User sees real-time save status', () => {
  const { getByText, queryByText } = render(<OnboardingPage />);
  
  fireEvent.click(screen.getByRole('button', { name: /next/i }));
  
  expect(getByText('Saving…')).toBeInTheDocument();
  
  // Simulate API success
  await waitFor(() => {
    expect(getByText('Saved')).toBeInTheDocument();
  });
});

// Test 2: Retry without duplicate records
test('Network error retry does not create duplicate submission', async () => {
  const { getByText } = render(<OnboardingPage />);
  
  // First submit attempt fails
  mockApi.post.mockRejectedValueOnce(new Error('Network error'));
  fireEvent.click(screen.getByRole('button', { name: /complete/i }));
  
  await waitFor(() => {
    expect(getByText('Save failed. Retry?')).toBeInTheDocument();
  });
  
  // User retries
  mockApi.post.mockResolvedValueOnce({ success: true });
  fireEvent.click(screen.getByRole('button', { name: /retry/i }));
  
  // Only one record should exist
  const records = await mockDb.query('onboarding_sessions');
  expect(records.filter((r) => r.userId === 'test-user')).toHaveLength(1);
});

// Test 3: Resume banner when returning
test('User sees resume banner after session interruption', async () => {
  const { getByText } = render(<OnboardingPage />);
  
  // Session interrupted at step 3
  const sessionState = {
    currentStep: 3,
    lastSavedAt: Date.now() - 86400000, // 1 day ago
    completionPercentage: 50,
  };
  
  expect(getByText(/you were on step 3/i)).toBeInTheDocument();
  expect(getByText(/50% complete/i)).toBeInTheDocument();
  expect(getByRole('button', { name: /resume/i })).toBeInTheDocument();
  expect(getByRole('button', { name: /start over/i })).toBeInTheDocument();
});

// Test 4: Explicit reset option
test('User can intentionally restart onboarding', () => {
  const { getByRole } = render(<OnboardingPage />);
  
  fireEvent.click(getByRole('button', { name: /settings/i }));
  fireEvent.click(screen.getByText('Start over'));
  
  expect(screen.getByText(/are you sure\?/i)).toBeInTheDocument();
  expect(screen.getByText(/this will clear your progress/i)).toBeInTheDocument();
  
  fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
  
  expect(screen.getByText('Step 1: Your Role')).toBeInTheDocument();
});
```

### Backend Tests

```csharp
// Test 1: Atomic transactions across related tables
[Test]
public async Task OnboardingService_UsesAtomicTransactionForMultiTableSave()
{
  var data = new OnboardingData
  {
    Role = "Working Professional",
    Education = "Master's",
    Experience = "5-7 years",
  };
  
  // Simulate failure mid-transaction
  mockRepository
    .Setup(x => x.SaveEducation(It.IsAny<OnboardingEducation>()))
    .Throws<DbUpdateException>();
  
  var result = await _service.SaveOnboarding(data);
  
  Assert.That(result.IsSuccess, Is.False);
  
  // Verify all tables are rolled back
  Assert.That(await _db.OnboardingRoles.CountAsync(), Is.EqualTo(0));
  Assert.That(await _db.OnboardingEducations.CountAsync(), Is.EqualTo(0));
  Assert.That(await _db.OnboardingExperiences.CountAsync(), Is.EqualTo(0));
}

// Test 2: Idempotent write endpoints
[Test]
public async Task OnboardingController_SaveEndpoint_IsIdempotent()
{
  var data = new OnboardingData { Role = "Student" };
  var idempotencyKey = "idempotency-key-123";
  
  // First request
  var response1 = await _controller.Save(data, idempotencyKey);
  var sessionId1 = response1.Value.SessionId;
  
  // Second request with same idempotency key
  var response2 = await _controller.Save(data, idempotencyKey);
  var sessionId2 = response2.Value.SessionId;
  
  // Should return same session, not create duplicate
  Assert.That(sessionId2, Is.EqualTo(sessionId1));
  Assert.That(await _db.OnboardingSessions.CountAsync(), Is.EqualTo(1));
}

// Test 3: Soft deletes for drafts
[Test]
public async Task OnboardingService_UsesLogicalDeletionForDrafts()
{
  var session = new OnboardingSession { Status = "draft" };
  await _repository.Save(session);
  
  await _repository.Delete(session.Id);
  
  // Physical record still exists
  var record = await _context.OnboardingSessions
    .IgnoreQueryFilters()
    .FirstOrDefaultAsync(x => x.Id == session.Id);
  
  Assert.That(record, Is.Not.Null);
  Assert.That(record.DeletedAt, Is.Not.Null);
  
  // But filtered out by default queries
  var activeRecord = await _repository.GetById(session.Id);
  Assert.That(activeRecord, Is.Null);
}

// Test 4: Audit trail for every mutation
[Test]
public async Task OnboardingService_LogsEveryMutation()
{
  var session = new OnboardingSession { Role = "Student" };
  await _service.Save(session);
  
  var audit = await _auditRepository.GetMutations(session.Id);
  
  Assert.That(audit, Has.Count.GreaterThanOrEqualTo(1));
  Assert.That(audit[0].Action, Is.EqualTo("CREATE"));
  Assert.That(audit[0].Timestamp, Is.LessThanOrEqualTo(DateTime.UtcNow));
  Assert.That(audit[0].UserId, Is.EqualTo(session.UserId));
}
```

### Why This Matters

**People forgive slowness. They don't forgive lost effort.** One failed save that silently loses half the form is catastrophic. Users who've invested 5 minutes in onboarding will abandon if they lose it. Network errors are normal—retry logic is required, not optional. Soft deletes let support recover mistakes. Audit trails let you explain *how* state got corrupted.

---

## 6. Cross-Cutting "Living System" Tests

These are the ones most teams forget.

### System-Level Scenarios

```typescript
// Scenario 1: Chat-only user completes onboarding
test('User can complete onboarding using only chat', async () => {
  const { getByPlaceholderText } = render(<OnboardingPage />);
  
  const chatInput = getByPlaceholderText('Your message');
  
  // Step 1: Role
  fireEvent.change(chatInput, { target: { value: 'I\'m a student' } });
  fireEvent.keyDown(chatInput, { key: 'Enter', code: 'Enter' });
  
  await waitFor(() => {
    expect(screen.getByText(/role confirmed/i)).toBeInTheDocument();
  });
  
  // Step 2: Education
  fireEvent.change(chatInput, { target: { value: 'I have a Bachelor\'s in CS' } });
  fireEvent.keyDown(chatInput, { key: 'Enter', code: 'Enter' });
  
  await waitFor(() => {
    expect(screen.getByText(/education confirmed/i)).toBeInTheDocument();
  });
  
  // Continue through all steps using only chat
  // ...
  
  await waitFor(() => {
    expect(screen.getByText(/onboarding complete/i)).toBeInTheDocument();
  });
});

// Scenario 2: Form-only user completes onboarding
test('User can complete onboarding ignoring all chat suggestions', () => {
  const { getByRole } = render(<OnboardingPage />);
  
  // Ignore chat, fill form manually
  fireEvent.click(getByRole('radio', { name: /working professional/i }));
  fireEvent.click(getByRole('button', { name: /next/i }));
  
  fireEvent.click(getByRole('combobox', { name: /degree/i }));
  fireEvent.click(screen.getByText("Master's"));
  fireEvent.click(getByRole('button', { name: /next/i }));
  
  // Continue through all steps
  // ...
  
  expect(screen.getByText(/onboarding complete/i)).toBeInTheDocument();
});

// Scenario 3: Mixed user switches styles every step
test('User can mix chat and form throughout onboarding', async () => {
  // Step 1: Use chat
  fireEvent.change(screen.getByPlaceholderText('Your message'), {
    target: { value: 'Student' },
  });
  fireEvent.keyDown(screen.getByPlaceholderText('Your message'), {
    key: 'Enter',
    code: 'Enter',
  });
  
  // Step 2: Use form
  fireEvent.click(screen.getByRole('combobox', { name: /degree/i }));
  fireEvent.click(screen.getByText("Bachelor's"));
  
  // Step 3: Back to chat
  fireEvent.change(screen.getByPlaceholderText('Your message'), {
    target: { value: '5 years experience' },
  });
  fireEvent.keyDown(screen.getByPlaceholderText('Your message'), {
    key: 'Enter',
    code: 'Enter',
  });
  
  // All approaches should lead to same result
  expect(screen.getByText(/onboarding complete/i)).toBeInTheDocument();
});

// Scenario 4: Power user speed-runs everything
test('Fast user can complete onboarding in <30 seconds', async () => {
  const startTime = Date.now();
  const { getByRole } = render(<OnboardingPage />);
  
  // Rapid tab + arrow + enter navigation
  fireEvent.keyDown(document, { key: 'ArrowDown', code: 'ArrowDown' });
  fireEvent.keyDown(document, { key: 'Enter', code: 'Enter' });
  
  fireEvent.keyDown(document, { key: 'Tab', code: 'Tab' });
  fireEvent.keyDown(document, { key: 'ArrowDown', code: 'ArrowDown' });
  fireEvent.keyDown(document, { key: 'Enter', code: 'Enter' });
  
  // Continue...
  
  const endTime = Date.now();
  
  expect(endTime - startTime).toBeLessThan(30000);
  expect(screen.getByText(/complete/i)).toBeInTheDocument();
});

// Scenario 5: Anxious user goes back and forth repeatedly
test('User can navigate back/forward without losing data', () => {
  const { getByRole } = render(<OnboardingPage />);
  
  // Fill step 1
  fireEvent.click(getByRole('radio', { name: /student/i }));
  fireEvent.click(getByRole('button', { name: /next/i }));
  
  // Move to step 2
  fireEvent.click(getByRole('combobox'));
  fireEvent.click(screen.getByText("Bachelor's"));
  fireEvent.click(getByRole('button', { name: /next/i }));
  
  // Go back to step 1
  fireEvent.click(getByRole('button', { name: /back/i }));
  expect(getByRole('radio', { name: /student/i })).toBeChecked();
  
  // Go forward to step 2
  fireEvent.click(getByRole('button', { name: /next/i }));
  expect(getByRole('combobox')).toHaveValue("Bachelor's");
  
  // Go back again
  fireEvent.click(getByRole('button', { name: /back/i }));
  
  // Fill a different role
  fireEvent.click(getByRole('radio', { name: /working/i }));
  fireEvent.click(getByRole('button', { name: /next/i }));
  
  // Data should have updated
  expect(screen.getByText(/you selected working professional/i)).toBeInTheDocument();
});
```

### Observability Tests

```typescript
// Test 1: Can reconstruct a user's journey
test('Audit log allows reconstruction of user journey', async () => {
  const userId = 'test-user-123';
  
  const journey = await auditService.reconstructJourney(userId, startDate, endDate);
  
  expect(journey).toEqual([
    { step: 1, action: 'VIEWED', timestamp: '2026-01-24T10:00:00Z' },
    { step: 1, action: 'SELECTED_ROLE', value: 'STUDENT', timestamp: '2026-01-24T10:02:00Z' },
    { step: 1, action: 'CONFIRMED', timestamp: '2026-01-24T10:03:00Z' },
    { step: 2, action: 'VIEWED', timestamp: '2026-01-24T10:03:30Z' },
    { step: 2, action: 'CHAT_MESSAGE_RECEIVED', value: 'I have a Bachelor\'s', timestamp: '2026-01-24T10:05:00Z' },
    { step: 2, action: 'EXTRACTION_SUGGESTED', field: 'DEGREE', value: 'BACHELOR', confidence: 0.92 },
    { step: 2, action: 'FORM_FIELD_ACCEPTED', field: 'DEGREE', value: 'BACHELOR', source: 'EXTRACTION' },
    // ... etc
  ]);
});

// Test 2: Support can explain why a field has a value
test('Field attribution is traceable for support queries', async () => {
  const session = await onboardingService.getSession('session-123');
  const fieldAttribution = session.getFieldAttribution('degree');
  
  expect(fieldAttribution).toEqual({
    value: "Bachelor's",
    source: 'EXTRACTION',
    extractionId: 'extraction-456',
    extractionMessage: 'I have a Bachelor\'s degree in Computer Science',
    confidence: 0.92,
    acceptedAt: '2026-01-24T10:05:00Z',
    userOverrideCount: 0,
    lastModified: '2026-01-24T10:05:00Z',
  });
});

// Test 3: Can replay a failed onboarding
test('Failed session can be replayed for debugging', async () => {
  const failedSession = await sessionRepository.getById('session-failure-123');
  
  const replay = await debugService.replaySession(failedSession);
  
  expect(replay.steps).toHaveLength(6);
  expect(replay.finalState).toEqual(failedSession.finalState);
  
  // Can also replay with different parameters
  const replayWithNewModel = await debugService.replaySession(failedSession, {
    llmModel: 'gemini-2.0', // Different model for comparison
  });
  
  expect(replayWithNewModel.extractionResults).toExist();
});
```

### Emotional Regression Tests

```typescript
// Test 1: Bot never says "saved" when it isn't
test('Saved notification only appears after confirmed persistence', async () => {
  const { getByText, queryByText } = render(<OnboardingPage />);
  
  fireEvent.click(screen.getByRole('button', { name: /next/i }));
  
  // Simulate network latency but eventual success
  mockApi.post.mockImplementation(
    () => new Promise((resolve) => setTimeout(resolve, 2000))
  );
  
  expect(queryByText('Saved')).not.toBeInTheDocument();
  expect(getByText('Saving…')).toBeInTheDocument();
  
  await waitFor(
    () => {
      expect(getByText('Saved')).toBeInTheDocument();
    },
    { timeout: 3000 }
  );
});

// Test 2: Progress never goes backward silently
test('Progress can only increase or explicitly reset', () => {
  const { getByTestId } = render(<ProgressIndicator currentStep={3} totalSteps={6} />);
  
  const progress = getByTestId('progress-percentage');
  const initialValue = parseInt(progress.getAttribute('aria-valuenow'));
  
  // Simulate some interaction
  fireEvent.click(screen.getByRole('button', { name: /next/i }));
  
  const newValue = parseInt(progress.getAttribute('aria-valuenow'));
  
  expect(newValue).toBeGreaterThanOrEqual(initialValue);
});

// Test 3: System never blames the user
test('Error messages never use accusatory language', async () => {
  const { getByRole } = render(<OnboardingPage />);
  
  // Trigger various error states
  fireEvent.change(screen.getByRole('spinbutton'), { target: { value: 'invalid' } });
  fireEvent.click(getByRole('button', { name: /next/i }));
  
  // Bad: "You entered an invalid value"
  // Good: "We need a number here. Please try again."
  
  expect(screen.queryByText(/you entered/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/you need to/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/you forgot/i)).not.toBeInTheDocument();
  
  // Good patterns should exist
  const errorMessage = screen.getByRole('alert');
  expect(
    errorMessage.textContent.toLowerCase().includes('we') ||
    errorMessage.textContent.toLowerCase().includes('this field')
  ).toBe(true);
});
```

### Why This Matters

**These tests live at the intersection of technical rigor and human psychology.** Your state machine might be perfect, but if users feel blamed or confused or abandoned, they'll leave. The best state machine in the world doesn't matter if it silently loses progress. And support can't help users they don't understand—observability is the difference between "your data is wrong" and "here's why field X has that value."

---

## Final Truth

> If you test only features, you'll ship bugs.
> If you test state, you'll ship reliability.
> If you test emotions, you'll ship trust.

This architecture already points in the right direction. **The test suite is where you prove you meant it.**

---

## Test Execution Checklist

- [ ] Unit tests pass (Edge cases per layer)
- [ ] Integration tests pass (Layers work together)
- [ ] System tests pass (End-to-end user journeys)
- [ ] Manual testing on 3+ device types (phone, tablet, desktop)
- [ ] Accessibility audit (Screen readers, keyboard nav)
- [ ] Performance baseline (< 3s onboarding load time)
- [ ] Audit trail verified (Can support reconstruct journey?)
- [ ] Emotional regression (Error messages, progress visibility)
- [ ] Recovery scenarios tested (Network failure, timeout, retry)
- [ ] Observability verified (Can you debug a failed session?)

---

## Recommended Tool Stack

| Layer | Testing Tool | Coverage |
|-------|--------------|----------|
| Frontend UI | Jest + React Testing Library | Components + interactions |
| State Machine | xState tests | State transitions + guards |
| Backend Logic | xUnit (C#) | Business rules + edge cases |
| Integration | Cypress / Playwright | End-to-end user flows |
| Accessibility | axe-core + manual | WCAG compliance |
| Observability | Winston + structured logs | Audit trail + debugging |
| Performance | Lighthouse + WebVitals | Load time + responsiveness |
| Load | k6 or Artillery | Concurrent onboarding sessions |

---

*This test strategy is not dogma. It's a framework to guide thinking about what matters. Adapt, extend, and evolve it for your context. The goal is always: systems that work reliably and feel alive.*
