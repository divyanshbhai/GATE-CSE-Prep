import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTestConfigSchema, insertUserAnswersSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get syllabus
  app.get("/api/syllabus", async (req, res) => {
    try {
      const syllabus = await storage.getSyllabus();
      res.json(syllabus);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get all questions (for debugging)
  app.get("/api/questions", async (req, res) => {
    try {
      const questions = await storage.getAllQuestions();
      res.json(questions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Generate test
  app.post("/api/tests/generate", async (req, res) => {
    try {
      const config = insertTestConfigSchema.parse(req.body);
      const test = await storage.generateTest(config);
      res.json(test);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Evaluate test
  app.post("/api/tests/:testId/evaluate", async (req, res) => {
    try {
      const { testId } = req.params;
      const answers = insertUserAnswersSchema.parse(req.body);
      const result = await storage.evaluateTest(testId, answers);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get all videos
  app.get("/api/videos", async (req, res) => {
    try {
      const videos = await storage.getAllVideos();
      res.json(videos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get videos by subject
  app.get("/api/videos/subject/:subject", async (req, res) => {
    try {
      const { subject } = req.params;
      const videos = await storage.getVideosBySubject(subject);
      res.json(videos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get videos by topic
  app.get("/api/videos/topic/:topic", async (req, res) => {
    try {
      const { topic } = req.params;
      const videos = await storage.getVideosByTopic(topic);
      res.json(videos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // YouTube playlist fetcher endpoint (for initial data population)
  app.post("/api/youtube/fetch-playlists", async (req, res) => {
    try {
      // This will be implemented in Task 3 with actual YouTube API integration
      res.json({ message: "YouTube playlist fetching will be implemented in Task 3" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
