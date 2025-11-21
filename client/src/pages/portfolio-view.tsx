import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { SECTION_TYPES } from "@/components/portfolio/section-types";
import { Section, Page, Portfolio } from "@shared/schema2";

export default function PortfolioView() {
  const { domain } = useParams();

  const { data: portfolio, isLoading, error } = useQuery({
    queryKey: ["/api/public/portfolios/domain", domain],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Portfolio Not Found</h1>
          <p className="text-slate-600">The portfolio you're looking for doesn't exist or is not published.</p>
        </div>
      </div>
    );
  }

  const homePage = portfolio.pages?.find((page: Page) => page.isHomePage) || portfolio.pages?.[0];

  if (!homePage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">No Content</h1>
          <p className="text-slate-600">This portfolio doesn't have any content yet.</p>
        </div>
      </div>
    );
  }

  // Apply theme
  const theme = portfolio.theme as any;
  const primaryColor = theme?.colors?.primary || "#2563eb";

  return (
    <div className="min-h-screen bg-white" style={{ "--primary": primaryColor } as any}>
      {/* Navigation */}
      {portfolio.pages && portfolio.pages.length > 1 && (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-16 space-x-8">
              {portfolio.pages.map((page: Page) => (
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
