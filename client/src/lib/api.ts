import type { Test, TestConfig, TestResult, UserAnswer, Syllabus, Video } from "@shared/schema";

const API_BASE = "/api";

export const api = {
  // Syllabus
  async getSyllabus(): Promise<Syllabus> {
    const res = await fetch(`${API_BASE}/syllabus`);
    if (!res.ok) throw new Error("Failed to fetch syllabus");
    return res.json();
  },

  // Test Generation
  async generateTest(config: TestConfig): Promise<Test> {
    const res = await fetch(`${API_BASE}/tests/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to generate test");
    }
    return res.json();
  },

  // Test Evaluation
  async evaluateTest(testId: string, answers: UserAnswer[]): Promise<TestResult> {
    const res = await fetch(`${API_BASE}/tests/${testId}/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to evaluate test");
    }
    return res.json();
  },

  // Videos
  async getAllVideos(): Promise<Video[]> {
    const res = await fetch(`${API_BASE}/videos`);
    if (!res.ok) throw new Error("Failed to fetch videos");
    return res.json();
  },

  async getVideosBySubject(subject: string): Promise<Video[]> {
    const res = await fetch(`${API_BASE}/videos/subject/${encodeURIComponent(subject)}`);
    if (!res.ok) throw new Error("Failed to fetch videos");
    return res.json();
  },

  async getVideosByTopic(topic: string): Promise<Video[]> {
    const res = await fetch(`${API_BASE}/videos/topic/${encodeURIComponent(topic)}`);
    if (!res.ok) throw new Error("Failed to fetch videos");
    return res.json();
  },
};

// Puter.js AI Functions
declare const puter: any;

export const ai = {
  // Generate motivational summary using Claude
  async generateMotivationalReport(result: TestResult): Promise<string> {
    try {
      const prompt = `You are a supportive GATE CSE exam coach. A student just completed a practice test with the following performance:

Score: ${result.score_percentage.toFixed(1)}%
Accuracy: ${result.accuracy.toFixed(1)}%
Correct: ${result.question_results.filter(r => r.is_correct).length}/${result.total_questions}
Strong Topics: ${result.strong_topics.join(", ") || "None identified"}
Weak Topics: ${result.weak_topics.join(", ") || "None identified"}

Write a motivational, personalized 3-paragraph report (max 200 words) that:
1. Acknowledges their effort and highlights strengths
2. Identifies areas for improvement without being discouraging  
3. Provides specific, actionable next steps and encouragement

Keep the tone warm, supportive, and motivating. Focus on growth mindset.`;

      const response = await puter.ai.chat(prompt, { model: "claude" });
      return response;
    } catch (error) {
      console.error("AI report generation failed:", error);
      return "Great effort on your practice test! Keep practicing consistently and reviewing the topics where you need improvement. Your dedication will pay off!";
    }
  },

  // Evaluate subjective answers using AI
  async evaluateSubjectiveAnswer(question: string, correctAnswer: string, userAnswer: string): Promise<{
    isCorrect: boolean;
    feedback: string;
    score: number;
  }> {
    try {
      const prompt = `As a GATE CSE exam evaluator, assess this answer:

Question: ${question}
Expected Answer: ${correctAnswer}
Student's Answer: ${userAnswer}

Provide:
1. Score (0-100)
2. Whether it's correct (yes/no)
3. Brief feedback (1 sentence)

Format: SCORE|CORRECT|FEEDBACK`;

      const response = await puter.ai.chat(prompt, { model: "gpt-5-nano" });
      const parts = response.split("|");
      
      const score = parseInt(parts[0]) || 0;
      const isCorrect = parts[1]?.toLowerCase().includes("yes") || score >= 70;
      const feedback = parts[2] || "Answer evaluated";

      return { isCorrect, feedback, score };
    } catch (error) {
      console.error("AI evaluation failed:", error);
      return {
        isCorrect: false,
        feedback: "Unable to evaluate answer automatically",
        score: 0,
      };
    }
  },

  // Recommend videos based on weak topics
  async recommendVideos(weakTopics: string[]): Promise<string[]> {
    try {
      const prompt = `Based on these weak topics in GATE CSE: ${weakTopics.join(", ")}

Suggest 3 specific video tutorial topics that would help. Just list the topics, one per line.`;

      const response = await puter.ai.chat(prompt, { model: "gpt-5-nano" });
      return response.split("\n").filter((line: string) => line.trim().length > 0).slice(0, 3);
    } catch (error) {
      console.error("Video recommendation failed:", error);
      return weekTopics.map(topic => `${topic} - Complete Tutorial`);
    }
  },
};

// Progress Tracking
export const progress = {
  getProgress() {
    const stored = localStorage.getItem("user_progress");
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      totalTests: 0,
      totalQuestions: 0,
      overallAccuracy: 0,
      testHistory: [],
      topicMastery: [],
      subjectProgress: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  updateProgress(result: TestResult) {
    const current = this.getProgress();

    // Update test history
    current.testHistory.push({
      test_id: result.test_id,
      date: new Date().toISOString().split("T")[0],
      score: result.score_percentage,
      accuracy: result.accuracy,
    });

    // Update totals
    current.totalTests++;
    current.totalQuestions += result.total_questions;

    // Recalculate overall accuracy
    const allResults = current.testHistory;
    current.overallAccuracy = allResults.length > 0
      ? allResults.reduce((sum: number, t: any) => sum + t.accuracy, 0) / allResults.length
      : 0;

    // Update topic mastery
    const topicMap = new Map();
    for (const qr of result.question_results) {
      const topic = qr.question.topic;
      if (!topicMap.has(topic)) {
        topicMap.set(topic, { attempts: 0, correct: 0 });
      }
      const tm = topicMap.get(topic);
      tm.attempts++;
      if (qr.is_correct) tm.correct++;
    }

    // Merge with existing topic mastery
    for (const [topic, data] of topicMap) {
      const existing = current.topicMastery.find((tm: any) => tm.topic === topic);
      if (existing) {
        existing.attempts += data.attempts;
        existing.correct += data.correct;
        existing.accuracy = (existing.correct / existing.attempts) * 100;
        existing.last_practiced = new Date().toISOString();
      } else {
        current.topicMastery.push({
          topic,
          subject: result.question_results.find(qr => qr.question.topic === topic)?.question.subject || "",
          attempts: data.attempts,
          correct: data.correct,
          accuracy: (data.correct / data.attempts) * 100,
          last_practiced: new Date().toISOString(),
        });
      }
    }

    // Update subject progress
    for (const sb of result.subject_breakdown) {
      const existing = current.subjectProgress.find((sp: any) => sp.subject === sb.subject);
      if (existing) {
        existing.total_questions += sb.total;
        existing.correct += sb.correct;
        existing.accuracy = (existing.correct / existing.total_questions) * 100;
      } else {
        current.subjectProgress.push({
          subject: sb.subject,
          total_questions: sb.total,
          correct: sb.correct,
          accuracy: sb.percentage,
        });
      }
    }

    current.updated_at = new Date().toISOString();
    localStorage.setItem("user_progress", JSON.stringify(current));
    return current;
  },
};
