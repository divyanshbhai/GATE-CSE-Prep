# GATE CSE Preparation Platform - Design Guidelines

## Design Approach

**Selected Approach**: Design System-Based (Material Design Foundation with Educational Focus)

**Rationale**: Educational productivity tools require clarity, information hierarchy, and distraction-free environments. Drawing from Material Design principles adapted for focused learning experiences similar to Khan Academy and Duolingo's study modes.

**Core Principles**:
- Clarity over decoration - minimize visual noise during study sessions
- Strong information hierarchy - guide attention to active learning tasks
- Progress transparency - always show student advancement
- Supportive aesthetics - encourage persistence without distraction

---

## Typography System

**Font Families**:
- Primary (UI/Body): Inter or Open Sans (via Google Fonts) - excellent readability for extended reading
- Monospace (Code snippets): JetBrains Mono - for algorithms and code examples in questions

**Type Scale**:
- **Page Titles**: text-4xl md:text-5xl, font-bold (Test generation, Performance dashboard)
- **Section Headers**: text-2xl md:text-3xl, font-semibold (Subject names, Topic groups)
- **Card Titles**: text-xl font-semibold (Question numbers, Video titles)
- **Body Text**: text-base leading-relaxed (Question text, explanations)
- **Question Options**: text-base leading-loose (MCQ options - needs breathing room)
- **Metadata**: text-sm (Difficulty tags, timestamps, topic labels)
- **Microcopy**: text-xs (Helper text, validation messages)

**Critical Typography Rules**:
- Question text: text-lg leading-relaxed for optimal readability during tests
- Code blocks within questions: Use monospace, bg-gray-50, p-4, rounded-lg
- Mathematical expressions: Slightly larger text-lg with proper spacing

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16, 20** for consistency

**Standard Spacing Patterns**:
- Component padding: p-6 to p-8
- Section margins: mb-12 to mb-16
- Card gaps: gap-6 to gap-8
- Element spacing: space-y-4 to space-y-6
- Tight spacing (options, lists): space-y-2 to space-y-3

**Container Strategy**:
- Maximum width: max-w-6xl mx-auto (prevents overwhelming wide screens)
- Quiz interface: max-w-4xl (optimal reading width for questions)
- Dashboard/Analytics: max-w-7xl (accommodate charts and multiple columns)
- Video recommendations: max-w-6xl

**Grid Layouts**:
- Subject selection: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Topic cards: grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4
- Video recommendations: grid grid-cols-1 md:grid-cols-2 gap-6
- Performance metrics: grid grid-cols-2 md:grid-cols-4 gap-4

---

## Component Library

### Navigation & Structure

**Header**:
- Sticky header: sticky top-0 z-50 with subtle shadow
- Logo/branding on left, user profile/progress indicator on right
- Navigation: horizontal tabs for main sections (Practice, Progress, Library)
- Height: h-16 with flex items-center justify-between px-6

**Sidebar** (Optional for larger screens):
- Fixed sidebar on lg: screens showing syllabus tree navigation
- Width: w-64, collapsible to w-16 icon-only on toggle
- Hierarchical topic list with expand/collapse functionality

### Core UI Elements

**Buttons**:
- Primary CTA (Start Test, Submit): Larger sizing px-8 py-3, rounded-lg, font-semibold
- Secondary actions (Skip, Back): px-6 py-2, rounded-md, font-medium
- Icon buttons: w-10 h-10, rounded-full for actions like bookmarks, help
- Button groups: Use space-x-3 for horizontal, space-y-2 for stacked

**Cards**:
- Standard card: rounded-xl, shadow-sm, border border-gray-200, p-6
- Interactive cards (subject/topic selection): Add hover:shadow-md, transition-shadow
- Question card: Prominent shadow-lg, rounded-2xl, p-8 with clear visual hierarchy
- Video card: Include thumbnail, title, duration overlay

**Input Fields**:
- Text inputs: h-12, rounded-lg, border-2, px-4, focus:ring-2 treatment
- Textareas (short/long answer): min-h-32, rounded-lg, p-4, border-2
- Radio buttons (MCQ): Use custom styled with larger touch targets (min-h-12 per option)
- Checkboxes (multi-select): w-5 h-5 with rounded-md

### Quiz Interface

**Question Display**:
- Question card: Centered max-w-4xl, shadow-lg, p-8 to p-12
- Question number indicator: Absolute positioning top-4 right-4 or prominent header
- Question text: text-lg leading-relaxed, mb-8
- Visual separation: border-l-4 for code snippets, bg-gray-50 rounded-lg p-4

**MCQ Options**:
- Each option: Full-width button-like card, min-h-14, p-4, rounded-lg
- Layout: space-y-3 for vertical stacking
- Selected state: border-2 with prominent visual feedback
- Option labels: A, B, C, D in circular badges (w-8 h-8, rounded-full, mr-4)

**Short/Long Answer Input**:
- Textarea: w-full, min-h-40 (short answer) or min-h-64 (long answer)
- Character counter: Absolute bottom-4 right-4, text-sm
- Auto-save indicator: Subtle animation when saving to localStorage

