"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TaskDetailsData,
  PersonData,
  OpportunityData,
} from "@/lib/internal-api/types";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, X, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface TaskUserDetailsProps {
  taskDetails: TaskDetailsData;
}

export function TaskUserDetails({ taskDetails }: TaskUserDetailsProps) {
  const [relatedPeople, setRelatedPeople] = useState<PersonData[]>(
    taskDetails.people || []
  );
  const [relatedOpportunities, setRelatedOpportunities] = useState<
    OpportunityData[]
  >(taskDetails.opportunities || []);
  const [removingPersonId, setRemovingPersonId] = useState<number | null>(null);
  const [removingOpportunityId, setRemovingOpportunityId] = useState<
    number | null
  >(null);

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "d. MMMM yyyy", { locale: nb });
  };

  const getTimeAgo = (dateString: string) => {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: nb });
  };

  const addedTimeAgo = getTimeAgo(taskDetails.date_created);

  const handleRemovePerson = async (personId: number) => {
    setRemovingPersonId(personId);
    try {
      // Logic to remove person from task
      setRelatedPeople((prevPeople) =>
        prevPeople.filter((person) => person.id !== personId)
      );
      toast.success("Person removed from task");
    } catch (error) {
      console.error("Error removing person:", error);
      toast.error("An error occurred while removing the person");
    } finally {
      setRemovingPersonId(null);
    }
  };

  const handleRemoveOpportunity = async (opportunityId: number) => {
    setRemovingOpportunityId(opportunityId);
    try {
      // Logic to remove opportunity from task
      setRelatedOpportunities((prevOpportunities) =>
        prevOpportunities.filter((opp) => opp.id !== opportunityId)
      );
      toast.success("Opportunity removed from task");
    } catch (error) {
      console.error("Error removing opportunity:", error);
      toast.error("An error occurred while removing the opportunity");
    } finally {
      setRemovingOpportunityId(null);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-4">
          <div className="flex-grow min-w-0">
            <h3 className="text-lg font-semibold truncate">
              {taskDetails.title}
            </h3>
            <span className="block text-xs text-muted-foreground mt-1">
              Laget for {addedTimeAgo}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-medium min-w-[100px]">
              Status:
            </span>
            <span className="text-sm text-muted-foreground">
              {taskDetails.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-medium min-w-[100px]">
              Type:
            </span>
            <span className="text-sm text-muted-foreground">
              {taskDetails.type}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-medium min-w-[100px]">
              Due Date:
            </span>
            <span className="text-sm text-muted-foreground">
              {formatDate(taskDetails.date)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-medium min-w-[100px]">
              Description:
            </span>
            <span className="text-sm text-muted-foreground">
              {taskDetails.description || "No description"}
            </span>
          </div>

          <Separator className="my-4" />

          {/* Related People Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-muted-foreground">
                People ({relatedPeople.length})
              </h4>
              {/* Add a person selector component here if needed */}
            </div>
            {relatedPeople.map((person) => (
              <div key={person.id} className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 bg-secondary rounded-full py-1 pl-2 pr-1 hover:bg-secondary/80 transition-colors">
                  <Link
                    href={`/people/${person.uuid}`}
                    className="flex items-center gap-2 flex-grow"
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center",
                        "w-6 h-6 rounded-full bg-orange-100 text-orange-500",
                        "text-xs font-medium"
                      )}
                    >
                      {person.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {person.name}
                    </span>
                  </Link>
                  <Separator orientation="vertical" className="h-4 mx-1" />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-transparent -ml-2"
                      >
                        <Trash2 className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemovePerson(person.id)}
                        disabled={removingPersonId === person.id}
                      >
                        {removingPersonId === person.id ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-2" />
                        )}
                        Remove
                      </Button>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Related Opportunities Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-muted-foreground">
                Opportunities ({relatedOpportunities.length})
              </h4>
              {/* Add an opportunity selector component here if needed */}
            </div>
            {relatedOpportunities.map((opportunity) => (
              <div key={opportunity.id} className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 bg-secondary rounded-full py-1 pl-2 pr-1 hover:bg-secondary/80 transition-colors">
                  <Link
                    href={`/opportunity/${opportunity.uuid}`}
                    className="flex items-center gap-2 flex-grow"
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center",
                        "w-6 h-6 rounded-full bg-orange-100 text-orange-500",
                        "text-xs font-medium"
                      )}
                    >
                      {opportunity.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {opportunity.name}
                    </span>
                  </Link>
                  <Separator orientation="vertical" className="h-4 mx-1" />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-transparent -ml-2"
                      >
                        <Trash2 className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveOpportunity(opportunity.id)}
                        disabled={removingOpportunityId === opportunity.id}
                      >
                        {removingOpportunityId === opportunity.id ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-2" />
                        )}
                        Remove
                      </Button>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
