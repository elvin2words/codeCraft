import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun, Plus, FolderOpen, Users, GraduationCap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TopNavigationProps {
  onNewProject: () => void;
}

export function TopNavigation({ onNewProject }: TopNavigationProps) {
  const { theme, setTheme } = useTheme();

  const { data: user } = useQuery({
    queryKey: ["/api/user"],
  });

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-code text-white text-sm"></i>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">DevStudio</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Button
            variant="ghost"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <FolderOpen className="mr-2 h-4 w-4" />
            Projects
          </Button>
          <Button
            variant="ghost"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <Users className="mr-2 h-4 w-4" />
            Collaborate
          </Button>
          <Button
            variant="ghost"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <GraduationCap className="mr-2 h-4 w-4" />
            Learn
          </Button>
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="bg-gray-100 dark:bg-slate-800"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
        
        <Button onClick={onNewProject} className="bg-blue-500 hover:bg-blue-600">
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
        
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
            <AvatarFallback>
              {user?.name?.slice(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:inline text-sm font-medium">
            {user?.name || "User"}
          </span>
        </div>
      </div>
    </header>
  );
}
