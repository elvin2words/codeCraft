import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { TopNavigation } from "@/components/top-navigation";
import { ProjectSidebar } from "@/components/project-sidebar";
import { CodeEditor } from "@/components/code-editor";
import { PreviewPanel } from "@/components/preview-panel";
import { BottomPanel } from "@/components/bottom-panel";
import { AIAssistant } from "@/components/ai-assistant";
import { ProjectModal } from "@/components/project-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import type { File } from "@shared/schema";

export default function Editor() {
  const { projectId } = useParams<{ projectId: string }>();
  const [activeFile, setActiveFile] = useState<File | undefined>();
  const [openFiles, setOpenFiles] = useState<File[]>([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showBottomPanel, setShowBottomPanel] = useState(false);
  const [bottomPanelTab, setBottomPanelTab] = useState<"terminal" | "console" | "ai">("terminal");
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const { data: project, isLoading: projectLoading, error: projectError } = useQuery({
    queryKey: [`/api/projects/${projectId}`],
    enabled: !!projectId,
  });

  const { data: files = [] } = useQuery({
    queryKey: [`/api/projects/${projectId}/files`],
    enabled: !!projectId,
  });

  // WebSocket connection for real-time collaboration
  useEffect(() => {
    if (!projectId) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      socket.send(JSON.stringify({
        type: "join_project",
        projectId: parseInt(projectId)
      }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "file_change") {
        // Handle real-time file changes from other users
        console.log("File changed by another user:", data);
      }
    };

    return () => socket.close();
  }, [projectId]);

  const handleFileSelect = (file: File) => {
    if (file.type === "folder") return;
    
    setActiveFile(file);
    
    // Add to open files if not already open
    if (!openFiles.find(f => f.id === file.id)) {
      setOpenFiles(prev => [...prev, file]);
    }
  };

  const handleFileClose = (fileId: number) => {
    setOpenFiles(prev => prev.filter(f => f.id !== fileId));
    
    if (activeFile?.id === fileId) {
      const remainingFiles = openFiles.filter(f => f.id !== fileId);
      setActiveFile(remainingFiles[remainingFiles.length - 1]);
    }
  };

  const handleTabChange = (file: File) => {
    setActiveFile(file);
  };

  const handleFileChange = (fileId: number, content: string) => {
    // Update the file content locally
    setOpenFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, content } : f
    ));
    
    if (activeFile?.id === fileId) {
      setActiveFile(prev => prev ? { ...prev, content } : prev);
    }
  };

  const handleToolSelect = (tool: string) => {
    if (tool === "terminal") {
      setBottomPanelTab("terminal");
      setShowBottomPanel(true);
    } else if (tool === "ai") {
      setShowAIAssistant(true);
    }
  };

  const handleProjectCreated = (newProjectId: number) => {
    window.location.href = `/editor/${newProjectId}`;
  };

  if (projectLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
        <TopNavigation onNewProject={() => setShowProjectModal(true)} />
        <div className="flex h-screen pt-16">
          <div className="w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 p-4">
            <Skeleton className="h-8 w-full mb-4" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Skeleton className="h-8 w-48 mx-auto mb-4" />
              <Skeleton className="h-4 w-32 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
        <TopNavigation onNewProject={() => setShowProjectModal(true)} />
        <div className="flex h-screen pt-16 items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="pt-6">
              <div className="flex mb-4 gap-2">
                <AlertCircle className="h-8 w-8 text-red-500" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Project Not Found
                </h1>
              </div>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                The project you're looking for doesn't exist or you don't have access to it.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <TopNavigation onNewProject={() => setShowProjectModal(true)} />
      
      <div className="flex h-screen pt-16">
        <ProjectSidebar
          project={project}
          activeFile={activeFile}
          onFileSelect={handleFileSelect}
          onToolSelect={handleToolSelect}
        />

        <main className="flex-1 flex flex-col">
          <div className="flex flex-1">
            <CodeEditor
              files={openFiles}
              activeFile={activeFile}
              onFileChange={handleFileChange}
              onFileClose={handleFileClose}
              onTabChange={handleTabChange}
            />
            
            <PreviewPanel
              project={project}
              activeFile={activeFile}
              files={files}
            />
          </div>

          <BottomPanel
            projectId={project.id}
            isOpen={showBottomPanel}
            onClose={() => setShowBottomPanel(false)}
            activeTab={bottomPanelTab}
            onTabChange={setBottomPanelTab}
          />
        </main>

        <AIAssistant
          projectId={project.id}
          isOpen={showAIAssistant}
          onClose={() => setShowAIAssistant(false)}
        />
      </div>

      <ProjectModal
        open={showProjectModal}
        onOpenChange={setShowProjectModal}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}
