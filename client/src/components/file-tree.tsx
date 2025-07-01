import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFileIcon } from "@/lib/monaco";
import { ChevronRight, ChevronDown, Plus, FolderPlus, FileText } from "lucide-react";
import type { File } from "@shared/schema";

interface FileTreeProps {
  files: File[];
  activeFileId?: number;
  onFileSelect: (file: File) => void;
  onCreateFile?: (parentPath: string, isFolder: boolean) => void;
}

interface TreeNode {
  file: File;
  children: TreeNode[];
  level: number;
}

export function FileTree({ files, activeFileId, onFileSelect, onCreateFile }: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["/"]));
  const [creatingFile, setCreatingFile] = useState<{ parentPath: string; isFolder: boolean } | null>(null);
  const [newFileName, setNewFileName] = useState("");

  // Build tree structure
  const buildTree = (files: File[]): TreeNode[] => {
    const fileMap = new Map<string, File>();
    files.forEach(file => fileMap.set(file.path, file));

    const rootNodes: TreeNode[] = [];
    const processedPaths = new Set<string>();

    const createNode = (file: File, level: number): TreeNode => {
      const children: TreeNode[] = [];
      
      if (file.type === "folder") {
        const childFiles = files.filter(f => 
          f.path.startsWith(file.path + "/") && 
          f.path.split("/").length === file.path.split("/").length + 1
        );
        
        children.push(...childFiles.map(childFile => createNode(childFile, level + 1)));
      }

      return { file, children, level };
    };

    // Get root level files and folders
    const rootFiles = files.filter(file => 
      file.path.split("/").length <= 2 && file.path !== "/"
    );

    rootFiles.forEach(file => {
      if (!processedPaths.has(file.path)) {
        rootNodes.push(createNode(file, 0));
        processedPaths.add(file.path);
      }
    });

    return rootNodes;
  };

  const tree = buildTree(files);

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const startCreatingFile = (parentPath: string, isFolder: boolean) => {
    setCreatingFile({ parentPath, isFolder });
    setNewFileName("");
  };

  const cancelCreating = () => {
    setCreatingFile(null);
    setNewFileName("");
  };

  const finishCreating = () => {
    if (newFileName.trim() && creatingFile) {
      onCreateFile?.(creatingFile.parentPath, creatingFile.isFolder);
      cancelCreating();
    }
  };

  const renderNode = (node: TreeNode): React.ReactNode => {
    const { file, children, level } = node;
    const isFolder = file.type === "folder";
    const isExpanded = expandedFolders.has(file.path);
    const isActive = activeFileId === file.id;
    const paddingLeft = level * 16;

    return (
      <div key={file.path}>
        <div
          className={`flex items-center space-x-2 px-2 py-1 rounded cursor-pointer text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
            isActive ? "bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500" : ""
          }`}
          style={{ paddingLeft: `${paddingLeft + 8}px` }}
          onClick={() => isFolder ? toggleFolder(file.path) : onFileSelect(file)}
        >
          {isFolder && (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(file.path);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}
          {!isFolder && <div className="w-4" />}
          <i className={getFileIcon(file.name, isFolder)} />
          <span className="flex-1">{file.name}</span>
          {isFolder && (
            <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  startCreatingFile(file.path, false);
                }}
              >
                <FileText className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  startCreatingFile(file.path, true);
                }}
              >
                <FolderPlus className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        {isFolder && isExpanded && (
          <div>
            {children.map(child => renderNode(child))}
            {creatingFile?.parentPath === file.path && (
              <div
                className="flex items-center space-x-2 px-2 py-1 text-sm"
                style={{ paddingLeft: `${(level + 1) * 16 + 8}px` }}
              >
                <div className="w-4" />
                <i className={getFileIcon("", creatingFile.isFolder)} />
                <Input
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  onBlur={cancelCreating}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") finishCreating();
                    if (e.key === "Escape") cancelCreating();
                  }}
                  placeholder={creatingFile.isFolder ? "Folder name" : "File name"}
                  className="flex-1 h-6 text-xs"
                  autoFocus
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {tree.map(node => renderNode(node))}
      
      {creatingFile?.parentPath === "/" && (
        <div className="flex items-center space-x-2 px-2 py-1 text-sm">
          <div className="w-4" />
          <i className={getFileIcon("", creatingFile.isFolder)} />
          <Input
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onBlur={cancelCreating}
            onKeyDown={(e) => {
              if (e.key === "Enter") finishCreating();
              if (e.key === "Escape") cancelCreating();
            }}
            placeholder={creatingFile.isFolder ? "Folder name" : "File name"}
            className="flex-1 h-6 text-xs"
            autoFocus
          />
        </div>
      )}
      
      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => startCreatingFile("/", false)}
          className="w-full justify-start text-xs"
        >
          <Plus className="mr-2 h-3 w-3" />
          New File
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => startCreatingFile("/", true)}
          className="w-full justify-start text-xs"
        >
          <FolderPlus className="mr-2 h-3 w-3" />
          New Folder
        </Button>
      </div>
    </div>
  );
}
