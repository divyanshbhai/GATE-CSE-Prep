# GATE CSE 2026 Preparation Platform

## Project Overview

A comprehensive AI-powered preparation platform for GATE Computer Science Engineering exam. The application provides authentic exam-style practice tests, personalized AI feedback via Puter.js, video recommendations from curated YouTube playlists, and detailed progress tracking.

## Architecture

**Stack**: Full-stack JavaScript with React frontend and Express backend
**AI Integration**: Puter.js (GPT-5 nano, Claude) for zero-cost AI features
**YouTube Integration**: YouTube Data API v3 via Replit connector
**Storage**: In-memory storage with localStorage for client-side persistence
**Styling**: Tailwind CSS with Shadcn UI components

## Features

### MVP Features (Current Implementation)

1. **Official GATE 2026 Syllabus Coverage**
   - All 10 sections: Engineering Mathematics, Digital Logic, Computer Organization, Programming & Data Structures, Algorithms, Theory of Computation, Compiler Design, Operating Systems, Databases, Computer Networks
   - Topic weightage matching actual GATE exam distribution

2. **Multi-Format Question Support**
   - MCQ (4 options)
   - Short Answer
   - Long Answer
   - Fill-in-the-Blank
   - Questions tagged with difficulty, topic, subject, and detailed solutions

3. **Smart Test Generation**
   - User-configurable test parameters (subjects, topics, difficulty, question types)
   - Randomized question selection
   - Input validation and helpful error messages

4. **Interactive Quiz Interface**
   - Adaptive input types based on question format
   - Real-time answer tracking
   - Question navigation palette
   - Flagging mechanism
   - Timer tracking
   - Progress indicator

5. **Performance Analysis**
   - Score calculation and accuracy metrics
   - Topic-wise performance breakdown
   - Difficulty-level analysis
   - Subject-wise comparison
   - Detailed question review with solutions

6. **AI-Powered Features (via Puter.js)**
   - Personalized motivational summaries after each test
   - AI-based answer evaluation for subjective questions
   - Semantic video recommendations based on weak topics
   - Streaming AI responses for better UX

7. **Video Library**
   - 9 curated YouTube playlists covering all GATE CSE topics
   - Embedded YouTube player
   - Subject-wise organization
   - Search functionality

8. **Progress Tracking**
   - localStorage-based persistence
   - Historical test performance trends
   - Topic mastery levels
   - Achievement milestones
   - Visual charts and graphs (using Recharts)

9. **Beautiful UI/UX**
   - Dark mode support
   - Responsive design (mobile, tablet, desktop)
   - Smooth animations and transitions
   - Loading states, error states, empty states
   - Accessibility-compliant

## Data Structure

### Syllabus (syllabus.json)
```json
{
  "sections": [
    {
      "id": "string",
      "name": "string",
      "weightage": number,
      "topics": [{ "id": "string", "name": "string", "subtopics": ["string"] }]
    }
  ]
}
```

### Questions (questions.json)
```json
{
  "questions": [
    {
      "id": "string",
      "type": "MCQ" | "short_answer" | "long_answer" | "fill_in_blank",
      "subject": "string",
      "topic": "string",
      "difficulty": "easy" | "medium" | "hard",
      "question_text": "string",
      "options": ["string"], // MCQ only
      "answer": "string",
      "solution": "string",
      "marks": number,
      "tags": ["string"]
    }
  ]
}
```

### Videos (videos.json)
```json
{
  "videos": [
    {
      "id": "string",
      "subject": "string",
      "topic": "string",
      "title": "string",
      "videoId": "string", // YouTube ID
      "thumbnail": "string",
      "duration": "string",
      "playlistId": "string"
    }
  ]
}
```

## User Flow

1. **Home** → Browse features, understand platform capabilities
2. **Practice** → Configure test (subjects, topics, difficulty, question types)
3. **Quiz** → Take test with interactive interface, navigation, timer
4. **Results** → View performance analysis, generate AI report, get video recommendations
5. **Progress** → Track improvement over time with charts and analytics
6. **Videos** → Browse video library, watch tutorials on weak topics

## Technical Implementation

### Frontend (client/)
- **Components**: Modular, reusable React components using Shadcn UI
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks + TanStack Query for server state
- **Styling**: Tailwind CSS with custom design tokens
- **Charts**: Recharts for analytics visualization
- **Fonts**: Inter (UI), JetBrains Mono (code snippets)

### Backend (server/)
- **API Routes**: Express.js REST endpoints
- **Storage**: MemStorage interface for in-memory data
- **YouTube Integration**: googleapis package with Replit connector
- **Question Generation**: Random selection with filtering logic
- **Answer Evaluation**: AI-powered for subjective questions

### AI Integration
- **Puter.js SDK**: Loaded via CDN in index.html
- **Models Used**:
  - GPT-5 nano: Fast recommendations and summaries
  - Claude: Detailed answer evaluation
- **Features**: Streaming responses, zero backend costs, user-pays model

## Development Notes

### Design Guidelines
- Follow `design_guidelines.md` for all UI implementations
- Use Inter font for UI, JetBrains Mono for code
- Consistent spacing using Tailwind spacing scale
- Hover/active states using elevate utilities
- Dark mode support throughout

### YouTube Playlists
1. DBMS: PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y
2. Computer Networks: PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_
3. Design and Analysis of Algorithms: PLxCzCOWd7aiHcmS4i14bI0VrMbZTUvlTa
4. Theory of Computation: PLxCzCOWd7aiFM9Lj5G9G_76adtyb4ef7i
5. Digital Logic: PLxCzCOWd7aiGmXg4NoX6R31AsC5LeCPHe
6. Operating Systems: PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p
7. Compiler Design: PLxCzCOWd7aiEKtKSIHYusizkESC42diyc
8. Computer Organization and Architecture: PLxCzCOWd7aiHMonh3G6QNKq53C6oNXGrX
9. Discrete Mathematics: PLxCzCOWd7aiH2wwES9vPWsEL6ipTaUSl3

## Future Enhancements (Next Phase)

- Custom question bank upload
- Spaced repetition algorithm
- Peer comparison features
- Detailed explanations for all answers
- Study planner with personalized schedules
- Mock GATE exam mode with exact timing
- Advanced analytics with heat maps
- Bookmark and note-taking features

## Running the Application

The workflow "Start application" runs `npm run dev` which starts both the Express server and Vite dev server on the same port (5000).

## Last Updated

January 26, 2025
