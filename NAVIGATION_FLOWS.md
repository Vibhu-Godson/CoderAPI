# Navigation Flow Diagram

## User Journey: Browsing Problems to Solving

```
┌─────────────────────────────────────────────────────────────────────┐
│                         AmCoder App                                  │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                    ✅ User clicks on Navbar "Problems"
                                 │
                                 ▼
         ┌─────────────────────────────────────────────────────┐
         │  /problems (ProblemsPage)                            │
         │  ┌────────────────────────────────────────────────┐ │
         │  │ Header                                         │ │
         │  │ • Title: "Problems"                           │ │
         │  │ • Difficulty dropdown                         │ │
         │  │ • 🔍 Search bar ← NEW!                       │ │
         │  ├────────────────────────────────────────────────┤ │
         │  │ TagsBar (filter by category)                   │ │
         │  ├────────────────────────────────────────────────┤ │
         │  │ Problems List (responsive):                    │ │
         │  │ ┌─────────────────────────────────────────────┐│ │
         │  │ │ 1. Two Sum           [Easy] [50%]           ││ │
         │  │ │ 2. Add Two Numbers   [Med]  [60%]           ││ │
         │  │ │ 3. LCA of Tree       [Hard] [40%]           ││ │
         │  │ │ 4. Fibonacci         [Easy] [80%] 🔒        ││ │
         │  │ └─────────────────────────────────────────────┘│ │
         │  │                                                 │ │
         │  │ ✅ Click on any problem                         │ │
         │  └────────────────────────────────────────────────┘ │
         └─────────────────────────────────────────────────────┘
                                 │
                    Navigates to: /problems/1-two-sum
                                 │
                                 ▼
    ┌──────────────────────────────────────────────────────────────┐
    │  /problems/:idSlug (ProblemDetailPage2.0) ← NEW!             │
    │                                                               │
    │ ┌────────────────────────────────────────────────────────────┤
    │ │ MiniHeader                                                 │
    │ │ ◄─── Back Button | AmCoder / Two Sum | Avatar + UserName  │
    │ └────────────────────────────────────────────────────────────┤
    │                                                               │
    │ ┌──────────────────────┬──────────────────────────────────────┤
    │ │ Sidebar (30%)        │ Playground (70%)                     │
    │ │                      │                                      │
    │ │ Tabs:                │ Tabs:                                │
    │ │ 📋 Problem Statement │ 💻 Code Editor ← ACTIVE             │
    │ │ 💾 My Solution       │ 💬 Chat Bot                         │
    │ │ 📊 My Sessions       │                                      │
    │ │                      │ ┌──────────────────────────────────┐ │
    │ │                      │ │ [Python ▼] Code Editor (Monaco) │ │
    │ │                      │ │                                  │ │
    │ │ [Content Area]       │ │  def twoSum(nums, target):       │ │
    │ │                      │ │      # Write your solution       │ │
    │ │ Current active:      │ │      pass                        │ │
    │ │ Problem description  │ │                                  │ │
    │ │ with all details,    │ │                                  │ │
    │ │ examples, and        │ │                                  │ │
    │ │ constraints          │ │                                  │ │
    │ │                      │ │                                  │ │
    │ │ [Minimize ◄─►]       │ │                                  │ │
    │ │                      │ └──────────────────────────────────┘ │
    │ │                      │                                      │
    │ │                      │ [▶ Run] [✓ Submit]                  │
    │ └──────────────────────┴──────────────────────────────────────┘
    │                                                               │
    │ ┌──────────────────────────────────────────────────────────────┤
    │ │ Test Results (from CodeEditorPanel)                          │
    │ │ [TC1: ✓] [TC2: ✓] [TC3: ✗] ...                             │
    │ └──────────────────────────────────────────────────────────────┘
    └──────────────────────────────────────────────────────────────┘
                                 │
                ✅ User clicks "💬 Chat" tab
                                 │
                                 ▼
    ┌──────────────────────────────────────────────────────────────┐
    │ Playground - Chat Interface                                  │
    │                                                               │
    │ [Messages]                                                   │
    │ ┌────────────────────────────────────────────────────────────┤
    │ │ 🤖 AI: How would you approach this?                       │ │
    │ │                                                            │ │
    │ │                        👤 Me: Using a hash map           │ │
    │ │                                                            │ │
    │ │ 🤖 AI: Great idea! Can you explain why?                  │ │
    │ │                                                            │ │
    │ │                        👤 Me: ...                         │ │
    │ └────────────────────────────────────────────────────────────┤
    │                                                               │
    │ [Input]                                                      │
    │ ┌────────────────────────────────────────────────────────────┤
    │ │ Ask AI for help... [Send ▶]                              │
    │ └────────────────────────────────────────────────────────────┘
    │                                                               │
    │ Connection: 🟢 Connected                                     │
    └──────────────────────────────────────────────────────────────┘
                                 │
                ✅ User clicks "▶ Run Solution"
                                 │
                                 ▼
            ┌───────────────────────────────────────┐
            │ Test Cases Results                    │
            │                                       │
            │ 🟢 Test Case 1: Accepted (0.1ms)    │
            │ 🟢 Test Case 2: Accepted (0.15ms)   │
            │ 🟢 Test Case 3: Accepted (0.2ms)    │
            │                                       │
            │ All tests passed! ✓                   │
            └───────────────────────────────────────┘
                                 │
                ✅ User clicks "✓ Submit Solution"
                                 │
                                 ▼
           ┌──────────────────────────────────────┐
           │ Solution Submitted Successfully! 🎉  │
           │                                      │
           │ Your solution was accepted!          │
           │ Added to My Solutions                │
           │ Session marked completed ✅          │
           └──────────────────────────────────────┘
                                 │
    ┌───────────────────────────┴──────────────────────┐
    │                                                   │
    ✅ Click sidebar tab "💾 My Solution"             ✅ Back button
    │                                                   │
    ▼                                                   ▼
Can see all your solutions                    Navigate back to:
and submission history                        /problems (list page)
```

