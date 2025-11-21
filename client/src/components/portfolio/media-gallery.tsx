import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Media } from "@shared/schema2";
import { Upload, Image, Trash2, Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface MediaGalleryProps {
  onSelectMedia?: (media: Media) => void;
  showSelectButton?: boolean;
}

export function MediaGallery({ onSelectMedia, showSelectButton = false }: MediaGalleryProps) {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [copiedUrls, setCopiedUrls] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Fetch user media
  const { data: mediaFiles, isLoading } = useQuery({
    queryKey: ["/api/media"],
  });

  // Upload media mutation
  const uploadMediaMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload failed");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      toast({ title: "Media uploaded successfully!" });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete media mutation
  const deleteMediaMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/media/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      toast({ title: "Media deleted successfully!" });
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(files);
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles) return;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      await uploadMediaMutation.mutateAsync(file);
    }

    setSelectedFiles(null);
    setIsUploadDialogOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrls(prev => new Set(prev).add(url));
      toast({ title: "URL copied to clipboard!" });
      
      setTimeout(() => {
        setCopiedUrls(prev => {
          const newSet = new Set(prev);
          newSet.delete(url);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "Failed to copy URL",
        variant: "destructive",
      });
    }
  };

  const getFileType = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    return "file";
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-slate-600">Loading media...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900">Media Library</h3>
        
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Media
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Media Files</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="cursor-pointer"
                />
                <p className="text-sm text-slate-500 mt-2">
                  Select images or videos to upload (max 10MB each)
                </p>
              </div>
              
              {selectedFiles && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Selected files:</p>
                  {Array.from(selectedFiles).map((file, index) => (
                    <div key={index} className="text-sm text-slate-600">
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setIsUploadDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFiles || uploadMediaMutation.isPending}
                >
                  {uploadMediaMutation.isPending ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mediaFiles && mediaFiles.length > 0 ? (
          mediaFiles.map((media: Media) => (
            <Card key={media.id} className="group relative overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square bg-slate-100 flex items-center justify-center">
                  {getFileType(media.mimeType) === "image" ? (
                    <img
                      src={media.url}
                      alt={media.originalName}
                      className="w-full h-full object-cover"
                    />
                  ) : getFileType(media.mimeType) === "video" ? (
                    <video
                      src={media.url}
                      className="w-full h-full object-cover"
                      muted
                    />
                  ) : (
                    <div className="text-center p-4">
                      <Image className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                      <p className="text-xs text-slate-500 truncate">
                        {media.originalName}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => copyToClipboard(media.url)}
                    >
                      {copiedUrls.has(media.url) ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    
                    {showSelectButton && onSelectMedia && (
                      <Button
                        size="sm"
                        onClick={() => onSelectMedia(media)}
                      >
                        Select
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMediaMutation.mutate(media.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
              
              <div className="p-2">
                <p className="text-xs text-slate-600 truncate">
                  {media.originalName}
                </p>
                <p className="text-xs text-slate-400">
                  {(media.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Image className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No media files yet
            </h3>
            <p className="text-slate-600 mb-4">
              Upload images and videos to use in your portfolio
            </p>
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Your First File
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}