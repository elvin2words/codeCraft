import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { SECTION_TYPES } from "@/components/portfolio/section-types";
import { Section, Page, Portfolio } from "@shared/schema2";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Settings } from "lucide-react";
import { Link } from "wouter";

export default function Preview() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const { data: portfolio, isLoading, error } = useQuery({
    queryKey: ["/api/portfolios", id],
    enabled: !!id && isAuthenticated,
  });

  const { data: pages } = useQuery({
    queryKey: ["/api/portfolios", id, "pages"],
    enabled: !!id && isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Portfolio Not Found</h1>
          <p className="text-slate-600">The portfolio you're trying to preview doesn't exist.</p>
          <Link href="/">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const homePage = pages?.find((page: Page) => page.isHomePage) || pages?.[0];

  if (!homePage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">No Content</h1>
          <p className="text-slate-600">This portfolio doesn't have any content yet.</p>
          <Link href={`/editor/${portfolio.id}`}>
            <Button className="mt-4">
              <Settings className="mr-2 h-4 w-4" />
              Edit Portfolio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Apply theme
  const theme = portfolio.theme as any;
  const primaryColor = theme?.colors?.primary || "#2563eb";

  return (
    <div className="min-h-screen bg-white" style={{ "--primary": primaryColor } as any}>
      {/* Preview Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            <div className="flex items-center space-x-4">
              <Link href={`/editor/${portfolio.id}`}>
                <Button variant="ghost" size="sm" className="text-white hover:text-slate-300">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Editor
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span className="text-sm font-medium">Preview: {portfolio.title}</span>
              </div>
            </div>
            <div className="text-xs text-slate-400">
              This is how your portfolio will look to visitors
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      {pages && pages.length > 1 && (
        <nav className="bg-white border-b border-slate-200 sticky top-12 z-40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-16 space-x-8">
              {pages.map((page: Page) => (
                <a
                  key={page.id}
                  href={`#${page.slug}`}
                  className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
                >
                  {page.title}
                </a>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* Page Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-16">
          {homePage.sections?.map((section: Section) => {
            const SectionComponent = SECTION_TYPES[section.type as keyof typeof SECTION_TYPES];
            
            if (!SectionComponent) {
              return null;
            }

            return (
              <div key={section.id}>
                <SectionComponent
                  section={section}
                  isEditing={false}
                  onUpdate={() => {}}
                  onEditToggle={() => {}}
                />
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500 text-sm">
            Built with CreativePort
          </p>
        </div>
      </footer>
    </div>
  );
}