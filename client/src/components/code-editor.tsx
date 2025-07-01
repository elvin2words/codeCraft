import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Share, X } from "lucide-react";
import { getLanguageFromFilename, getFileIcon } from "@/lib/monaco";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { File } from "@shared/schema";

interface CodeEditorProps {
  files: File[];
  activeFile?: File;
  onFileChange?: (fileId: number, content: string) => void;
  onFileClose?: (fileId: number) => void;
  onTabChange?: (file: File) => void;
}

export function CodeEditor({ files, activeFile, onFileChange, onFileClose, onTabChange }: CodeEditorProps) {
  const [editorContent, setEditorContent] = useState("");
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Monaco Editor is complex to integrate, so we'll use a textarea with syntax highlighting for this demo
  // In a real implementation, you'd integrate Monaco Editor here
  
  useEffect(() => {
    if (activeFile) {
      setEditorContent(activeFile.content || "");
    }
  }, [activeFile]);

  const updateFileMutation = useMutation({
    mutationFn: async (data: { fileId: number; content: string }) => {
      const response = await apiRequest("PATCH", `/api/files/${data.fileId}`, {
        content: data.content,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${activeFile?.projectId}/files`] });
    },
  });

  const runCodeMutation = useMutation({
    mutationFn: async (fileId: number) => {
      const response = await apiRequest("POST", `/api/projects/${activeFile?.projectId}/run`, {
        fileId,
      });
      return response.json();
    },
    onSuccess: (result) => {
      toast({
        title: "Code executed",
        description: result.success ? "Code ran successfully" : "Execution failed",
        variant: result.success ? "default" : "destructive",
      });
    },
  });

  const handleContentChange = (content: string) => {
    setEditorContent(content);
    if (activeFile) {
      onFileChange?.(activeFile.id, content);
      // Auto-save after 1 second of no typing
      const timeoutId = setTimeout(() => {
        updateFileMutation.mutate({ fileId: activeFile.id, content });
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  };

  const handleRunCode = () => {
    if (activeFile) {
      runCodeMutation.mutate(activeFile.id);
    }
  };

  const openFiles = files.filter(file => file.type === "file");

  if (!activeFile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-slate-800">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-code text-gray-400 text-xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No File Selected
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Select a file from the sidebar to start coding
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Editor Tabs */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center">
          <div className="flex">
            {openFiles.map((file) => (
              <div
                key={file.id}
                className={`flex items-center px-4 py-2 border-r border-gray-200 dark:border-slate-700 text-sm cursor-pointer ${
                  activeFile.id === file.id
                    ? "bg-gray-50 dark:bg-slate-800"
                    : "hover:bg-gray-50 dark:hover:bg-slate-800"
                }`}
                onClick={() => onTabChange?.(file)}
              >
                <i className={`${getFileIcon(file.name)} mr-2`}></i>
                <span>{file.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileClose?.(file.id);
                  }}
                  className="ml-2 h-4 w-4 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex-1"></div>
          <div className="flex items-center space-x-2 px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRunCode}
              disabled={runCodeMutation.isPending}
              className="text-green-600 hover:text-green-700 dark:text-green-400"
            >
              <Play className="mr-1 h-4 w-4" />
              Run
            </Button>
            <Button variant="ghost" size="sm">
              <Share className="mr-1 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 bg-slate-900 text-white relative">
        {/* Line Numbers */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-800 border-r border-slate-700 flex flex-col text-xs text-gray-400 p-2">
          {editorContent.split('\n').map((_, index) => (
            <div key={index} className="leading-6 text-right pr-2">
              {index + 1}
            </div>
          ))}
        </div>

        {/* Editor */}
        <textarea
          ref={editorRef}
          value={editorContent}
          onChange={(e) => handleContentChange(e.target.value)}
          className="w-full h-full pl-16 p-4 bg-transparent text-white font-mono text-sm leading-6 resize-none focus:outline-none"
          placeholder="Start typing your code..."
          spellCheck={false}
          style={{
            fontFamily: "'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
          }}
        />

        {/* Syntax highlighting overlay would go here in a real implementation */}
        <div className="absolute top-4 left-16 right-4 bottom-4 pointer-events-none">
          <pre className="text-transparent font-mono text-sm leading-6 whitespace-pre-wrap break-words">
            {/* This would contain syntax-highlighted version of the code */}
          </pre>
        </div>
      </div>
    </div>
  );
}
