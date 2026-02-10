# Onboarding UX/UI - Visual & Interaction Guide

## 📐 Layout Architecture

### Desktop View (1024px+)
```
┌─────────────────────────────────────────────────────────────┐
│  AmCoder Onboarding                                     [×]  │
├──────────────────┬──────────────────────────────────────────┤
│                  │                                          │
│  CHAT PANEL      │       FORM PANEL                        │
│  ─────────────   │       ───────────                       │
│  🤖 Bot:         │       📝 Welcome! Let's get to know you │
│  Welcome to      │       Select what describes you:       │
│  AmCoder! Let's  │       ┌─────────────────────────┐      │
│  set up profile  │       │ Student                 │      │
│                  │       └─────────────────────────┘      │
│  You: I am a     │       ┌─────────────────────────┐      │
│  Student         │       │ Working Professional... │      │
│                  │       └─────────────────────────┘      │
│  🤖 Great!       │       [More options...]                │
│  Now education   │                                         │
│                  │       [Back] [Skip] [Continue]         │
│  ┌────────────┐  │                                         │
│  │ Type here  │  │                                         │
│  └────────────┘  │                                         │
│  [Send]          │                                         │
│                  │                                         │
└──────────────────┴──────────────────────────────────────────┘
```

**Proportions**: Chat 33%, Form 67%
**Layout**: Side-by-side flex row
**Visibility**: Always visible on desktop

---

### Tablet View (768px - 1023px)
```
┌─────────────────────────────────┐
│  📝 Form    │    💬 Chat       │
├─────────────────────────────────┤
│  Welcome! Let's get to know you │
│  Select what describes you:     │
│  ┌─────────────────────────────┐│
│  │ ● Student                   ││
│  │ ○ Working Professional 0-2  ││
│  │ ○ Working Professional 2-5  ││
│  │ ○ Working Professional 5-10 ││
│  │ ○ Working Professional 10+  ││
│  │ ○ Seeking Employment        ││
│  └─────────────────────────────┘│
│                                 │
│  [Back] [Skip] [Continue]       │
└─────────────────────────────────┘
```

**Tab Navigation**: Form active (highlighted in indigo)
**Layout**: One tab at a time, full width content
**Switch Tab**: Click chat button to see chat in same space

---

### Mobile View (320px - 767px)
```
┌──────────────────────────┐
│ 📝 Form │ 💬 Chat      │
├──────────────────────────┤
│                          │
│  Welcome! Let's get to   │
│  know you                │
│                          │
│  Select what describes   │
│  you:                    │
│                          │
│  [Student]               │
│  [Working Prof 0-2]      │
│  [Working Prof 2-5]      │
│  [Working Prof 5-10]     │
│  [Working Prof 10+]      │
│  [Job Seeker]            │
│                          │
│  [Back] [Skip] [Cont.]   │
│                          │
└──────────────────────────┘
```

**Tab Bar**: Sticky at top with emoji icons
**Active Tab**: Indigo highlight with bottom border
**Gesture**: Single tap to switch tabs
**Content**: Full viewport height, fills available space

---

## 🎨 Color & Style System

### Color Palette
```
Primary:        Indigo-600  (#4F46E5)  - Action buttons, active states
Primary Hover:  Indigo-700  (#4338CA)  - Button hover
Secondary:      Slate-300   (#CBD5E1)  - Back button
Secondary Hover: Slate-400  (#94A3B8)  - Hover
Background:     Slate-50    (#F8FAFC)  - Page background
Border:         Slate-200   (#E2E8F0)  - Card borders
Text:           Slate-900   (#0F172A)  - Headings
Text Muted:     Slate-600   (#475569)  - Descriptions
```

### Typography

#### Headings
```
Step Title:     text-2xl md:text-3xl font-bold text-slate-900
Step Subtitle:  text-sm md:text-base text-slate-600
Form Label:     text-xs md:text-sm text-slate-600 font-medium
```

