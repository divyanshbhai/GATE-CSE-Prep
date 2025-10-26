import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Flag,
  Send
} from "lucide-react";
import type { Question, UserAnswer } from "@shared/schema";

export default function Quiz() {
  const [, setLocation] = useLocation();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, UserAnswer>>(new Map());
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timeSpent, setTimeSpent] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  useEffect(() => {
    // Load test config and generate questions
    const configStr = localStorage.getItem("current_test_config");
    if (!configStr) {
      setLocation("/practice");
      return;
    }

    const testStr = localStorage.getItem("current_test");
    if (testStr) {
      // Resume existing test
      const test = JSON.parse(testStr);
      setQuestions(test.questions);
    } else {
      // Generate new test
      import("@/lib/api").then(({ api }) => {
        const config = JSON.parse(configStr);
        api.generateTest(config).then(test => {
          setQuestions(test.questions);
          localStorage.setItem("current_test", JSON.stringify(test));
        }).catch(error => {
          console.error("Failed to generate test:", error);
          setLocation("/practice");
        });
      });
    }

    // Timer
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [setLocation]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const handleAnswer = (value: string) => {
    if (!currentQuestion) return;

    const timeOnQuestion = Math.floor((Date.now() - questionStartTime) / 1000);
    
    setAnswers(prev => {
      const newAnswers = new Map(prev);
      newAnswers.set(currentQuestion.id, {
        question_id: currentQuestion.id,
        answer: value,
        time_spent: (prev.get(currentQuestion.id)?.time_spent || 0) + timeOnQuestion,
      });
      return newAnswers;
    });

    setQuestionStartTime(Date.now());
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setQuestionStartTime(Date.now());
    }
  };

  const handleToggleFlag = () => {
    if (!currentQuestion) return;
    setFlagged(prev => {
      const newFlagged = new Set(prev);
      if (newFlagged.has(currentQuestion.id)) {
        newFlagged.delete(currentQuestion.id);
      } else {
        newFlagged.add(currentQuestion.id);
      }
      return newFlagged;
    });
  };

  const handleSubmit = () => {
    // Store answers and navigate to results
    const answersArray = Array.from(answers.values());
    const testStr = localStorage.getItem("current_test");
    if (testStr) {
      const test = JSON.parse(testStr);
      localStorage.setItem("quiz_test_id", test.test_id);
    }
    localStorage.setItem("quiz_answers", JSON.stringify(answersArray));
    localStorage.setItem("quiz_total_time", timeSpent.toString());
    setLocation("/results");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    );
  }

  const currentAnswer = answers.get(currentQuestion?.id || "")?.answer || "";

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="gap-1" data-testid="badge-progress">
                Question {currentQuestionIndex + 1} of {questions.length}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(timeSpent)}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleFlag}
                data-testid="button-flag"
                className={flagged.has(currentQuestion?.id || "") ? "border-chart-4 bg-chart-4/10" : ""}
              >
                <Flag className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowSubmitDialog(true)}
                data-testid="button-submit-quiz"
              >
                <Send className="mr-1 h-4 w-4" />
                Submit Test
              </Button>
            </div>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </div>

      {/* Question */}
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card className="shadow-lg">
          <CardContent className="p-8 md:p-12">
            {/* Question Header */}
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{currentQuestion.subject}</Badge>
              <Badge variant="outline">{currentQuestion.topic}</Badge>
              <Badge 
                variant={
                  currentQuestion.difficulty === "easy" ? "secondary" :
                  currentQuestion.difficulty === "hard" ? "destructive" : "default"
                }
                className="capitalize"
              >
                {currentQuestion.difficulty}
              </Badge>
              <Badge variant="outline">{currentQuestion.marks} marks</Badge>
            </div>

            {/* Question Text */}
            <div className="mb-8">
              <p className="text-lg leading-relaxed" data-testid="text-question">
                {currentQuestion.question_text}
              </p>
            </div>

            {/* Answer Input */}
            <div className="space-y-3">
              {currentQuestion.type === "MCQ" && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const optionLabel = String.fromCharCode(65 + index); // A, B, C, D
                    const isSelected = currentAnswer === option;

                    return (
                      <div
                        key={index}
                        onClick={() => handleAnswer(option)}
                        className={`
                          flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition-all
                          hover-elevate active-elevate-2
                          ${isSelected ? "border-primary bg-primary/5" : "border-border"}
                        `}
                        data-testid={`option-${index}`}
                      >
                        <div className={`
                          flex h-8 w-8 items-center justify-center rounded-full border-2 font-semibold
                          ${isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground text-muted-foreground"}
                        `}>
                          {optionLabel}
                        </div>
                        <div className="flex-1 text-base">{option}</div>
                      </div>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === "short_answer" && (
                <Textarea
                  placeholder="Enter your answer here..."
                  value={currentAnswer}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="min-h-32 resize-none text-base"
                  data-testid="input-short-answer"
                />
              )}

              {currentQuestion.type === "long_answer" && (
                <Textarea
                  placeholder="Enter your detailed answer here..."
                  value={currentAnswer}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="min-h-64 resize-none text-base"
                  data-testid="input-long-answer"
                />
              )}

              {currentQuestion.type === "fill_in_blank" && (
                <Input
                  placeholder="Enter your answer"
                  value={currentAnswer}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="text-base"
                  data-testid="input-fill-blank"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            data-testid="button-previous"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {questions.map((q, index) => {
              const isAnswered = answers.has(q.id);
              const isFlagged = flagged.has(q.id);
              const isCurrent = index === currentQuestionIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentQuestionIndex(index);
                    setQuestionStartTime(Date.now());
                  }}
                  className={`
                    h-8 w-8 rounded-md text-sm font-medium transition-all
                    hover-elevate active-elevate-2
                    ${isCurrent ? "bg-primary text-primary-foreground" :
                      isAnswered ? "bg-chart-2 text-white" :
                      isFlagged ? "bg-chart-4 text-white" :
                      "bg-muted text-muted-foreground"}
                  `}
                  data-testid={`nav-question-${index}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          <Button
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
            data-testid="button-next"
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        {/* Status Legend */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-chart-2" />
            <span className="text-muted-foreground">Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-chart-4" />
            <span className="text-muted-foreground">Flagged</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-muted" />
            <span className="text-muted-foreground">Not Answered</span>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Test?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {answers.size} out of {questions.length} questions.
              {answers.size < questions.length && " Some questions remain unanswered."}
              {" "}Are you sure you want to submit?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-submit">Continue Test</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} data-testid="button-confirm-submit">
              Submit & View Results
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
