import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";

interface NoteCardProps {
  id: string; // Changed from number to string
  uuid: string;
  title: string;
  content: string;
  companyName: string;
  date: string;
  onEdit: (uuid: string) => void;
}

export function NoteCard({
  id,
  uuid,
  title,
  content,
  companyName,
  date,
  onEdit,
}: NoteCardProps) {
  const formattedDate = formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: nb,
  });

  return (
    <Card className="w-full h-[300px] flex flex-col overflow-hidden">
      <CardHeader
        className="pb-2 bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
        onClick={() => onEdit(uuid)}
      >
        <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
        <p className="text-xs text-muted-foreground">{formattedDate}</p>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto py-4">
        <div
          className="text-sm text-muted-foreground prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </CardContent>
      <CardFooter className="bg-muted/50 justify-end mt-auto py-3 px-6">
        <Badge variant="secondary" className="text-xs">
          {companyName}
        </Badge>
      </CardFooter>
    </Card>
  );
}
