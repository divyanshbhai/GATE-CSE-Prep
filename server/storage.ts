import type { 
  Question, 
  Test, 
  TestConfig, 
  UserAnswer, 
  TestResult, 
  QuestionResult,
  Video,
  Syllabus
} from "@shared/schema";
import { randomUUID } from "crypto";
import syllabusData from "./data/syllabus.json";
import questionsData from "./data/questions.json";
import videosData from "./data/videos.json";

export interface IStorage {
  // Syllabus
  getSyllabus(): Promise<Syllabus>;
  
  // Questions
  getAllQuestions(): Promise<Question[]>;
  getQuestionsByFilters(filters: {
    subjects?: string[];
    topics?: string[];
    difficulty?: string[];
    types?: string[];
  }): Promise<Question[]>;
  
  // Test Generation
  generateTest(config: TestConfig): Promise<Test>;
  
  // Answer Evaluation
  evaluateTest(testId: string, answers: UserAnswer[]): Promise<TestResult>;
  
  // Videos
  getAllVideos(): Promise<Video[]>;
  getVideosBySubject(subject: string): Promise<Video[]>;
  getVideosByTopic(topic: string): Promise<Video[]>;
}

export class MemStorage implements IStorage {
  private syllabus: Syllabus;
  private questions: Question[];
  private videos: Video[];
  private tests: Map<string, Test>;

  constructor() {
    this.syllabus = syllabusData as Syllabus;
    this.questions = (questionsData as any).questions || [];
    this.videos = (videosData as any).videos || [];
    this.tests = new Map();
  }

  async getSyllabus(): Promise<Syllabus> {
    return this.syllabus;
  }

  async getAllQuestions(): Promise<Question[]> {
    return this.questions;
  }

  async getQuestionsByFilters(filters: {
    subjects?: string[];
    topics?: string[];
    difficulty?: string[];
    types?: string[];
  }): Promise<Question[]> {
    return this.questions.filter(q => {
      // Filter by subjects
      if (filters.subjects && filters.subjects.length > 0) {
        const normalizedSubject = q.subject.toLowerCase().replace(/\s+/g, "_");
        const matchesSubject = filters.subjects.some(s => {
          const normalizedFilter = s.toLowerCase().replace(/\s+/g, "_");
          return normalizedSubject.includes(normalizedFilter) || normalizedFilter.includes(normalizedSubject);
        });
        if (!matchesSubject) return false;
      }

      // Filter by topics
      if (filters.topics && filters.topics.length > 0) {
        const matchesTopic = filters.topics.some(t => 
          q.topic.toLowerCase().includes(t.toLowerCase()) || 
          t.toLowerCase().includes(q.topic.toLowerCase())
        );
        if (!matchesTopic) return false;
      }

      // Filter by difficulty
      if (filters.difficulty && filters.difficulty.length > 0) {
        if (!filters.difficulty.includes(q.difficulty)) return false;
      }

      // Filter by question types
      if (filters.types && filters.types.length > 0) {
        if (!filters.types.includes(q.type)) return false;
      }

      return true;
    });
  }

  async generateTest(config: TestConfig): Promise<Test> {
    // Get filtered questions
    const filteredQuestions = await this.getQuestionsByFilters({
      subjects: config.subjects,
      topics: config.topics,
      difficulty: config.difficulty,
      types: config.questionTypes,
    });

    if (filteredQuestions.length === 0) {
      throw new Error("No questions match the specified criteria");
    }

    // Randomize and select questions
    const shuffled = filteredQuestions.sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, Math.min(config.num_questions, shuffled.length));

    // Create test
    const test: Test = {
      test_id: randomUUID(),
      config,
      questions: selectedQuestions,
      created_at: new Date().toISOString(),
    };

