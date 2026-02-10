# ProblemDetailPage 2.0 - Routing & Navigation Guide

## Current Routing Setup

### Routes
- **`/problems`** → Problem list page (ProblemsPage) with search
- **`/problems/:idSlug`** → **NEW** Problem detail page 2.0 (ProblemDetailPage2.0)
- **`/problems-v1/:idSlug`** → Legacy problem detail page (original reference)

### URL Format
```
/problems/{problemId}-{slugName}

Example: /problems/1-two-sum
```

## Navigation Flow

### From Problem List to Playground (NEW v2.0)

**File:** `src/problem/components/Problems.tsx`

```tsx
// Current implementation (line ~80):
const slug = slugify(p.problemName);
return (
    <Link
        key={p.problemId}
        to={`/problems/${p.problemId}-${slug}`}
        className="..."
    >
        {/* Problem row content */}
    </Link>
);
```

✅ Clicking any problem from the list automatically navigates to the new ProblemDetailPage2.0!

### Programmatic Navigation

If you need to navigate programmatically:

```tsx
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

const handleOpenProblem = (problemId: number, problemName: string) => {
    const slug = problemName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    
    navigate(`/problems/${problemId}-${slug}`);
};
```

## ProblemDetailPage 2.0 Architecture

### Layout Structure

```
┌─────────────────────────────────────┐
│     MiniHeader (Logo + Username)     │
├──────────────┬──────────────────────┤
│   Sidebar    │      Playground      │
│   (30%)      │       (70%)          │
│              │                      │
│ Problem      │ Code Editor/Chat     │
│ Solutions    │ Run & Submit buttons │
│ Sessions     │ Test results         │
└──────────────┴──────────────────────┘
```

### Components

#### 1. **MiniHeader** (`./ProblemDetailPage2.0/MiniHeader.tsx`)
- Shows problem name in breadcrumb
- Back button to `/problems`
- User info (avatar + name)

#### 2. **Sidebar** (`./ProblemDetailPage2.0/Sidebar.tsx`)
- **Tabs:**
  - 📋 Problem Statement
  - 💾 My Solution
  - 📊 My Sessions
- Collapsible (minimize to give more space to playground)
- Mobile: Overlay drawer

#### 3. **Playground** (`./ProblemDetailPage2.0/Playground.tsx`)
- **Code Tab:**
  - Monaco code editor
  - Language selector
  - Run & Submit buttons
  - Inline test results (from CodeEditorPanel)
  
- **Chat Tab:**
  - AI conversation interface
  - Message history
  - Input with send button

### Main Component (`ProblemDetailPage2.0.tsx`)

```tsx
export default function ProblemDetailPage2_0() {
    // Get problem ID from URL params
    const { idSlug } = useParams<{ idSlug: string }>();
    const problemId = Number(idSlug?.split("-")[0]);
    
    // Load problem data
    const { problem, code, setCode, ... } = useProblemData(problemId);
    
    // Initialize session
    const { chat, wrappedRun, wrappedSubmit, ... } = useProblemSession(...);
    
    // Manage UI state
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    
    // Render 3-panel layout
    return (
        <MiniHeader />
        <Sidebar />
        <Playground />
    );
}
```

## Event Handling

### Events Triggered by Playground

All events pass through the existing hooks and are handled by the backend `ProblemPlayGroundController`:

#### 1. Run Solution
```tsx
onClick={wrappedRun}
// → Executes code against test cases
// → Shows results inline in CodeEditorPanel
```

#### 2. Submit Solution
```tsx
onClick={wrappedSubmit}
// → Submits final solution
// → Shows success notification
// → Updates My Solutions tab
```

#### 3. Chat with Bot
```tsx
onClick={handleSend}
// → Sends message to AI
// → Updates chat interface
// → AI responds in real-time via SignalR
```

## Responsive Behavior

### Desktop (1024px+)
- Sidebar: 30% width, visible
- Playground: 70% width
- Full labels and icons
- Side-by-side layout

### Tablet (768px - 1023px)
- Flexible widths
- Sidebar can collapse
- Touch-friendly buttons

### Mobile (<768px)
- Sidebar: Full-width overlay/drawer
- Playground: Full screen
- Can minimize sidebar to see code full-screen
- Hamburger icon to show/hide sidebar
- Stacked button layouts

## Back Navigation

**Back Button** (in MiniHeader)
```tsx
onClick={() => navigate("/problems")}
// → Returns to problems list
```

## Code Snippet: Adding a New Problem Link

If you want to link to problems from other pages:

```tsx
import { Link } from "react-router-dom";

// Method 1: Using Link component
<Link to={`/problems/${problem.id}-${slug}`}>
    Open Problem
</Link>

// Method 2: Using useNavigate hook
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();
const goToProblem = () => {
    navigate(`/problems/${problem.id}-${slug}`);
};

// Method 3: From API data
{data?.items?.map((problem) => (
    <Link key={problem.id} to={`/problems/${problem.id}-${slugify(problem.name)}`}>
        {problem.name}
    </Link>
))}
```

## URL Slug Generation

The app uses a consistent slugification function:

```tsx
const slugify = (text: string) =>
    text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")      // Replace non-alphanumeric with -
        .replace(/^-+|-+$/g, "");          // Remove leading/trailing hyphens

// Examples:
// "Two Sum" → "two-sum"
// "Add Digits" → "add-digits"
// "LCA of Binary Tree" → "lca-of-binary-tree"
```

## Testing Checklist

- [ ] Click a problem from list → Opens ProblemDetailPage2.0
- [ ] URL shows correct format: `/problems/{id}-{slug}`
- [ ] Back button → Returns to problems list
- [ ] Sidebar tabs work correctly
- [ ] Run Solution button executes code
- [ ] Submit Solution button submits code
- [ ] Chat interface works
- [ ] Mobile responsive layout works
- [ ] Sidebar minimize/expand works on desktop
- [ ] Sidebar overlay works on mobile

## Troubleshooting

### Problem Not Loading
- Check: `useProblemData` hook fetches correctly
- Check: Problem ID parsing from URL slug
- Check: API endpoint returns data

### Buttons Not Working
- Check: `signalRConnected` state is true
- Check: Session ID is initialized
- Check: Network requests are successful

### Chat Not Updating
- Check: SignalR connection established
- Check: `useProblemSession` hook initialized
- Check: Backend `ProblemPlayGroundController` is responding

### Layout Issues on Mobile
- Check: `isMobile` state updates on resize
- Check: Tailwind classes for responsive breakpoints
- Check: Overflow and scroll settings

---

**File Summary:**
- Route definition: [App.tsx](../App.tsx)
- Problem list: [ProblemsPage.tsx](../ProblemsPage.tsx) + [Problems.tsx](../../components/Problems.tsx)
- Main detail page: [ProblemDetailPage2.0.tsx](./ProblemDetailPage2.0.tsx)
- Sub-components: [ProblemDetailPage2.0/](./ProblemDetailPage2.0/)
