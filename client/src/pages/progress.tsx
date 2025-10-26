import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  Clock,
  Target,
  BookOpen,
  Calendar,
  Award,
  BarChart3,
  RefreshCw
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function ProgressPage() {
  const [progressData, setProgressData] = useState<any>(null);

  useEffect(() => {
    // Load progress from localStorage
    import("@/lib/api").then(({ progress }) => {
      const data = progress.getProgress();
      setProgressData(data);
    });
  }, []);

  if (!progressData || progressData.totalTests === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="max-w-md text-center">
          <BarChart3 className="mx-auto h-16 w-16 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-bold">No Practice History Yet</h2>
          <p className="mt-2 text-muted-foreground">
            Start taking practice tests to track your progress and improvement over time
          </p>
          <Link href="/practice">
            <Button className="mt-6" data-testid="button-start-practice">
              <Target className="mr-2 h-4 w-4" />
              Start Your First Test
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const chartColors = {
    primary: "hsl(var(--chart-1))",
    secondary: "hsl(var(--chart-2))",
    tertiary: "hsl(var(--chart-3))",
    quaternary: "hsl(var(--chart-4))",
    quinary: "hsl(var(--chart-5))",
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">Your Progress</h1>
        <p className="text-lg text-muted-foreground">
          Track your improvement and identify areas for focused practice
        </p>
      </div>

      {/* Overview Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-1 text-sm font-medium text-muted-foreground">Total Tests</div>
                <div className="text-3xl font-bold" data-testid="text-total-tests">{progressData.totalTests}</div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-1 text-sm font-medium text-muted-foreground">Questions Attempted</div>
                <div className="text-3xl font-bold" data-testid="text-total-questions">{progressData.totalQuestions}</div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                <Target className="h-6 w-6 text-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-1 text-sm font-medium text-muted-foreground">Overall Accuracy</div>
                <div className="text-3xl font-bold text-chart-2" data-testid="text-overall-accuracy">{progressData.overallAccuracy}%</div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                <TrendingUp className="h-6 w-6 text-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-1 text-sm font-medium text-muted-foreground">Study Streak</div>
                <div className="text-3xl font-bold text-chart-4">3 days</div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
                <Calendar className="h-6 w-6 text-chart-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="performance" data-testid="tab-performance">Performance Trends</TabsTrigger>
          <TabsTrigger value="topics" data-testid="tab-topics">Topic Mastery</TabsTrigger>
          <TabsTrigger value="subjects" data-testid="tab-subjects">Subject Breakdown</TabsTrigger>
        </TabsList>

        {/* Performance Trends Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Score Progress Over Time</CardTitle>
              <CardDescription>
                Track how your scores have improved across multiple attempts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressData.testHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke={chartColors.primary}
                    strokeWidth={3}
                    dot={{ fill: chartColors.primary, r: 5 }}
                    name="Score (%)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke={chartColors.secondary}
                    strokeWidth={3}
                    dot={{ fill: chartColors.secondary, r: 5 }}
                    name="Accuracy (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Latest Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressData.testHistory.slice(-3).reverse().map((test: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{test.date}</div>
                          <div className="text-xs text-muted-foreground">Practice Test</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{test.score}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Achievement Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
                      <Award className="h-5 w-5 text-chart-2" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">5 Tests Completed</div>
                      <ProgressBar value={100} className="mt-1 h-1.5" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/10">
                      <Target className="h-5 w-5 text-chart-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">50 Questions Answered</div>
                      <ProgressBar value={50} className="mt-1 h-1.5" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                      <TrendingUp className="h-5 w-5 text-chart-3" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">75% Accuracy Goal</div>
                      <ProgressBar value={75} className="mt-1 h-1.5" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Topic Mastery Tab */}
        <TabsContent value="topics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Topic-wise Mastery Levels</CardTitle>
              <CardDescription>
                Your performance across different topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progressData.topicMastery.map((topic: any, index: number) => (
                  <div key={index}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="font-medium">{topic.topic}</div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
                          {topic.correct}/{topic.attempts} correct
                        </span>
                        <Badge 
                          variant={topic.accuracy >= 80 ? "default" : topic.accuracy >= 60 ? "secondary" : "destructive"}
                          data-testid={`badge-topic-${index}`}
                        >
                          {topic.accuracy}%
                        </Badge>
                      </div>
                    </div>
                    <ProgressBar 
                      value={topic.accuracy} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subject Breakdown Tab */}
        <TabsContent value="subjects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Performance</CardTitle>
              <CardDescription>
                Comparison across GATE CSE subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={progressData.subjectProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="subject" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Bar 
                    dataKey="accuracy" 
                    fill={chartColors.primary}
                    radius={[8, 8, 0, 0]}
                    name="Accuracy (%)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link href="/practice">
          <Button size="lg" className="gap-2" data-testid="button-continue-practice">
            <Target className="h-5 w-5" />
            Continue Practice
          </Button>
        </Link>
        <Button 
          variant="outline" 
          size="lg"
          className="gap-2"
          onClick={() => {
            localStorage.removeItem("user_progress");
            window.location.reload();
          }}
          data-testid="button-reset-progress"
        >
          <RefreshCw className="h-4 w-4" />
          Reset Progress
        </Button>
      </div>
    </div>
  );
}
