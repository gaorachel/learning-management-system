import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import React from "react";

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
}

export const CourseEnrollButton = ({ price, courseId }: CourseEnrollButtonProps) => {
  return (
    <div>
      <Button className="w-full md:w-auto" size="sm">
        Enroll for {formatPrice(price)}
      </Button>
    </div>
  );
};
