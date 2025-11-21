import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Section } from "@shared/schema2";
import { Pen, Image, Video, Mail, Type, Palette } from "lucide-react";

interface SectionProps {
  section: Section;
  isEditing: boolean;
  onUpdate: (content: any, styles?: any) => void;
  onEditToggle: () => void;
}

export function HeroSection({ section, isEditing, onUpdate, onEditToggle }: SectionProps) {
  const content = section.content as any;
  const [editContent, setEditContent] = useState(content);

  const handleSave = () => {
    onUpdate(editContent);
    onEditToggle();
  };

  if (isEditing) {
    return (
      <Card className="border-2 border-dashed border-blue-500">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Input
              value={editContent.title || ""}
              onChange={(e) => setEditContent({ ...editContent, title: e.target.value })}
              placeholder="Title"
              className="text-2xl font-bold"
            />
            <Input
              value={editContent.subtitle || ""}
              onChange={(e) => setEditContent({ ...editContent, subtitle: e.target.value })}
              placeholder="Subtitle"
            />
            <Textarea
              value={editContent.description || ""}
              onChange={(e) => setEditContent({ ...editContent, description: e.target.value })}
              placeholder="Description"
              rows={3}
            />
            <Input
              value={editContent.imageUrl || ""}
              onChange={(e) => setEditContent({ ...editContent, imageUrl: e.target.value })}
              placeholder="Image URL"
            />
            <div className="flex gap-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={onEditToggle}>Cancel</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group relative hover:shadow-lg transition-shadow cursor-pointer" onClick={onEditToggle}>
      <CardContent className="p-8 text-center">
        {content.imageUrl && (
          <div className="mb-6">
            <img
              src={content.imageUrl}
              alt={content.title || "Hero image"}
              className="w-32 h-32 rounded-full object-cover mx-auto shadow-lg"
            />
          </div>
        )}
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          {content.title || "Your Name"}
        </h1>
        <p className="text-xl text-slate-600 mb-6">
          {content.subtitle || "Your Title"}
        </p>
        {content.description && (
          <p className="text-slate-600 max-w-2xl mx-auto">
            {content.description}
          </p>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pen className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

export function GallerySection({ section, isEditing, onUpdate, onEditToggle }: SectionProps) {
  const content = section.content as any;
  const [editContent, setEditContent] = useState(content);

  const handleSave = () => {
    onUpdate(editContent);
    onEditToggle();
  };

  const addImage = () => {
    const newImages = [...(editContent.images || [])];
    newImages.push({ url: "", caption: "" });
    setEditContent({ ...editContent, images: newImages });
  };

  const updateImage = (index: number, field: string, value: string) => {
    const newImages = [...(editContent.images || [])];
    newImages[index] = { ...newImages[index], [field]: value };
    setEditContent({ ...editContent, images: newImages });
  };

  const removeImage = (index: number) => {
    const newImages = editContent.images.filter((_: any, i: number) => i !== index);
    setEditContent({ ...editContent, images: newImages });
  };

  if (isEditing) {
    return (
      <Card className="border-2 border-dashed border-blue-500">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Input
              value={editContent.title || ""}
              onChange={(e) => setEditContent({ ...editContent, title: e.target.value })}
              placeholder="Gallery Title"
              className="text-xl font-semibold"
            />
            
            <div className="space-y-3">
              {(editContent.images || []).map((image: any, index: number) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={image.url}
                    onChange={(e) => updateImage(index, "url", e.target.value)}
                    placeholder="Image URL"
                    className="flex-1"
                  />
                  <Input
                    value={image.caption}
                    onChange={(e) => updateImage(index, "caption", e.target.value)}
                    placeholder="Caption"
                    className="flex-1"
                  />
                  <Button variant="destructive" size="sm" onClick={() => removeImage(index)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={addImage}>Add Image</Button>
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={onEditToggle}>Cancel</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group relative hover:shadow-lg transition-shadow cursor-pointer" onClick={onEditToggle}>
      <CardContent className="p-8">
        {content.title && (
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{content.title}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(content.images || []).map((image: any, index: number) => (
            <div key={index} className="space-y-2">
              <img
                src={image.url}
                alt={image.caption || `Gallery image ${index + 1}`}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
              {image.caption && (
                <p className="text-sm text-slate-600">{image.caption}</p>
              )}
            </div>
          ))}
        </div>
        {(!content.images || content.images.length === 0) && (
          <div className="text-center py-12 text-slate-500">
            <Image className="mx-auto h-12 w-12 mb-2" />
            <p>No images in gallery yet</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pen className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

export function TextSection({ section, isEditing, onUpdate, onEditToggle }: SectionProps) {
  const content = section.content as any;
  const [editContent, setEditContent] = useState(content);

  const handleSave = () => {
    onUpdate(editContent);
    onEditToggle();
  };

  if (isEditing) {
    return (
      <Card className="border-2 border-dashed border-blue-500">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Input
              value={editContent.title || ""}
              onChange={(e) => setEditContent({ ...editContent, title: e.target.value })}
              placeholder="Section Title"
              className="text-xl font-semibold"
            />
            <Textarea
              value={editContent.content || ""}
              onChange={(e) => setEditContent({ ...editContent, content: e.target.value })}
              placeholder="Text content"
              rows={6}
            />
            <div className="flex gap-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={onEditToggle}>Cancel</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group relative hover:shadow-lg transition-shadow cursor-pointer" onClick={onEditToggle}>
      <CardContent className="p-8">
        {content.title && (
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{content.title}</h2>
        )}
        <div className="prose prose-lg max-w-none">
          {content.content ? (
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
              {content.content}
            </p>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <Type className="mx-auto h-12 w-12 mb-2" />
              <p>Click to add text content</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pen className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

export function ContactSection({ section, isEditing, onUpdate, onEditToggle }: SectionProps) {
  const content = section.content as any;
  const [editContent, setEditContent] = useState(content);

  const handleSave = () => {
    onUpdate(editContent);
    onEditToggle();
  };

  if (isEditing) {
    return (
      <Card className="border-2 border-dashed border-blue-500">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Input
              value={editContent.title || ""}
              onChange={(e) => setEditContent({ ...editContent, title: e.target.value })}
              placeholder="Contact Section Title"
              className="text-xl font-semibold"
            />
            <Input
              value={editContent.email || ""}
              onChange={(e) => setEditContent({ ...editContent, email: e.target.value })}
              placeholder="Email Address"
              type="email"
            />
            <Input
              value={editContent.phone || ""}
              onChange={(e) => setEditContent({ ...editContent, phone: e.target.value })}
              placeholder="Phone Number"
            />
            <Textarea
              value={editContent.message || ""}
              onChange={(e) => setEditContent({ ...editContent, message: e.target.value })}
              placeholder="Contact message"
              rows={3}
            />
            <div className="flex gap-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={onEditToggle}>Cancel</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group relative hover:shadow-lg transition-shadow cursor-pointer" onClick={onEditToggle}>
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          {content.title || "Get in Touch"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {content.message && (
              <p className="text-slate-600 mb-6">{content.message}</p>
            )}
            {content.email && (
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-slate-400" />
                <span className="text-slate-600">{content.email}</span>
              </div>
            )}
            {content.phone && (
              <div className="flex items-center space-x-3">
                <span className="text-slate-600">{content.phone}</span>
              </div>
            )}
          </div>
          <div className="bg-slate-50 p-6 rounded-lg">
            <div className="space-y-4">
              <Input placeholder="Your Name" />
              <Input placeholder="Your Email" type="email" />
              <Textarea placeholder="Your Message" rows={4} />
              <Button className="w-full">Send Message</Button>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pen className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

export function VideoSection({ section, isEditing, onUpdate, onEditToggle }: SectionProps) {
  const content = section.content as any;
  const [editContent, setEditContent] = useState(content);

  const handleSave = () => {
    onUpdate(editContent);
    onEditToggle();
  };

  if (isEditing) {
    return (
      <Card className="border-2 border-dashed border-blue-500">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Input
              value={editContent.title || ""}
              onChange={(e) => setEditContent({ ...editContent, title: e.target.value })}
              placeholder="Video Section Title"
              className="text-xl font-semibold"
            />
            <Input
              value={editContent.videoUrl || ""}
              onChange={(e) => setEditContent({ ...editContent, videoUrl: e.target.value })}
              placeholder="Video URL (YouTube, Vimeo, etc.)"
            />
            <Textarea
              value={editContent.description || ""}
              onChange={(e) => setEditContent({ ...editContent, description: e.target.value })}
              placeholder="Video description"
              rows={3}
            />
            <div className="flex gap-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={onEditToggle}>Cancel</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group relative hover:shadow-lg transition-shadow cursor-pointer" onClick={onEditToggle}>
      <CardContent className="p-8">
        {content.title && (
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{content.title}</h2>
        )}
        {content.videoUrl ? (
          <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
            <iframe
              src={content.videoUrl}
              className="w-full h-full rounded-lg"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-slate-500">
              <Video className="mx-auto h-12 w-12 mb-2" />
              <p>Click to add video</p>
            </div>
          </div>
        )}
        {content.description && (
          <p className="text-slate-600 mt-4">{content.description}</p>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pen className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

export const SECTION_TYPES = {
  hero: HeroSection,
  gallery: GallerySection,
  text: TextSection,
  contact: ContactSection,
  video: VideoSection,
};

export const SECTION_CONFIGS = [
  {
    type: "hero",
    name: "Hero Section",
    icon: Palette,
    description: "Add a hero banner with your name and profile",
  },
  {
    type: "gallery",
    name: "Gallery",
    icon: Image,
    description: "Showcase your work with image galleries",
  },
  {
    type: "text",
    name: "Text Block",
    icon: Type,
    description: "Add text content and descriptions",
  },
  {
    type: "contact",
    name: "Contact Form",
    icon: Mail,
    description: "Let visitors get in touch with you",
  },
  {
    type: "video",
    name: "Video",
    icon: Video,
    description: "Embed videos from YouTube, Vimeo, etc.",
  },
];
