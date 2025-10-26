import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Play, Clock, Book, Database, Network, Cpu, Code, Settings, FileText, GitBranch, Brain } from "lucide-react";
import { api } from "@/lib/api";
import type { Video } from "@shared/schema";

const SUBJECTS = [
  { id: "all", name: "All Subjects", icon: Book },
  { id: "databases", name: "Databases", icon: Database },
  { id: "computer_networks", name: "Computer Networks", icon: Network },
  { id: "algorithms", name: "Algorithms", icon: GitBranch },
  { id: "operating_systems", name: "Operating Systems", icon: Settings },
  { id: "digital_logic", name: "Digital Logic", icon: Cpu },
  { id: "programming_ds", name: "Programming & Data Structures", icon: Code },
  { id: "compiler_design", name: "Compiler Design", icon: FileText },
  { id: "theory_of_computation", name: "Theory of Computation", icon: Brain },
];

export default function Videos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedSubject, setSelectedSubject] = useState("all");

  const { data: videos = [], isLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "all" || 
                           video.subject.toLowerCase().replace(/ /g, "_") === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">Video Library</h1>
        <p className="text-lg text-muted-foreground">
          Curated video tutorials from expert educators across all GATE CSE topics
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search videos by title or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-videos"
          />
        </div>
      </div>

      {/* Video Player */}
      {selectedVideo && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="border-0"
              />
            </div>
            <div className="mt-4">
              <h3 className="mb-2 text-xl font-bold" data-testid="text-video-title">{selectedVideo.title}</h3>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{selectedVideo.subject}</Badge>
                <Badge variant="outline">{selectedVideo.topic}</Badge>
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" />
                  {selectedVideo.duration}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subject Tabs */}
      <Tabs value={selectedSubject} onValueChange={setSelectedSubject} className="space-y-6">
        <TabsList className="flex-wrap h-auto gap-2">
          {SUBJECTS.map((subject) => {
            const Icon = subject.icon;
            return (
              <TabsTrigger 
                key={subject.id} 
                value={subject.id}
                className="gap-2"
                data-testid={`tab-${subject.id}`}
              >
                <Icon className="h-4 w-4" />
                {subject.name}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={selectedSubject} className="mt-6">
          {filteredVideos.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredVideos.map((video) => (
                <Card 
                  key={video.id} 
                  className="cursor-pointer overflow-hidden transition-all hover-elevate"
                  onClick={() => setSelectedVideo(video)}
                  data-testid={`card-video-${video.id}`}
                >
                  <div className="group relative aspect-video overflow-hidden bg-muted">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
                        <Play className="h-8 w-8 fill-primary text-primary" />
                      </div>
                    </div>
                    <Badge className="absolute bottom-2 right-2 gap-1 bg-black/80">
                      <Clock className="h-3 w-3" />
                      {video.duration}
                    </Badge>
                  </div>
                  <CardHeader className="pb-4">
                    <CardTitle className="line-clamp-2 text-base leading-snug">
                      {video.title}
                    </CardTitle>
                    <CardDescription className="flex flex-wrap gap-2 pt-2">
                      <Badge variant="secondary" className="text-xs">{video.topic}</Badge>
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Search className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No videos found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search query or select a different subject
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="mt-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-chart-1/5">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold">AI-Powered Video Recommendations</h3>
            <p className="text-sm text-muted-foreground">
              After completing a practice test, our AI will automatically recommend videos 
              based on your weak areas to help you improve faster.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
