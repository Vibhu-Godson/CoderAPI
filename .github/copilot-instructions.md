# Copilot Instructions

## General Guidelines
- First general instruction
- Second general instruction

## Code Style
- Use specific formatting rules
- Follow naming conventions

## Project-Specific Rules
- The workspace project targets .NET 8.
- The repository is located at `C:\Users\User1\Desktop\AmCoder` (origin: [CoderAPI](https://github.com/Vibhu-Godson/CoderAPI)).
- The current branch is `dev`.
- Key backend services include:
  - SignalR hub: `CodeExecutionHub` mapped at `/hubs/codeExecution`
  - MassTransit with RabbitMQ queues: `code-runner-queue`, `llm-analyze-queue`
  - Judge0 HTTP service: `IJudge0Service`
  - Gemini LLM client: `IGeminiLLM`
  - `IWhatsappHelper` with base URL: `http://localhost:3001/`
  - EF Core SqlServer DbContext: `CodeDbContext`
- JWT authentication is configured with a CORS policy: `AllowReactDev` allowing `http://localhost:3000`.
- Keep track of DI scan registrations and frontend notes: auth token stored in `localStorage` via `authSlice`.

## Immediate Next Tasks
- Fix missing `UseAuthentication`
- Align package versions
- Add centralized error handling
- Create documentation, tests, and CI

## Project Analysis Checklist
- Remember key endpoints and services.
- Track DI registrations and middleware issues (e.g., missing `UseAuthentication`).
- Monitor MassTransit queues and SignalR hub mapping.
- Note frontend details, including auth token storage and redux slice.