#### Body Text
```
Button Text:    text-sm md:text-base font-semibold
Input Placeholder: text-sm md:text-base text-slate-500
Chat Message:   text-sm md:text-base text-slate-900
```

### Spacing
```
Container:      p-4 sm:p-6 md:p-8
Input Fields:   px-4 py-3
Buttons:        px-4 py-2 (small), px-6 py-2 (large)
Form Grid Gap:  gap-4
Section Gap:    space-y-4, space-y-6
```

---

## 🔘 Interactive Elements

### Form Buttons

#### Continue Button (Primary Action)
```
Default:   bg-indigo-600 text-white
Hover:     bg-indigo-700 (darker)
Disabled:  opacity-50 cursor-not-allowed
Focus:     ring-2 ring-indigo-500
```

#### Back Button (Secondary Action)  
```
Default:   bg-slate-300 text-slate-900
Hover:     bg-slate-400
Disabled:  opacity-50 cursor-not-allowed
```

#### Skip Button (Tertiary Action)
```
Default:   border border-slate-300 text-slate-600 bg-white
Hover:     bg-slate-50 text-slate-900
Focus:     ring-2 ring-indigo-500
```

#### Tab Button (Selector)
```
Inactive:  text-slate-600 border-transparent hover:text-slate-900
Active:    text-indigo-600 border-indigo-600 bg-indigo-50
```

### Input Fields
```
Default:   border border-slate-300 rounded-xl px-4 py-3
Focus:     ring-2 ring-indigo-500 border-slate-300
Error:     border border-red-500 ring-2 ring-red-500
```

### Suggestions
```
Default:   px-4 py-3 border border-slate-300 bg-white rounded-lg
Hover:     bg-indigo-50 border-indigo-500
Active:    bg-indigo-600 text-white (selected skill)
```

---

## ✨ Interactions & Animations

### Tab Switching (Mobile/Tablet)
```
Animation:  Smooth fade in/out (CSS transition)
Speed:      150ms ease-out
Behavior:   Scroll to top of new tab content
```

### Form Submission
```
1. User clicks Continue/Finish
2. Message appears in chat immediately
3. Send button shows "Saving..."
4. After 300-400ms delay, bot response
5. Auto-scroll to latest chat message
```

### Skip Action
```
1. User clicks Skip
2. Chat shows: "Skipped {step}. Moving to {next}..."
3. Form smoothly transitions to next step
4. Same position maintained
```

### Suggestion Selection
```
1. User clicks suggestion button
2. Text fills the textarea immediately
3. Input field gets focus
4. Button styling may update to show selected state
```

---

## 📱 Responsive Breakpoints

### Tailwind Breakpoints Used
```
Mobile:    < 640px (sm)
Tablet:    640px - 1023px (md to lg)
Desktop:   ≥ 1024px (lg)
```

### Conditional Rendering
```
hidden:        Always hidden
hidden md:     Hidden on tablet and up (show on mobile)
hidden lg:     Hidden on desktop (show on mobile/tablet)
flex md:       Hidden on mobile, flex on tablet+
flex lg:       Hidden on mobile/tablet, flex on desktop+
```

### Text Scaling
```
text-sm:       Small screens
md:text-base:  Medium screens and up
Common pattern: text-sm md:text-base
```

---

## 🎯 User Flow Diagrams

### Desktop User Flow
```
1. Loads page
2. Sees chat + form side by side
3. Reads chat for context
4. Fills form
5. Clicks Continue
6. Sees response in chat
7. Next form appears
8. Repeat steps 3-7
9. Click Finish on last step
10. Redirected to home
```

### Mobile User Flow (Default to Form)
```
1. Loads page (Form tab active)
2. Reads form title
3. Fills form (can peek at chat if needed)
4. Clicks Continue
5. Chat updates
6. Next form appears
7. Repeat steps 2-6
8. Can switch to Chat tab anytime to read guidance
9. Finish → Home
```

### Mobile User Flow (Chat First)
```
1. Loads page (Form tab active)
2. Clicks Chat tab
3. Reads bot guidance
4. Clicks Form tab
5. Fills form with context from chat
6. Continue → next step
7. (Repeat as needed)
```

