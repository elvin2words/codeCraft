import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Smartphone, Monitor, Tablet } from "lucide-react";
import type { Project, File } from "@shared/schema";

interface PreviewPanelProps {
  project: Project;
  activeFile?: File;
  files: File[];
}

export function PreviewPanel({ project, activeFile, files }: PreviewPanelProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Generate preview content based on project template and files
  const getPreviewContent = () => {
    const htmlFile = files.find(f => f.name === "index.html");
    const cssFile = files.find(f => f.name.endsWith(".css"));
    const jsFile = files.find(f => f.name.endsWith(".js") && !f.name.includes("node_modules"));

    if (project.template === "React App") {
      return (
        <div className="p-8 bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-lg text-center h-full flex flex-col justify-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to My Portfolio</h1>
          <p className="mb-6 text-blue-100">
            Full-stack developer passionate about creating amazing web experiences.
          </p>
          <div className="flex justify-center space-x-3 flex-wrap">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">React</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Node.js</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Python</span>
          </div>
        </div>
      );
    }

    if (project.template === "HTML/CSS/JS" && htmlFile) {
      return (
        <div className="p-8 bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-lg text-center h-full flex flex-col justify-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to My Web Project</h1>
          <p className="mb-6 text-blue-100">
            This is a simple HTML, CSS, and JavaScript project.
          </p>
          <button className="mx-auto px-6 py-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
            Click me!
          </button>
        </div>
      );
    }

    return (
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-eye text-gray-400 text-xl"></i>
          </div>
          <h3 className="text-lg font-medium mb-2">No Preview Available</h3>
          <p className="text-sm">
            Preview will appear here when you run your project
          </p>
        </div>
      </div>
    );
  };

  const getViewModeClass = () => {
    switch (viewMode) {
      case "mobile":
        return "max-w-sm mx-auto";
      case "tablet":
        return "max-w-2xl mx-auto";
      default:
        return "w-full";
    }
  };

  return (
    <div className="w-1/3 bg-white dark:bg-slate-800 border-l border-gray-200 dark:border-slate-700 flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-slate-700">
        <h3 className="text-sm font-medium">Live Preview</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("desktop")}
            className={viewMode === "desktop" ? "bg-gray-100 dark:bg-gray-700" : ""}
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("tablet")}
            className={viewMode === "tablet" ? "bg-gray-100 dark:bg-gray-700" : ""}
          >
            <Tablet className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("mobile")}
            className={viewMode === "mobile" ? "bg-gray-100 dark:bg-gray-700" : ""}
          >
            <Smartphone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-auto bg-gray-50 dark:bg-slate-900">
        <div className={`h-full transition-all duration-300 ${getViewModeClass()}`}>
          <div className="h-full bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
            {getPreviewContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
