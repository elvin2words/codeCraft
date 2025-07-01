import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, Bug, Bot, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ChatMessage } from "@shared/schema";

interface BottomPanelProps {
  projectId: number;
  isOpen: boolean;
  onClose: () => void;
  activeTab: "terminal" | "console" | "ai";
  onTabChange: (tab: "terminal" | "console" | "ai") => void;
}

export function BottomPanel({ projectId, isOpen, onClose, activeTab, onTabChange }: BottomPanelProps) {
  const [terminalOutput, setTerminalOutput] = useState([
    "$ npm start",
    "Starting development server...",
    "✓ Compiled successfully!",
    "Local: http://localhost:3000",
    "Network: http://192.168.1.100:3000",
    "webpack compiled with 0 warnings",
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const [chatInput, setChatInput] = useState("");
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: chatMessages = [] } = useQuery({
    queryKey: [`/api/projects/${projectId}/chat`],
    enabled: isOpen && activeTab === "ai",
  });

  const sendChatMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", `/api/projects/${projectId}/chat`, { content });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/chat`] });
      setChatInput("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    
    setTerminalOutput(prev => [...prev, `$ ${terminalInput}`, "Command executed"]);
    setTerminalInput("");
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    sendChatMutation.mutate(chatInput.trim());
  };

  if (!isOpen) return null;

  return (
    <div className="h-64 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 flex flex-col">
      <div className="flex items-center border-b border-gray-200 dark:border-slate-700">
        <Button
          variant={activeTab === "terminal" ? "default" : "ghost"}
          size="sm"
          onClick={() => onTabChange("terminal")}
          className="rounded-none border-r border-gray-200 dark:border-slate-700"
        >
          <Terminal className="mr-2 h-4 w-4" />
          Terminal
        </Button>
        <Button
          variant={activeTab === "console" ? "default" : "ghost"}
          size="sm"
          onClick={() => onTabChange("console")}
          className="rounded-none border-r border-gray-200 dark:border-slate-700"
        >
          <Bug className="mr-2 h-4 w-4" />
          Console
        </Button>
        <Button
          variant={activeTab === "ai" ? "default" : "ghost"}
          size="sm"
          onClick={() => onTabChange("ai")}
          className="rounded-none border-r border-gray-200 dark:border-slate-700"
        >
          <Bot className="mr-2 h-4 w-4" />
          AI Assistant
        </Button>
        <div className="flex-1"></div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="rounded-none"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 flex flex-col">
        {activeTab === "terminal" && (
          <>
            <ScrollArea className="flex-1 p-4 bg-gray-900 text-green-400 font-mono text-sm">
              <div className="space-y-1">
                {terminalOutput.map((line, index) => (
                  <div
                    key={index}
                    className={line.startsWith("$") ? "text-white" : "text-green-400"}
                  >
                    {line}
                  </div>
                ))}
                <div className="flex items-center">
                  <span className="text-white mr-2">$</span>
                  <div className="w-2 h-4 bg-green-400 animate-pulse"></div>
                </div>
              </div>
            </ScrollArea>
            <form onSubmit={handleTerminalSubmit} className="p-2 border-t border-gray-700 bg-gray-900">
              <div className="flex items-center text-white">
                <span className="mr-2">$</span>
                <Input
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="Enter command..."
                  className="flex-1 bg-transparent border-none text-white placeholder-gray-400 focus:ring-0"
                />
              </div>
            </form>
          </>
        )}

        {activeTab === "console" && (
          <div className="flex-1 p-4 bg-gray-900 text-gray-300 font-mono text-sm">
            <div className="text-gray-500">Console output will appear here...</div>
          </div>
        )}

        {activeTab === "ai" && (
          <>
            <ScrollArea ref={chatScrollRef} className="flex-1 p-4">
              <div className="space-y-4">
                {chatMessages.length === 0 && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 dark:bg-slate-800 rounded-lg p-3 text-sm">
                        Hello! I'm your AI coding assistant. I can help you with debugging, code optimization, and answering programming questions. What would you like to work on?
                      </div>
                    </div>
                  </div>
                )}
                
                {chatMessages.map((message: ChatMessage) => (
                  <div key={message.id} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      message.role === "assistant"
                        ? "bg-gradient-to-br from-purple-500 to-pink-500"
                        : "bg-blue-500"
                    }`}>
                      {message.role === "assistant" ? (
                        <Bot className="h-4 w-4 text-white" />
                      ) : (
                        <span className="text-white text-xs font-medium">U</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`rounded-lg p-3 text-sm ${
                        message.role === "assistant"
                          ? "bg-gray-100 dark:bg-slate-800"
                          : "bg-blue-500 text-white"
                      }`}>
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                
                {sendChatMutation.isPending && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 dark:bg-slate-800 rounded-lg p-3 text-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-200 dark:border-slate-700">
              <div className="flex space-x-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask me anything about your code..."
                  disabled={sendChatMutation.isPending}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={!chatInput.trim() || sendChatMutation.isPending}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <i className="fas fa-paper-plane"></i>
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