**Test Navigation**:
- Progress bar: Fixed top or sticky showing completion (h-2, rounded-full)
- Question palette: Grid of question numbers showing status (answered/unanswered/flagged)
- Navigation buttons: Fixed bottom bar with Previous/Next/Submit

### Dashboard & Analytics

**Performance Cards**:
- Metric cards: Grid layout, each card showing single metric (Score, Accuracy, Time)
- Large number display: text-4xl to text-5xl font-bold
- Label: text-sm font-medium above number
- Icon: Absolute top-4 right-4 with subtle background

**Charts & Graphs**:
- Topic-wise performance: Horizontal bar chart with labels on left, bars extending right
- Progress over time: Line chart showing trend across attempts
- Difficulty distribution: Pie/donut chart with legend
- Container: bg-white, rounded-xl, shadow-sm, p-6

**Topic Breakdown**:
- Accordion-style expandable sections for each subject
- Each topic row: flex justify-between with topic name, score, and trend indicator
- Visual indicators: Small circular progress rings or horizontal progress bars

### Video Recommendations

**Video Card Structure**:
- Thumbnail: aspect-video, rounded-lg, overflow-hidden with play overlay
- Title: text-lg font-semibold, line-clamp-2
- Metadata row: Duration, topic tag, source badge
- Layout: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6

**Embedded Player**:
- YouTube iframe: aspect-video, rounded-xl, w-full
- Player container: max-w-4xl mx-auto with related videos sidebar on larger screens

### Feedback & Messaging

**AI-Generated Reports**:
- Card with border-l-4 accent, bg-gray-50, p-6, rounded-lg
- Motivational message: text-base leading-relaxed with paragraph spacing
- Recommendations list: space-y-2 with bullet points or checkmarks

**Validation Messages**:
- Error: Small banner above input, rounded-md, p-3, text-sm with icon
- Success: Subtle toast notification, absolute top-4 right-4
- Info tooltips: Hover-triggered popover with rounded-lg, shadow-lg, p-3

---

## Responsive Behavior

**Mobile (< 768px)**:
- Single column layouts throughout
- Bottom navigation bar for main sections
- Collapsible filters and sidebars
- Full-width question cards with reduced padding (p-6)
- Stacked button groups

**Tablet (768px - 1024px)**:
- Two-column grids for cards
- Side drawer navigation
- Optimized touch targets (min 44px)

**Desktop (> 1024px)**:
- Multi-column layouts maximized
- Persistent sidebar navigation
- Wider content containers
- Hover states and tooltips enabled

---

## Spacing Hierarchy

**Vertical Rhythm**:
- Between major sections: space-y-16 to space-y-20
- Between components: space-y-8 to space-y-12
- Within components: space-y-4 to space-y-6
- Between related elements: space-y-2 to space-y-3

**Horizontal Spacing**:
- Page margins: px-4 md:px-6 lg:px-8
- Component horizontal padding: px-6 to px-8
- Button groups: space-x-3 to space-x-4
- Icon-text pairs: gap-2 to gap-3

---

## Images

**Hero Section** (Home/Landing):
- Large hero image: Students studying together or focused learner with laptop
- Dimensions: aspect-video or aspect-[21/9] with overlay gradient
- Position: Top of landing page with CTA buttons overlaid (blurred background buttons)
- Alternative: Illustration of GATE syllabus topics in modern geometric style

**Dashboard Empty States**:
- Illustrations for "No tests taken yet", "Start your first quiz"
- Style: Simple, encouraging line art in single accent color
- Size: max-w-xs mx-auto within card

**Performance Icons**:
- Small trophy/medal icons for achievements (w-12 h-12 to w-16 h-16)
- Subject-specific icons using Font Awesome (database, network, cpu icons)
- Position: Top-right of metric cards or inline with subject names

**Video Thumbnails**:
- YouTube auto-generated thumbnails via iframe or API
- Aspect ratio: aspect-video enforced
- Fallback: Gradient background with play icon for loading states

---

## Animation Strategy

**Use Sparingly**:
- Page transitions: Subtle fade-in (duration-200)
- Card hover: Simple shadow elevation change (hover:shadow-md transition-shadow)
- Button press: Subtle scale-95 on active state
- Progress indicators: Smooth width transitions for bars
- Toast notifications: Slide-in from right (animate-slide-in-right)

**Avoid**:
- Distracting animations during quiz-taking
- Auto-playing video backgrounds
- Continuous looping animations

---

## Accessibility & Focus States

- Focus rings: ring-2 ring-offset-2 for keyboard navigation
- Skip to main content link: Absolute sr-only visible:on-focus
- ARIA labels: All interactive elements clearly labeled
- Color contrast: Ensure WCAG AA compliance for all text
- Screen reader announcements: For quiz feedback, timer updates

---

This design system creates a focused, professional learning environment that prioritizes content clarity, efficient navigation, and supportive feedback—essential for students preparing for a rigorous exam like GATE CSE.