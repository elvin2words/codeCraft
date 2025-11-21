import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TemplateSelector } from "@/components/portfolio/template-selector";
import { Portfolio } from "@shared/schema2";
import { Plus, Edit, Eye, Trash2, Globe, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("minimal");
  const [portfolioTitle, setPortfolioTitle] = useState("");
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch user portfolios
  const { data: portfolios, isLoading } = useQuery({
    queryKey: ["/api/portfolios"],
  });

  // Create portfolio mutation
  const createPortfolioMutation = useMutation({
    mutationFn: (data: { title: string; template: string }) =>
      apiRequest("POST", "/api/portfolios", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolios"] });
      setIsCreateDialogOpen(false);
      setPortfolioTitle("");
      setSelectedTemplate("minimal");
      toast({ title: "Portfolio created successfully!" });
    },
    onError: (error) => {
      toast({
        title: "Error creating portfolio",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete portfolio mutation
  const deletePortfolioMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/portfolios/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolios"] });
      toast({ title: "Portfolio deleted successfully!" });
    },
    onError: (error) => {
      toast({
        title: "Error deleting portfolio",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreatePortfolio = () => {
    if (!portfolioTitle.trim()) {
      toast({
        title: "Please enter a portfolio title",
        variant: "destructive",
      });
      return;
    }

    createPortfolioMutation.mutate({
      title: portfolioTitle,
      template: selectedTemplate,
    });
  };

  const handleDeletePortfolio = (portfolio: Portfolio) => {
    if (confirm(`Are you sure you want to delete "${portfolio.title}"?`)) {
      deletePortfolioMutation.mutate(portfolio.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your portfolios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/">
                <div className="flex items-center cursor-pointer">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">C</span>
                  </div>
                  <span className="ml-3 text-xl font-bold text-slate-900">CreativePort</span>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-slate-400" />
                )}
                <span className="text-sm text-slate-600">
                  {user?.firstName || user?.email || "User"}
                </span>
              </div>
              <Button variant="outline" onClick={() => window.location.href = "/api/logout"}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Your Portfolios</h1>
            <p className="text-slate-600 mt-2">
              Create and manage your professional portfolios
            </p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Create Portfolio
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Portfolio</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title">Portfolio Title</Label>
                  <Input
                    id="title"
                    value={portfolioTitle}
                    onChange={(e) => setPortfolioTitle(e.target.value)}
                    placeholder="My Creative Portfolio"
                    className="mt-1"
                  />
                </div>

                <TemplateSelector
                  selectedTemplate={selectedTemplate}
                  onSelectTemplate={setSelectedTemplate}
                />

                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreatePortfolio}
                    disabled={createPortfolioMutation.isPending}
                  >
                    {createPortfolioMutation.isPending ? "Creating..." : "Create Portfolio"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Portfolios Grid */}
        {portfolios && portfolios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((portfolio: Portfolio) => (
              <Card key={portfolio.id} className="group hover:shadow-lg transition-shadow">
                <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 rounded-t-lg flex items-center justify-center">
                  <div className="text-center">
                    <Globe className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Portfolio Preview</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-slate-900 truncate">
                      {portfolio.title}
                    </h3>
                    <Badge variant={portfolio.isPublished ? "default" : "secondary"}>
                      {portfolio.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-4">
                    Template: {portfolio.template}
                  </p>
                  
                  {portfolio.domain && (
                    <p className="text-sm text-slate-500 mb-4">
                      {portfolio.domain}
                    </p>
                  )}

                  <div className="flex space-x-2">
                    <Link href={`/editor/${portfolio.id}`}>
                      <Button size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    
                    {portfolio.isPublished && portfolio.domain && (
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeletePortfolio(portfolio)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <Card className="border-2 border-dashed border-slate-300">
            <CardContent className="p-12 text-center">
              <Globe className="mx-auto h-16 w-16 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No portfolios yet
              </h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Create your first portfolio to start showcasing your creative work to the world.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Portfolio
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
