import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NoteCardProps {
  title: string;
  description: string;
  companyName: string;
}

export function NoteCard({ title, description, companyName }: NoteCardProps) {
  return (
    <Card className="w-full h-[300px] flex flex-col overflow-hidden">
      <CardHeader className="pb-2 bg-muted/50">
        <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden py-4">
        <p className="text-sm text-muted-foreground line-clamp-6">
          {description}
        </p>
      </CardContent>
      <CardFooter className="bg-muted/50 justify-end mt-auto py-3 px-6">
        <Badge variant="secondary" className="text-xs">
          {companyName}
        </Badge>
      </CardFooter>
    </Card>
  );
}
