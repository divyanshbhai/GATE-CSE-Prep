import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { BookOpen, TrendingUp, Video, Target } from "lucide-react";

export function Header() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: BookOpen },
    { href: "/practice", label: "Practice", icon: Target },
    { href: "/progress", label: "Progress", icon: TrendingUp },
    { href: "/videos", label: "Videos", icon: Video },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer hover-elevate rounded-lg px-3 py-2 active-elevate-2" data-testid="link-home">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-chart-2">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="hidden font-bold sm:inline-block">GATE CSE Prep</span>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="gap-2"
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
