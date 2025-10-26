import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import Home from "@/pages/home";
import Practice from "@/pages/practice";
import Quiz from "@/pages/quiz";
import Results from "@/pages/results";
import ProgressPage from "@/pages/progress";
import Videos from "@/pages/videos";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/practice" component={Practice} />
      <Route path="/quiz" component={Quiz} />
      <Route path="/results" component={Results} />
      <Route path="/progress" component={ProgressPage} />
      <Route path="/videos" component={Videos} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              <Router />
            </main>
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
