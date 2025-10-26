import { z } from "zod";

// ============= GATE Syllabus Schema =============

export const syllabusSchema = z.object({
  sections: z.array(z.object({
    id: z.string(),
    name: z.string(),
    weightage: z.number(), // percentage of GATE exam
    topics: z.array(z.object({
      id: z.string(),
      name: z.string(),
      subtopics: z.array(z.string()).optional(),
    })),
  })),
});

export type Syllabus = z.infer<typeof syllabusSchema>;

// ============= Question Schema =============

export const questionTypeSchema = z.enum(["MCQ", "short_answer", "long_answer", "fill_in_blank"]);
export const difficultySchema = z.enum(["easy", "medium", "hard"]);

export const questionSchema = z.object({
  id: z.string(),
  type: questionTypeSchema,
  subject: z.string(),
  topic: z.string(),
  difficulty: difficultySchema,
  question_text: z.string(),
  options: z.array(z.string()).optional(), // For MCQ only (exactly 4)
  answer: z.string(),
  solution: z.string(), // Detailed explanation
  marks: z.number(),
  tags: z.array(z.string()).optional(),
});

export type Question = z.infer<typeof questionSchema>;
export type QuestionType = z.infer<typeof questionTypeSchema>;
export type Difficulty = z.infer<typeof difficultySchema>;

// ============= Video Schema =============

export const videoSchema = z.object({
  id: z.string(),
  subject: z.string(),
  topic: z.string(),
  title: z.string(),
  videoId: z.string(), // YouTube video ID
  thumbnail: z.string(),
  duration: z.string(),
  playlistId: z.string(),
});

export type Video = z.infer<typeof videoSchema>;

// ============= Test Schema =============

export const testConfigSchema = z.object({
  subjects: z.array(z.string()).min(1, "Select at least one subject"),
  topics: z.array(z.string()).optional(),
  difficulty: z.array(difficultySchema).optional(),
  num_questions: z.number().min(1).max(100),
  questionTypes: z.array(questionTypeSchema).optional(),
});

export type TestConfig = z.infer<typeof testConfigSchema>;

export const testSchema = z.object({
  test_id: z.string(),
  config: testConfigSchema,
  questions: z.array(questionSchema),
  created_at: z.string(),
});

export type Test = z.infer<typeof testSchema>;

// ============= User Answer Schema =============

export const userAnswerSchema = z.object({
  question_id: z.string(),
  answer: z.string(),
  time_spent: z.number(), // seconds
});

export type UserAnswer = z.infer<typeof userAnswerSchema>;

// ============= Test Result Schema =============

export const questionResultSchema = z.object({
  question_id: z.string(),
  question: questionSchema,
  user_answer: z.string(),
  correct_answer: z.string(),
  is_correct: z.boolean(),
  ai_evaluation: z.string().optional(), // For subjective questions
  marks_awarded: z.number(),
  time_spent: z.number(),
});

export type QuestionResult = z.infer<typeof questionResultSchema>;

export const testResultSchema = z.object({
  test_id: z.string(),
  completed_at: z.string(),
  total_questions: z.number(),
  total_marks: z.number(),
  marks_obtained: z.number(),
  score_percentage: z.number(),
  accuracy: z.number(),
  total_time: z.number(), // seconds
  question_results: z.array(questionResultSchema),
  strong_topics: z.array(z.string()),
  weak_topics: z.array(z.string()),
  difficulty_breakdown: z.object({
    easy: z.object({ correct: z.number(), total: z.number() }),
    medium: z.object({ correct: z.number(), total: z.number() }),
    hard: z.object({ correct: z.number(), total: z.number() }),
  }),
  subject_breakdown: z.array(z.object({
    subject: z.string(),
    correct: z.number(),
    total: z.number(),
    percentage: z.number(),
  })),
});

export type TestResult = z.infer<typeof testResultSchema>;

// ============= AI Report Schema =============

export const aiReportSchema = z.object({
  test_id: z.string(),
  motivational_message: z.string(),
  study_recommendations: z.array(z.string()),
  recommended_videos: z.array(videoSchema),
  next_steps: z.array(z.string()),
  generated_at: z.string(),
});

export type AIReport = z.infer<typeof aiReportSchema>;

// ============= Progress Tracking Schema =============

export const progressSchema = z.object({
  user_id: z.string().optional(), // For localStorage, can be browser fingerprint
  total_tests: z.number(),
  total_questions_attempted: z.number(),
  overall_accuracy: z.number(),
  test_history: z.array(z.object({
    test_id: z.string(),
    date: z.string(),
    score: z.number(),
    accuracy: z.number(),
  })),
  topic_mastery: z.array(z.object({
    topic: z.string(),
    subject: z.string(),
    attempts: z.number(),
    correct: z.number(),
    accuracy: z.number(),
    last_practiced: z.string(),
  })),
  difficulty_progress: z.object({
    easy: z.number(),
    medium: z.number(),
    hard: z.number(),
  }),
  subject_progress: z.array(z.object({
    subject: z.string(),
    total_questions: z.number(),
    correct: z.number(),
    accuracy: z.number(),
  })),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Progress = z.infer<typeof progressSchema>;

// ============= Insert Schemas for Backend =============

export const insertTestConfigSchema = testConfigSchema;
export const insertUserAnswersSchema = z.array(userAnswerSchema);

export type InsertTestConfig = z.infer<typeof insertTestConfigSchema>;
export type InsertUserAnswers = z.infer<typeof insertUserAnswersSchema>;