---

## 📊 State Management

### Component State
```typescript
// Main state
state: {
  step: "role" | "education" | "experience" | "project" | "skills" | "motivation" | "done"
  chat: ChatMessage[]
  role?: string
  education?: EducationDto
  experience?: ExperienceDto
  project?: ProjectDto
  skills?: string
  motivation?: string
}

// Mobile specific
mobileTabView: "form" | "chat"
```

### Message State
```typescript
ChatMessage: {
  id: string           // Unique ID
  role: "bot" | "user" // Message sender
  text: string         // Message content (formatted for form data)
  ts: number          // Timestamp
}
```

---

## 🔄 Message Formatting Examples

### Role Selection
```
User Action:  Selects "Student"
Message Sent: "I am a Student"
Bot Reply:    "Great! Let's add your education."
```

### Education Form
```
User Fills: MIT, B.Tech, Computer Science, 2023
Message Sent: "Form filled with: MIT, B.Tech in Computer Science (2023)"
Bot Reply:    "Saved your education at MIT."
```

### Experience Form  
```
User Fills: Google, Senior Dev, 2022-01-01 to 2024-01-01
Message Sent: "Form filled with: Senior Dev at Google (2022-01-01 to 2024-01-01)"
Bot Reply:    "Saved your experience at Google."
```

### Skills Selection
```
User Enters: React, TypeScript, AWS, Docker
Message Sent: "Form filled with: Skills - React, TypeScript, AWS, Docker"
Bot Reply:    "Skills saved!"
```

### Motivation Selection
```
User Enters: (From suggestion or custom)
Message Sent: "Form filled with: \"I want to build products that impact millions\""
Bot Reply:    "All set! Your onboarding is complete 🎉"
```

---

## 🚀 Performance Metrics

### Load Time
- Initial render: < 500ms
- Form switching: < 100ms (instant feel)
- Tab switching: < 150ms (smooth animation)

### Interactions
- Button click response: Immediate
- Chat scroll: Smooth 60fps
- Form input: Real-time validation

---

## ♿ Accessibility Features

### Keyboard Navigation
```
Tab:       Navigate through interactive elements
Enter:     Activate buttons
Shift+Tab: Reverse navigation
Arrow Keys: Not needed (form-focused)
```

### Screen Readers
```
aria-label="Form tab"        - Tab buttons
aria-label="Chat tab"        - Tab buttons  
aria-live="polite"           - Chat region
role="region"                - Chat section
role="status"                - Bot messages
```

### Visual Accessibility
```
Color Contrast: WCAG AA compliant (4.5:1 minimum)
Focus States:   Clear ring-2 ring-indigo-500
Font Size:      16px minimum (accessibility standard)
Touch Targets:  48px minimum height (mobile)
```

---

## 📸 Visual States

### Button States
```
Default:   Full opacity, pointer cursor
Hover:     Color change (darker shade)
Focus:     Ring border added
Disabled:  opacity-50, not-allowed cursor
Active:    Different bg color
```

### Input States
```
Empty:     Border only, placeholder visible
Filled:    Border + content
Focus:     Ring border + darker border
Error:     Red border + red ring
Success:   Green checkmark (optional)
```

### Form States
```
Loading:   Button shows "Saving..."
Submitted: Form disabled, spinner
Error:     Error message in chat
Success:   Move to next step
```

---

## 🎓 Design System Summary

| Element | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Font Size | Base 16px | Base 16px | sm 14px, base 16px |
| Spacing | p-8 | p-6 | p-4 |
| Button Size | px-4 py-2 | px-4 py-2 | px-4 py-3 |
| Input Height | py-3 | py-3 | py-3 |
| Radius | xl (12px) | xl (12px) | xl (12px) |
| Chat:Form | 1:2 | Tab | Tab |
| Max Width | max-w-7xl | 100% | 100% |

---

This comprehensive guide covers all visual and interactive aspects of the redesigned onboarding experience!
