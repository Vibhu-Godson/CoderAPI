# ProblemDetailPage 2.0 - Quick Reference

## 🎯 What Changed?

### ❌ Removed
- ResizeObserver error-causing code
- Run & Submit buttons from playground top bar
- Old endpoint `/api/Problem/UserSolution`

### ✅ Added
- Window resize listener for Monaco editor
- New endpoint `/api/ProblemPlayGround/RunCode`
- **ProblemPreviewPage** - New page to review problems before solving
- **View Mode Toggle** - Code & Chat vs Code Only mode
- "Start Solving" button in preview page

### 🔄 Updated
- `api_urls.ts` - Changed endpoint URL
- `problemApi.ts` - Updated mutation to use new endpoint
- `Playground.tsx` - Added view mode selector at top
- `CodeEditorPanel.tsx` - Replaced ResizeObserver with event listener

---

## 📍 File Locations

```
src/
├── api/
│   └── api_urls.ts                           [UPDATED]
├── problem/
│   ├── pages/
│   │   ├── ProblemPreviewPage.tsx            [NEW]
│   │   ├── ProblemDetailPage2.0.tsx          (unchanged)
│   │   └── ProblemDetailPage2.0/
│   │       ├── Playground.tsx                [UPDATED]
│   │       ├── Sidebar.tsx                   (unchanged)
│   │       └── MiniHeader.tsx                (unchanged)
│   ├── components/
│   │   └── CodeEditorPanel.tsx               [UPDATED]
│   └── problemApi.ts                         [UPDATED]
```

---

## 🚀 User Navigation Flow

```
Problems List Page
        ↓
   [Click Problem]
        ↓
   ProblemPreviewPage
   (Shows problem statement + examples)
        ↓
   [Click "Start Solving"]
        ↓
ProblemDetailPage 2.0
   (Code editor + optional AI chat)
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + '` | Run Code |
| `Ctrl + Enter` | Submit Code |

---

## 🎛️ Playground View Modes

### Code & Chat Mode (Default)
```
┌─────────────────────────────────────────┐
│ View Mode Selector: [Code & Chat] [Code Only] │
├──────────────────────┬──────────────────┤
│                      │                  │
│   Code Editor (67%)  │   Chat Panel     │
│                      │   (33%)          │
│                      │                  │
└──────────────────────┴──────────────────┘
```

### Code Only Mode
```
┌─────────────────────────────────────────┐
│ View Mode Selector: [Code & Chat] [Code Only] │
├─────────────────────────────────────────┤
│                                         │
│   Code Editor (100%)                    │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📡 New API Endpoint

**Endpoint:** `POST /api/ProblemPlayGround/RunCode`

**Purpose:** Execute or submit code for a problem

**Parameters:**
```typescript
{
  userSolutionId: number;           // 0 for new submission
  userProblemSessionId: number;     // Active session ID
  problemId: number;                // Problem ID
  code: string;                     // Source code
  language: string;                 // Programming language
  isSubmit: boolean;                // true for submit, false for run
  testcases?: {
    items: Array<{
      testCaseId: number;
      input: string;
      expectedOutput: string;
      explaination: string;
    }>;
    totalCount: number;
  };
}
```

**Response:**
```typescript
{
  status: boolean;
  message: string;
  userSolutionId: number;
  testCaseResults: Array<{
    userTestCaseResultId: number;
    testCaseId: number;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    status: string;                 // "Accepted", "Wrong Answer", etc.
    executionTime: number;          // milliseconds
    memoryUsed: number;             // bytes
    stderr: string;
    compileOutput: string;
  }>;
  result: string;                   // "Accepted", "Wrong Answer", etc.
}
```

---

## 🔧 Component Props

### ProblemPreviewPage
- Route params: `/problem-preview/:idSlug`
- Auto-creates session and navigates to 2.0
- No additional props needed

### Playground
- Added: `viewMode` state (code-chat | code-only)
- Added: `setViewMode` function
- Existing props unchanged

---

## 🐛 Issues Fixed

| Issue | Solution |
|-------|----------|
| ResizeObserver errors | Window resize event listener |
| Button clutter in editor | Moved to CodeEditorPanel toolbar |
| Old API endpoint | Updated to `/ProblemPlayGround/RunCode` |
| No problem preview | Created ProblemPreviewPage |
| No view flexibility | Added Code & Chat vs Code Only toggle |

---

## 📝 Notes

- Session creation happens in ProblemPreviewPage
- SignalR connection established before navigation to 2.0
- Run/Submit still available via keyboard shortcuts
- Test results now received directly from API (not SignalR)
- View mode preference can be persisted in localStorage if needed

---

## 🔗 Related Routes

```
/problems                           - Problem list
/problem-preview/:idSlug            - Preview page (NEW)
/problem-solve/:idSlug              - Coding page (2.0 version)
```

---
