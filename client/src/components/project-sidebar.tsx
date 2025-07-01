import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileTree } from "@/components/file-tree";
import { Terminal, Search, GitBranch, MoreHorizontal } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Project, File } from "@shared/schema";

interface ProjectSidebarProps {
  project: Project;
  activeFile?: File;
  onFileSelect: (file: File) => void;
  onToolSelect: (tool: string) => void;
}

export function ProjectSidebar({ project, activeFile, onFileSelect, onToolSelect }: ProjectSidebarProps) {
  const queryClient = useQueryClient();

  const { data: files = [] } = useQuery({
    queryKey: [`/api/projects/${project.id}/files`],
  });

  const createFileMutation = useMutation({
    mutationFn: async (data: { name: string; path: string; type: "file" | "folder"; content?: string }) => {
      const response = await apiRequest("POST", `/api/projects/${project.id}/files`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${project.id}/files`] });
    },
  });

  const handleCreateFile = (parentPath: string, isFolder: boolean) => {
    const fileName = isFolder ? "New Folder" : "new-file.txt";
    const fullPath = parentPath === "/" ? `/${fileName}` : `${parentPath}/${fileName}`;
    
    createFileMutation.mutate({
      name: fileName,
      path: fullPath,
      type: isFolder ? "folder" : "file",
      content: isFolder ? "" : "// New file\n",
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Never";
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60)),
      "hour"
    );
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 flex flex-col">
      {/* Project Header */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Current Project</h2>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded flex items-center justify-center">
            <i className="fas fa-globe text-white text-xs"></i>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{project.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Last edited {formatDate(project.updatedAt)}
            </div>
          </div>
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Files
            </h3>
          </div>
          
          <FileTree
            files={files}
            activeFileId={activeFile?.id}
            onFileSelect={onFileSelect}
            onCreateFile={handleCreateFile}
          />
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Tools
            </h3>
          </div>
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToolSelect("terminal")}
              className="w-full justify-start text-sm"
            >
              <Terminal className="mr-2 h-4 w-4 text-green-500" />
              Terminal
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToolSelect("search")}
              className="w-full justify-start text-sm"
            >
              <Search className="mr-2 h-4 w-4 text-blue-500" />
              Search
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToolSelect("git")}
              className="w-full justify-start text-sm"
            >
              <GitBranch className="mr-2 h-4 w-4 text-orange-500" />
              Version Control
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Node.js v18.17.0</span>
          <span className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Online</span>
          </span>
        </div>
      </div>
    </aside>
  );
}
