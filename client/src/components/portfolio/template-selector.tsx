import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  sections: string[];
}

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

const TEMPLATES: Template[] = [
  {
    id: "minimal",
    name: "Minimal Studio",
    description: "Clean and elegant design perfect for photographers",
    category: "Photography",
    preview: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
    sections: ["hero", "gallery", "text", "contact"],
  },
  {
    id: "creative",
    name: "Creative Canvas",
    description: "Bold layouts for artists and creative professionals",
    category: "Art",
    preview: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
    sections: ["hero", "gallery", "text", "video", "contact"],
  },
  {
    id: "professional",
    name: "Design Pro",
    description: "Modern layouts for UI/UX designers and digital professionals",
    category: "Design",
    preview: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
    sections: ["hero", "gallery", "text", "contact"],
  },
  {
    id: "architecture",
    name: "Architecture Hub",
    description: "Professional layouts for architects and planners",
    category: "Architecture",
    preview: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
    sections: ["hero", "gallery", "text", "contact"],
  },
  {
    id: "fashion",
    name: "Fashion Focus",
    description: "Elegant templates for fashion and lifestyle photography",
    category: "Photography",
    preview: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
    sections: ["hero", "gallery", "text", "contact"],
  },
  {
    id: "tech",
    name: "Tech Startup",
    description: "Modern layouts for digital products and startups",
    category: "Design",
    preview: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
    sections: ["hero", "text", "gallery", "contact"],
  },
];

const CATEGORIES = ["All", "Photography", "Design", "Art", "Architecture"];

export function TemplateSelector({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Choose your template
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Start with a professionally designed template that fits your creative style
        </p>
      </div>

      {/* Template Categories */}
      <div className="flex flex-wrap justify-center gap-4">
        {CATEGORIES.map((category) => (
          <Button
            key={category}
            variant={category === "All" ? "default" : "outline"}
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((template) => (
          <Card
            key={template.id}
            className={`group cursor-pointer transition-all hover:shadow-lg ${
              selectedTemplate === template.id
                ? "ring-2 ring-blue-500 shadow-lg"
                : ""
            }`}
            onClick={() => onSelectTemplate(template.id)}
          >
            <div className="aspect-[4/3] overflow-hidden rounded-t-lg relative">
              <img
                src={template.preview}
                alt={template.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {selectedTemplate === template.id && (
                <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                  <div className="bg-blue-500 text-white rounded-full p-2">
                    <Check className="h-6 w-6" />
                  </div>
                </div>
              )}
            </div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-900">
                  {template.name}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {template.category}
                </Badge>
              </div>
              <p className="text-slate-600 text-sm mb-4">
                {template.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {template.sections.map((section) => (
                  <Badge key={section} variant="outline" className="text-xs">
                    {section}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
