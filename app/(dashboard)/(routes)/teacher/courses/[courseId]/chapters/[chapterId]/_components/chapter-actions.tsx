"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface ChapterActionsProps {
  disable: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

export const ChapterActions = ({ disable, courseId, chapterId, isPublished }: ChapterActionsProps) => {
  return (
    <div className="flex items-center gap-x-2">
      <Button type="button" onClick={() => {}} disabled={disable} variant="outline" size="sm">
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <Button type="button" size="sm">
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};