    this.tests.set(test.test_id, test);
    return test;
  }

  async evaluateTest(testId: string, answers: UserAnswer[]): Promise<TestResult> {
    const test = this.tests.get(testId);
    if (!test) {
      throw new Error("Test not found");
    }

    const questionResults: QuestionResult[] = [];
    let totalMarks = 0;
    let marksObtained = 0;

    // Create answer map for quick lookup
    const answerMap = new Map(answers.map(a => [a.question_id, a]));

    // Evaluate each question
    for (const question of test.questions) {
      const userAnswer = answerMap.get(question.id);
      const userAnswerText = userAnswer?.answer || "";
      
      // Determine if answer is correct (basic string comparison)
      // For subjective questions, this would be enhanced with AI evaluation
      const isCorrect = this.isAnswerCorrect(question, userAnswerText);
      const marksAwarded = isCorrect ? question.marks : 0;

      totalMarks += question.marks;
      marksObtained += marksAwarded;

      questionResults.push({
        question_id: question.id,
        question,
        user_answer: userAnswerText,
        correct_answer: question.answer,
        is_correct: isCorrect,
        marks_awarded: marksAwarded,
        time_spent: userAnswer?.time_spent || 0,
      });
    }

    // Calculate topic performance
    const topicPerformance = new Map<string, { correct: number; total: number }>();
    for (const result of questionResults) {
      const topic = result.question.topic;
      if (!topicPerformance.has(topic)) {
        topicPerformance.set(topic, { correct: 0, total: 0 });
      }
      const perf = topicPerformance.get(topic)!;
      perf.total++;
      if (result.is_correct) perf.correct++;
    }

    // Identify strong and weak topics
    const strongTopics: string[] = [];
    const weakTopics: string[] = [];
    topicPerformance.forEach((perf, topic) => {
      const accuracy = (perf.correct / perf.total) * 100;
      if (accuracy >= 70) {
        strongTopics.push(topic);
      } else if (accuracy < 50) {
        weakTopics.push(topic);
      }
    });

    // Calculate difficulty breakdown
    const difficultyBreakdown = {
      easy: { correct: 0, total: 0 },
      medium: { correct: 0, total: 0 },
      hard: { correct: 0, total: 0 },
    };

    for (const result of questionResults) {
      const diff = result.question.difficulty;
      difficultyBreakdown[diff].total++;
      if (result.is_correct) {
        difficultyBreakdown[diff].correct++;
      }
    }

    // Calculate subject breakdown
    const subjectPerformance = new Map<string, { correct: number; total: number }>();
    for (const result of questionResults) {
      const subject = result.question.subject;
      if (!subjectPerformance.has(subject)) {
        subjectPerformance.set(subject, { correct: 0, total: 0 });
      }
      const perf = subjectPerformance.get(subject)!;
      perf.total++;
      if (result.is_correct) perf.correct++;
    }

    const subjectBreakdown = Array.from(subjectPerformance.entries()).map(([subject, perf]) => ({
      subject,
      correct: perf.correct,
      total: perf.total,
      percentage: (perf.correct / perf.total) * 100,
    }));

    // Calculate total time
    const totalTime = answers.reduce((sum, a) => sum + (a.time_spent || 0), 0);

    const result: TestResult = {
      test_id: testId,
      completed_at: new Date().toISOString(),
      total_questions: test.questions.length,
      total_marks: totalMarks,
      marks_obtained: marksObtained,
      score_percentage: totalMarks > 0 ? (marksObtained / totalMarks) * 100 : 0,
      accuracy: questionResults.length > 0 
        ? (questionResults.filter(r => r.is_correct).length / questionResults.length) * 100 
        : 0,
      total_time: totalTime,
      question_results: questionResults,
      strong_topics: strongTopics,
      weak_topics: weakTopics,
      difficulty_breakdown: difficultyBreakdown,
      subject_breakdown: subjectBreakdown,
    };

    return result;
  }

  private isAnswerCorrect(question: Question, userAnswer: string): boolean {
    const normalizedUserAnswer = userAnswer.toLowerCase().trim();
    const normalizedCorrectAnswer = question.answer.toLowerCase().trim();

    // For MCQ and fill-in-blank, exact match (case-insensitive)
    if (question.type === "MCQ" || question.type === "fill_in_blank") {
      return normalizedUserAnswer === normalizedCorrectAnswer;
    }

    // For short answer, check if the answer contains key terms
    if (question.type === "short_answer") {
      // Simple keyword matching - could be enhanced with AI
      return normalizedUserAnswer.includes(normalizedCorrectAnswer) ||
             normalizedCorrectAnswer.includes(normalizedUserAnswer);
    }

    // For long answer, would use AI evaluation in production
    // For now, basic keyword matching
    if (question.type === "long_answer") {
      const correctKeywords = normalizedCorrectAnswer.split(/\s+/).filter(w => w.length > 3);
      const matchedKeywords = correctKeywords.filter(kw => normalizedUserAnswer.includes(kw));
      return matchedKeywords.length >= correctKeywords.length * 0.5; // 50% keyword match
    }

    return false;
  }

  async getAllVideos(): Promise<Video[]> {
    return this.videos;
  }

  async getVideosBySubject(subject: string): Promise<Video[]> {
    return this.videos.filter(v => 
      v.subject.toLowerCase().includes(subject.toLowerCase()) ||
      subject.toLowerCase().includes(v.subject.toLowerCase())
    );
  }

  async getVideosByTopic(topic: string): Promise<Video[]> {
    return this.videos.filter(v => 
      v.topic.toLowerCase().includes(topic.toLowerCase()) ||
      topic.toLowerCase().includes(v.topic.toLowerCase())
    );
  }
}

export const storage = new MemStorage();
