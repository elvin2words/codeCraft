import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectModal } from "@/components/project-modal";
import { TopNavigation } from "@/components/top-navigation";
import { Plus, FolderOpen, Clock, Users } from "lucide-react";
import { Link } from "wouter";
import type { Project } from "@shared/schema";

export default function Dashboard() {
  const [showProjectModal, setShowProjectModal] = useState(false);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  const handleProjectCreated = (projectId: number) => {
    // Navigate to the new project
    window.location.href = `/editor/${projectId}`;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Never";
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      "day"
    );
  };

  const getProjectIcon = (template: string) => {
    switch (template) {
      case "React App":
        return "fab fa-react text-blue-500";
      case "Node.js Express":
        return "fab fa-node-js text-green-500";
      case "Python Flask":
        return "fab fa-python text-yellow-500";
      case "HTML/CSS/JS":
        return "fab fa-html5 text-orange-500";
      default:
        return "fas fa-code text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <TopNavigation onNewProject={() => setShowProjectModal(true)} />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Your Projects
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Build, deploy, and share your code projects
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-lg">Create Project</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Start a new project from templates or scratch
                </CardDescription>
                <Button 
                  className="w-full mt-4" 
                  onClick={() => setShowProjectModal(true)}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-lg">Collaborate</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Invite team members to work together
                </CardDescription>
                <Button variant="outline" className="w-full mt-4">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <FolderOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-lg">Import Project</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Import existing code from GitHub or ZIP
                </CardDescription>
                <Button variant="outline" className="w-full mt-4">
                  Import
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Projects Grid */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Recent Projects
            </h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FolderOpen className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No projects yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Create your first project to get started
                  </p>
                  <Button onClick={() => setShowProjectModal(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Project
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project: Project) => (
                  <Link key={project.id} href={`/editor/${project.id}`}>
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                              <i className={getProjectIcon(project.template)}></i>
                            </div>
                            <CardTitle className="text-lg truncate">
                              {project.name}
                            </CardTitle>
                          </div>
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                            {project.template}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-3 line-clamp-2">
                          {project.description || "No description provided"}
                        </CardDescription>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="mr-1 h-3 w-3" />
                          Updated {formatDate(project.updatedAt)}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ProjectModal
        open={showProjectModal}
        onOpenChange={setShowProjectModal}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}
