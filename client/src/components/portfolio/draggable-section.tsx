import { useDrag, useDrop } from "react-dnd";
import { Section } from "@shared/schema2";
import { SECTION_TYPES } from "./section-types";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2 } from "lucide-react";
import { useState } from "react";

interface DraggableSectionProps {
  section: Section;
  index: number;
  moveSection: (dragIndex: number, hoverIndex: number) => void;
  onUpdate: (id: number, content: any, styles?: any) => void;
  onDelete: (id: number) => void;
}

export function DraggableSection({
  section,
  index,
  moveSection,
  onUpdate,
  onDelete,
}: DraggableSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [{ isDragging }, drag, preview] = useDrag({
    type: "section",
    item: { id: section.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "section",
    hover: (item: { id: number; index: number }) => {
      if (item.index !== index) {
        moveSection(item.index, index);
        item.index = index;
      }
    },
  });

  const SectionComponent = SECTION_TYPES[section.type as keyof typeof SECTION_TYPES];

  if (!SectionComponent) {
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-600">Unknown section type: {section.type}</p>
      </div>
    );
  }

  const handleUpdate = (content: any, styles?: any) => {
    onUpdate(section.id, content, styles);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div
      ref={(node) => {
        drag(drop(node));
        preview(node);
      }}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="relative group"
    >
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(section.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <SectionComponent
        section={section}
        isEditing={isEditing}
        onUpdate={handleUpdate}
        onEditToggle={handleEditToggle}
      />
    </div>
  );
}
