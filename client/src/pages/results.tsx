import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Award,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Video,
  BarChart3,
  Sparkles,
  RefreshCw
} from "lucide-react";

export default function Results() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [aiReportLoading, setAiReportLoading] = useState(false);
  const [aiReport, setAiReport] = useState<string>("");

  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    // Check if quiz was completed
    const answersStr = localStorage.getItem("quiz_answers");
    const testId = localStorage.getItem("quiz_test_id");
    
    if (!answersStr || !testId) {
      setLocation("/practice");
      return;
    }

    // Evaluate test
    import("@/lib/api").then(({ api, progress }) => {
      const answers = JSON.parse(answersStr);
      
      api.evaluateTest(testId, answers).then(result => {
        setTestResult(result);
        setLoading(false);
        
        // Update progress
        progress.updateProgress(result);
        
        // Clean up localStorage
        localStorage.removeItem("current_test_config");
        localStorage.removeItem("current_test");
        localStorage.removeItem("quiz_test_id");
        localStorage.removeItem("quiz_answers");
        localStorage.removeItem("quiz_total_time");
      }).catch(error => {
        console.error("Failed to evaluate test:", error);
        setLocation("/practice");
      });
    });
  }, [setLocation]);

  const generateAIReport = async () => {
    if (!testResult) return;
    
    setAiReportLoading(true);
    try {
      const { ai } = await import("@/lib/api");
      const report = await ai.generateMotivationalReport(testResult);
      setAiReport(report);
    } catch (error) {
      setAiReport("Unable to generate AI report at this time. Please try again later.");
    } finally {
      setAiReportLoading(false);
    }
  };

  if (loading || !testResult) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-primary">
            <BarChart3 className="mx-auto h-12 w-12 animate-pulse" />
          </div>
          <p className="text-lg font-medium">Analyzing your performance...</p>
        </div>
      </div>
    );
  }

  const correctAnswers = testResult.question_results.filter((r: any) => r.is_correct).length;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-gradient-to-br from-primary to-chart-2 p-4">
              <Award className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">Test Completed!</h1>
          <p className="text-lg text-muted-foreground">
            Here's your detailed performance analysis
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Performance Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Score Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Score Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="text-center">
                    <div className="mb-2 text-4xl font-bold text-primary" data-testid="text-score">
                      {testResult.score_percentage.toFixed(0)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Overall Score</div>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 text-4xl font-bold text-chart-2" data-testid="text-accuracy">
                      {testResult.accuracy.toFixed(0)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 flex items-center justify-center gap-2 text-4xl font-bold">
                      <Clock className="h-8 w-8" />
                      {Math.floor(testResult.total_time / 60)}m
                    </div>
                    <div className="text-sm text-muted-foreground" data-testid="text-time">Time Taken</div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Questions Answered</span>
                    <span className="font-semibold">{correctAnswers} / {testResult.total_questions}</span>
                  </div>
                  <Progress value={(correctAnswers / testResult.total_questions) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Topic Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Topic-wise Performance
                </CardTitle>
                <CardDescription>
                  Your strengths and areas needing improvement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-chart-2" />
                    <span className="font-semibold">Strong Topics</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {testResult.strong_topics.length > 0 ? testResult.strong_topics.map((topic: string) => (
                      <Badge key={topic} variant="secondary" className="bg-chart-2/10 text-chart-2 border-chart-2/20">
                        {topic}
                      </Badge>
                    )) : <span className="text-sm text-muted-foreground italic">Practice more to identify strengths</span>}
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-chart-4" />
                    <span className="font-semibold">Needs Improvement</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {testResult.weak_topics.length > 0 ? testResult.weak_topics.map((topic: string) => (
                      <Badge key={topic} variant="secondary" className="bg-chart-4/10 text-chart-4 border-chart-4/20">
                        {topic}
                      </Badge>
                    )) : <span className="text-sm text-muted-foreground italic">Great! No weak areas identified</span>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Report */}
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-chart-3/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI-Powered Motivational Report
                </CardTitle>
                <CardDescription>
                  Personalized feedback and study recommendations from AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                {aiReport ? (
                  <div className="space-y-4">
                    <div className="rounded-lg bg-background/50 p-4 text-sm leading-relaxed" data-testid="text-ai-report">
                      {aiReport.split("\n\n").map((paragraph, index) => (
                        <p key={index} className="mb-3 last:mb-0">{paragraph}</p>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateAIReport}
                      disabled={aiReportLoading}
                      data-testid="button-regenerate-report"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate Report
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Button
                      onClick={generateAIReport}
                      disabled={aiReportLoading}
                      size="lg"
                      className="gap-2"
                      data-testid="button-generate-report"
                    >
                      {aiReportLoading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Generating AI Report...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          Generate AI Report
                        </>
                      )}
                    </Button>
                    <p className="mt-3 text-sm text-muted-foreground">
                      Get personalized feedback and study recommendations powered by AI
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Question Review */}
            <Card>
              <CardHeader>
                <CardTitle>Question Review</CardTitle>
                <CardDescription>
                  Review your answers and see detailed solutions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="q1">
                    <AccordionTrigger>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-chart-2" />
                        <span>Question 1: QuickSort Complexity</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pl-8">
                        <div>
                          <div className="mb-1 text-sm font-medium text-muted-foreground">Your Answer</div>
                          <Badge variant="secondary" className="bg-chart-2/10 text-chart-2">O(n log n) ✓</Badge>
                        </div>
                        <div>
                          <div className="mb-1 text-sm font-medium text-muted-foreground">Solution</div>
                          <p className="text-sm leading-relaxed">
                            QuickSort divides the array into partitions and recursively sorts them. In the average case, 
                            the partitioning is balanced, leading to O(n log n) complexity.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="q2">
                    <AccordionTrigger>
                      <div className="flex items-center gap-3">
                        <XCircle className="h-5 w-5 text-destructive" />
                        <span>Question 2: Deadlock Conditions</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pl-8">
                        <div>
                          <div className="mb-1 text-sm font-medium text-muted-foreground">Your Answer</div>
                          <div className="text-sm">Mutual Exclusion, Hold and Wait</div>
                        </div>
                        <div>
                          <div className="mb-1 text-sm font-medium text-muted-foreground">Correct Answer</div>
                          <Badge variant="secondary">Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait</Badge>
                        </div>
                        <div>
                          <div className="mb-1 text-sm font-medium text-muted-foreground">Solution</div>
                          <p className="text-sm leading-relaxed">
                            The four Coffman conditions are: (1) Mutual Exclusion - resources cannot be shared, 
                            (2) Hold and Wait - processes hold resources while waiting for others, 
                            (3) No Preemption - resources cannot be forcibly taken, 
                            (4) Circular Wait - circular chain of processes waiting for resources.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Video Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Video className="h-5 w-5" />
                  Recommended Videos
                </CardTitle>
                <CardDescription>
                  Based on your weak areas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {testResult.weak_topics.slice(0, 2).map((topic: string, index: number) => (
                  <div key={index} className="group cursor-pointer rounded-lg border p-3 transition-all hover-elevate">
                    <div className="mb-2 font-semibold text-sm">{topic} Tutorial</div>
                    <p className="mb-2 text-xs text-muted-foreground">
                      Complete explanation with examples
                    </p>
                    <Badge variant="outline" className="text-xs">15 min</Badge>
                  </div>
                ))}
                <Link href="/videos">
                  <Button variant="outline" className="w-full" data-testid="button-browse-videos">
                    Browse All Videos
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="space-y-3 pt-6">
                <Link href="/practice">
                  <Button className="w-full gap-2" data-testid="button-new-test">
                    <RefreshCw className="h-4 w-4" />
                    Take Another Test
                  </Button>
                </Link>
                <Link href="/progress">
                  <Button variant="outline" className="w-full gap-2" data-testid="button-view-progress">
                    <TrendingUp className="h-4 w-4" />
                    View Progress
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
