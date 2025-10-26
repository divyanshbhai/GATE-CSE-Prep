import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Brain, 
  Code, 
  Database, 
  Network, 
  Cpu, 
  FileText, 
  GitBranch,
  Settings,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import type { TestConfig } from "@shared/schema";

const GATE_SUBJECTS = [
  { id: "engineering_mathematics", name: "Engineering Mathematics", icon: Brain, weightage: 13 },
  { id: "digital_logic", name: "Digital Logic", icon: Cpu, weightage: 5 },
  { id: "computer_organization", name: "Computer Organization & Architecture", icon: Cpu, weightage: 6 },
  { id: "programming_ds", name: "Programming & Data Structures", icon: Code, weightage: 10 },
  { id: "algorithms", name: "Algorithms", icon: GitBranch, weightage: 10 },
  { id: "theory_of_computation", name: "Theory of Computation", icon: Brain, weightage: 7 },
  { id: "compiler_design", name: "Compiler Design", icon: FileText, weightage: 5 },
  { id: "operating_systems", name: "Operating Systems", icon: Settings, weightage: 10 },
  { id: "databases", name: "Databases", icon: Database, weightage: 10 },
  { id: "computer_networks", name: "Computer Networks", icon: Network, weightage: 10 },
];

export default function Practice() {
  const [, setLocation] = useLocation();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [numQuestions, setNumQuestions] = useState(10);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>(["medium"]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["MCQ"]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(s => s !== subjectId)
        : [...prev, subjectId]
    );
    setErrors(prev => ({ ...prev, subjects: "" }));
  };

  const handleDifficultyToggle = (difficulty: string) => {
    setSelectedDifficulty(prev =>
      prev.includes(difficulty)
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleStartTest = () => {
    const newErrors: { [key: string]: string } = {};

    if (selectedSubjects.length === 0) {
      newErrors.subjects = "Please select at least one subject";
    }

    if (numQuestions < 1 || numQuestions > 100) {
      newErrors.numQuestions = "Number of questions must be between 1 and 100";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Store test config in localStorage and navigate to quiz
    const testConfig: Omit<TestConfig, "topics"> = {
      subjects: selectedSubjects,
      difficulty: selectedDifficulty as ("easy" | "medium" | "hard")[],
      num_questions: numQuestions,
      questionTypes: selectedTypes as ("MCQ" | "short_answer" | "long_answer" | "fill_in_blank")[],
    };

    localStorage.setItem("current_test_config", JSON.stringify(testConfig));
    setLocation("/quiz");
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-3xl font-bold md:text-4xl">Configure Your Practice Test</h1>
        <p className="text-lg text-muted-foreground">
          Select subjects, difficulty levels, and question types to create a personalized practice session
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subject Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Select Subjects
              </CardTitle>
              <CardDescription>
                Choose one or more subjects to include in your test. Weightage represents the importance in GATE exam.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {errors.subjects && (
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {errors.subjects}
                </div>
              )}
              <div className="grid gap-3 md:grid-cols-2">
                {GATE_SUBJECTS.map((subject) => {
                  const Icon = subject.icon;
                  const isSelected = selectedSubjects.includes(subject.id);
                  
                  return (
                    <div
                      key={subject.id}
                      onClick={() => handleSubjectToggle(subject.id)}
                      className={`
                        flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition-all
                        hover-elevate active-elevate-2
                        ${isSelected ? "border-primary bg-primary/5" : "border-border"}
                      `}
                      data-testid={`checkbox-subject-${subject.id}`}
                    >
                      <Checkbox
                        id={subject.id}
                        checked={isSelected}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor={subject.id}
                          className="flex cursor-pointer items-center gap-2 font-semibold"
                        >
                          <Icon className="h-4 w-4" />
                          {subject.name}
                        </Label>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {subject.weightage}% weightage
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Question Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Question Configuration</CardTitle>
              <CardDescription>
                Customize the number and types of questions in your test
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Number of Questions */}
              <div className="space-y-2">
                <Label htmlFor="num-questions">Number of Questions</Label>
                <Input
                  id="num-questions"
                  type="number"
                  min="1"
                  max="100"
                  value={numQuestions}
                  onChange={(e) => {
                    setNumQuestions(parseInt(e.target.value) || 1);
                    setErrors(prev => ({ ...prev, numQuestions: "" }));
                  }}
                  data-testid="input-num-questions"
                  className={errors.numQuestions ? "border-destructive" : ""}
                />
                {errors.numQuestions && (
                  <p className="text-sm text-destructive">{errors.numQuestions}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Recommended: 10-20 questions for focused practice, 50+ for full mock test
                </p>
              </div>

              {/* Difficulty Levels */}
              <div className="space-y-3">
                <Label>Difficulty Levels</Label>
                <div className="flex flex-wrap gap-3">
                  {["easy", "medium", "hard"].map((difficulty) => (
                    <div
                      key={difficulty}
                      onClick={() => handleDifficultyToggle(difficulty)}
                      className={`
                        flex cursor-pointer items-center gap-2 rounded-lg border-2 px-4 py-2 transition-all
                        hover-elevate active-elevate-2
                        ${selectedDifficulty.includes(difficulty) ? "border-primary bg-primary/5" : "border-border"}
                      `}
                      data-testid={`checkbox-difficulty-${difficulty}`}
                    >
                      <Checkbox checked={selectedDifficulty.includes(difficulty)} />
                      <Label className="cursor-pointer capitalize">{difficulty}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Question Types */}
              <div className="space-y-3">
                <Label>Question Types</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { id: "MCQ", label: "Multiple Choice (4 options)" },
                    { id: "short_answer", label: "Short Answer" },
                    { id: "long_answer", label: "Long Answer" },
                    { id: "fill_in_blank", label: "Fill in the Blank" }
                  ].map((type) => (
                    <div
                      key={type.id}
                      onClick={() => handleTypeToggle(type.id)}
                      className={`
                        flex cursor-pointer items-center gap-2 rounded-lg border-2 px-4 py-3 transition-all
                        hover-elevate active-elevate-2
                        ${selectedTypes.includes(type.id) ? "border-primary bg-primary/5" : "border-border"}
                      `}
                      data-testid={`checkbox-type-${type.id}`}
                    >
                      <Checkbox checked={selectedTypes.includes(type.id)} />
                      <Label className="cursor-pointer">{type.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">Test Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 text-sm font-medium text-muted-foreground">Selected Subjects</div>
                <div className="space-y-2">
                  {selectedSubjects.length > 0 ? (
                    selectedSubjects.map(subjectId => {
                      const subject = GATE_SUBJECTS.find(s => s.id === subjectId);
                      return (
                        <div key={subjectId} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-chart-2" />
                          <span className="text-sm">{subject?.name}</span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No subjects selected</p>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="mb-2 text-sm font-medium text-muted-foreground">Configuration</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Questions:</span>
                    <span className="font-semibold" data-testid="text-summary-questions">{numQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Difficulty:</span>
                    <span className="font-semibold capitalize" data-testid="text-summary-difficulty">
                      {selectedDifficulty.join(", ") || "None"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Types:</span>
                    <span className="font-semibold" data-testid="text-summary-types">{selectedTypes.length}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleStartTest}
                className="w-full gap-2"
                size="lg"
                data-testid="button-start-test"
              >
                <Brain className="h-5 w-5" />
                Start Test
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Your progress will be tracked and saved automatically
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
