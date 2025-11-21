import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { DraggableSection } from "./draggable-section";
import { SECTION_CONFIGS } from "./section-types";
import { MediaGallery } from "./media-gallery";
import { DndProvider } from "@/components/ui/dnd-provider";
import { Section, Page } from "@shared/schema2";
import { Plus, Eye, Save, Settings, Palette, Layout } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface PortfolioEditorProps {
  portfolioId: number;
}

export function PortfolioEditor({ portfolioId }: PortfolioEditorProps) {
  const [currentPageId, setCurrentPageId] = useState<number | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const queryClient = useQueryClient();

  // Fetch portfolio data
  const { data: portfolio } = useQuery({
    queryKey: ["/api/portfolios", portfolioId],
  });

  // Fetch pages
  const { data: pages } = useQuery({
    queryKey: ["/api/portfolios", portfolioId, "pages"],
  });

  // Fetch sections for current page
  const { data: sectionsData, refetch: refetchSections } = useQuery({
    queryKey: ["/api/pages", currentPageId, "sections"],
    enabled: !!currentPageId,
  });

  useEffect(() => {
    if (pages && pages.length > 0 && !currentPageId) {
      const homePage = pages.find((page: Page) => page.isHomePage) || pages[0];
      setCurrentPageId(homePage.id);
    }
  }, [pages, currentPageId]);

  useEffect(() => {
    if (sectionsData) {
      setSections(sectionsData);
    }
  }, [sectionsData]);

  // Update portfolio mutation
  const updatePortfolioMutation = useMutation({
    mutationFn: (data: any) =>
      apiRequest("PUT", `/api/portfolios/${portfolioId}`, data),
    onSuccess: () => {
      toast({ title: "Portfolio updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolios", portfolioId] });
    },
    onError: (error) => {
      toast({
        title: "Error updating portfolio",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create section mutation
  const createSectionMutation = useMutation({
    mutationFn: (data: any) =>
      apiRequest("POST", `/api/pages/${currentPageId}/sections`, data),
    onSuccess: () => {
      refetchSections();
      toast({ title: "Section added successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error adding section",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update section mutation
  const updateSectionMutation = useMutation({
    mutationFn: ({ id, ...data }: any) =>
      apiRequest("PUT", `/api/sections/${id}`, data),
    onSuccess: () => {
      toast({ title: "Section updated successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error updating section",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete section mutation
  const deleteSectionMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/sections/${id}`),
    onSuccess: () => {
      refetchSections();
      toast({ title: "Section deleted successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error deleting section",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Reorder sections mutation
  const reorderSectionsMutation = useMutation({
    mutationFn: (sectionIds: number[]) =>
      apiRequest("POST", `/api/pages/${currentPageId}/sections/reorder`, {
        sectionIds,
      }),
    onError: (error) => {
      toast({
        title: "Error reordering sections",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addSection = (type: string) => {
    createSectionMutation.mutate({
      type,
      content: {},
      styles: {},
      order: sections.length,
    });
  };

  const moveSection = (dragIndex: number, hoverIndex: number) => {
    const draggedSection = sections[dragIndex];
    const newSections = [...sections];
    newSections.splice(dragIndex, 1);
    newSections.splice(hoverIndex, 0, draggedSection);
    setSections(newSections);
    setIsDirty(true);

    // Update order in database
    const sectionIds = newSections.map((section) => section.id);
    reorderSectionsMutation.mutate(sectionIds);
  };

  const updateSection = (id: number, content: any, styles?: any) => {
    updateSectionMutation.mutate({ id, content, styles });
    setSections((prev) =>
      prev.map((section) =>
        section.id === id
          ? { ...section, content, ...(styles && { styles }) }
          : section
      )
    );
  };

  const deleteSection = (id: number) => {
    deleteSectionMutation.mutate(id);
  };

  const publishPortfolio = () => {
    updatePortfolioMutation.mutate({ isPublished: true });
  };

  const unpublishPortfolio = () => {
    updatePortfolioMutation.mutate({ isPublished: false });
  };

  if (!portfolio || !pages) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Editor Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-bold text-slate-900">
                {portfolio.title}
              </h1>
              <Badge variant={portfolio.isPublished ? "default" : "secondary"}>
                {portfolio.isPublished ? "Published" : "Draft"}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Link href={`/preview/${portfolioId}`}>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </Link>
              {portfolio.isPublished ? (
                <Button variant="outline" onClick={unpublishPortfolio}>
                  Unpublish
                </Button>
              ) : (
                <Button onClick={publishPortfolio}>
                  <Save className="h-4 w-4 mr-2" />
                  Publish
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Content Blocks */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                  Content Blocks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {SECTION_CONFIGS.map((config) => (
                  <Button
                    key={config.type}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => addSection(config.type)}
                  >
                    <config.icon className="h-4 w-4 mr-2" />
                    {config.name}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Editor Canvas */}
          <div className="lg:col-span-2">
            <DndProvider>
              <div className="space-y-6">
                {sections.length === 0 ? (
                  <Card className="border-2 border-dashed border-slate-300">
                    <CardContent className="p-12 text-center">
                      <Layout className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">
                        Start building your portfolio
                      </h3>
                      <p className="text-slate-600 mb-6">
                        Add your first section by clicking on a content block from the left sidebar.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  sections.map((section, index) => (
                    <DraggableSection
                      key={section.id}
                      section={section}
                      index={index}
                      moveSection={moveSection}
                      onUpdate={updateSection}
                      onDelete={deleteSection}
                    />
                  ))
                )}
              </div>
            </DndProvider>
          </div>

          {/* Right Sidebar - Settings */}
          <div className="lg:col-span-1">
            <Tabs defaultValue="design" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="design">
                  <Palette className="h-4 w-4 mr-1" />
                  Design
                </TabsTrigger>
                <TabsTrigger value="media">
                  Media
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="design">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Theme Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Primary Color</Label>
                      <div className="flex space-x-2 mt-2">
                        {["#2563eb", "#7c3aed", "#dc2626", "#059669", "#ea580c"].map((color) => (
                          <button
                            key={color}
                            className="w-8 h-8 rounded-full border-2 border-slate-200"
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              const theme = portfolio.theme as any;
                              updatePortfolioMutation.mutate({
                                theme: {
                                  ...theme,
                                  colors: { ...theme.colors, primary: color },
                                },
                              });
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Typography</Label>
                      <select className="w-full mt-2 p-2 border border-slate-300 rounded-lg text-sm">
                        <option value="Inter">Inter</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Times">Times</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="media">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Media Library</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MediaGallery />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Portfolio Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-sm font-medium">
                        Portfolio Title
                      </Label>
                      <Input
                        id="title"
                        value={portfolio.title}
                        onChange={(e) => {
                          updatePortfolioMutation.mutate({ title: e.target.value });
                        }}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="domain" className="text-sm font-medium">
                        Custom Domain
                      </Label>
                      <Input
                        id="domain"
                        value={portfolio.domain || ""}
                        onChange={(e) => {
                          updatePortfolioMutation.mutate({ domain: e.target.value });
                        }}
                        placeholder="your-portfolio.com"
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="published" className="text-sm font-medium">
                        Published
                      </Label>
                      <Switch
                        id="published"
                        checked={portfolio.isPublished}
                        onCheckedChange={(checked) => {
                          updatePortfolioMutation.mutate({ isPublished: checked });
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
