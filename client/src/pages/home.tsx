import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Brain, 
  TrendingUp, 
  Video, 
  CheckCircle2, 
  Sparkles,
  Target,
  Clock,
  Award
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="container relative mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6" variant="secondary" data-testid="badge-gate-2026">
              <Sparkles className="mr-1 h-3 w-3" />
              GATE CSE 2026 Preparation
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Master GATE CSE with{" "}
              <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                AI-Powered
              </span>{" "}
              Practice
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground md:text-xl">
              Practice with authentic GATE-style questions, get personalized AI feedback, 
              and track your progress across all 10 sections. Powered by advanced AI for 
              intelligent recommendations and motivational support.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/practice">
                <Button size="lg" className="gap-2 px-8" data-testid="button-start-practice">
                  <Target className="h-5 w-5" />
                  Start Practice Test
                </Button>
              </Link>
              <Link href="/progress">
                <Button size="lg" variant="outline" className="gap-2 px-8" data-testid="button-view-progress">
                  <TrendingUp className="h-5 w-5" />
                  View Progress
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Everything You Need to Ace GATE CSE
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Comprehensive preparation tools designed specifically for GATE Computer Science aspirants
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover-elevate" data-testid="card-feature-authentic">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Authentic GATE Questions</CardTitle>
                <CardDescription>
                  Practice with questions that mirror actual GATE CSE exam style, phrasing, and complexity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-chart-2" />
                    MCQs with 4 options
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-chart-2" />
                    Short & long answer questions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-chart-2" />
                    Fill-in-the-blank problems
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-feature-ai">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
                  <Brain className="h-6 w-6 text-chart-3" />
                </div>
                <CardTitle>AI-Powered Analysis</CardTitle>
                <CardDescription>
                  Get personalized feedback and motivational support powered by advanced AI models
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-chart-2" />
                    Intelligent answer evaluation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-chart-2" />
                    Personalized study recommendations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-chart-2" />
                    Motivational progress reports
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-feature-videos">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-chart-1/10">
                  <Video className="h-6 w-6 text-chart-1" />
                </div>
                <CardTitle>Curated Video Library</CardTitle>
                <CardDescription>
                  Access topic-specific video tutorials matched to your weak areas using AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-chart-2" />
                    9 comprehensive playlists
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-chart-2" />
                    Smart topic-based recommendations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-chart-2" />
                    Embedded video player
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-feature-tracking">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                  <TrendingUp className="h-6 w-6 text-chart-2" />
                </div>
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>
                  Monitor your improvement over time with detailed analytics and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-chart-2" />
                    Topic-wise mastery levels
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-chart-2" />
                    Performance trends & charts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-chart-2" />
                    Historical test data
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-feature-syllabus">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
                  <Target className="h-6 w-6 text-chart-4" />
                </div>
                <CardTitle>Complete Syllabus Coverage</CardTitle>
                <CardDescription>
                  All 10 sections from the official GATE 2026 syllabus with proportional weightage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-chart-2" />
                    Engineering Mathematics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-chart-2" />
                    Core CS topics (DSA, OS, Networks, etc.)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-chart-2" />
                    GATE weightage-based distribution
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-feature-adaptive">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-chart-5/10">
                  <Clock className="h-6 w-6 text-chart-5" />
                </div>
                <CardTitle>Adaptive Testing</CardTitle>
                <CardDescription>
                  Customize your practice sessions with flexible difficulty and topic selection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-chart-2" />
                    Choose subjects & topics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-chart-2" />
                    Select difficulty levels
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-chart-2" />
                    Randomized question sets
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t bg-muted/30 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <div className="mb-1 text-4xl font-bold" data-testid="text-stat-sections">10</div>
              <div className="text-sm text-muted-foreground">GATE Sections Covered</div>
            </div>
            <div className="text-center">
              <div className="mb-2 flex items-center justify-center">
                <Video className="h-8 w-8 text-chart-1" />
              </div>
              <div className="mb-1 text-4xl font-bold" data-testid="text-stat-videos">9</div>
              <div className="text-sm text-muted-foreground">Curated Video Playlists</div>
            </div>
            <div className="text-center">
              <div className="mb-2 flex items-center justify-center">
                <Award className="h-8 w-8 text-chart-2" />
              </div>
              <div className="mb-1 text-4xl font-bold" data-testid="text-stat-types">4</div>
              <div className="text-sm text-muted-foreground">Question Types Supported</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-chart-2/5">
            <CardContent className="p-8 md:p-12">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                  Ready to Begin Your GATE CSE Journey?
                </h2>
                <p className="mb-8 text-lg text-muted-foreground">
                  Start practicing today with AI-powered personalized learning. Track your progress, 
                  identify weak areas, and master all GATE CSE topics with confidence.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link href="/practice">
                    <Button size="lg" className="gap-2 px-8" data-testid="button-cta-start">
                      <Target className="h-5 w-5" />
                      Start Practice Now
                    </Button>
                  </Link>
                  <Link href="/videos">
                    <Button size="lg" variant="outline" className="gap-2 px-8" data-testid="button-cta-videos">
                      <Video className="h-5 w-5" />
                      Browse Videos
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