## Responsive Layout Evolution

### Desktop (≥1024px)
```
┌─────────────────────────────────────┐
│         MiniHeader (small)          │
├────────────────┬────────────────────┤
│ Sidebar (30%)  │ Playground (70%)   │
│ [visible]      │ [full code editor] │
│ Can minimize   │                    │
└────────────────┴────────────────────┘
```

### Tablet (768px - 1023px)
```
┌─────────────────────────────────────┐
│         MiniHeader (small)          │
├────────────────┬────────────────────┤
│ Sidebar (30%)  │ Playground (70%)   │
│ [can hide]     │ [responsive]       │
└────────────────┴────────────────────┘

If sidebar minimized:
┌─────────────────────────────────────┐
│         MiniHeader (small)          │
├────────────────────────────────────┤
│          Playground (100%)          │
│        [full screen coding]        │
└────────────────────────────────────┘
```

### Mobile (<768px)
```
┌────────────────────────────┐
│   MiniHeader (compact)     │
├────────────────────────────┤
│   Playground (full width)  │
│   [code editor/chat]       │
├────────────────────────────┤
│ [◄ Minimize or Close ►]    │
└────────────────────────────┘

Sidebar hidden by default:
┌─ Sidebar Drawer ─┐
│ 📋 Problem      │
│ 💾 Solutions    │ ← Tap to overlay
│ 📊 Sessions     │
└─────────────────┘
```

## Authentication Flow

```
┌──────────────────┐
│ Any API call     │
│ returns 401      │
└────────┬─────────┘
         │
    ┌────▼────────────────────┐
    │ Interceptor middleware  │
    │ (handleResponseMiddleware)
    └────┬─────────────────────┘
         │
    ┌────▼──────────────────────┐
    │ dispatch(logout())        │
    │ Clear auth state          │
    └────┬──────────────────────┘
         │
    ┌────▼──────────────────────┐
    │ window.location.href =    │
    │ "/login"                  │
    └───────────────────────────┘
         │
    ┌────▼──────────────────────┐
    │ User redirected to        │
    │ LoginPage                 │
    └───────────────────────────┘
```

## Search Flow

```
┌─────────────────────────────┐
│ User types in search bar    │
└────────┬────────────────────┘
         │
    ┌────▼────────────────────┐
    │ searchQuery state update │
    │ (real-time)             │
    └────┬────────────────────┘
         │
    ┌────▼────────────────────┐
    │ useEffect triggered     │
    │ Reset to page 1         │
    └────┬────────────────────┘
         │
    ┌────▼────────────────────┐
    │ API call with filter    │
    │ getProblems({           │
    │   search: "query"       │
    │ })                      │
    └────┬────────────────────┘
         │
    ┌────▼────────────────────┐
    │ Results filtered        │
    │ Display matching        │
    │ problems only           │
    └─────────────────────────┘
```

## Events Flow

```
ProblemDetailPage2.0
    │
    ├─── Run Solution ─────────────┐
    │                              │
    ├─── Submit Solution ──────────┼──→ wrappedRun/wrappedSubmit
    │                              │
    └─── Chat Message ────────────┐│
                                   │
                                   └──→ useProblemSession
                                        │
                                        ├─→ SignalR connection
                                        │
                                        ├─→ ProblemPlayGroundController
                                        │
                                        └─→ Update chat/results UI
```

---

**Created:** January 25, 2026
**Status:** Complete visual guide for navigation flows
