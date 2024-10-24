"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTask } from "@/actions/tasks/create-task";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Due date is required"),
  status: z.string().min(1, "Status is required"),
  type: z.string().min(1, "Type is required"),
});

type TaskFormData = z.infer<typeof taskSchema>;

const defaultValues: TaskFormData = {
  title: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
  status: "pending",
  type: "general",
};

export function AddTaskSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues,
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      const result = await createTask(data);
      if (result) {
        toast.success("Task created", {
          description: `${result.title} has been added.`,
        });
        setIsOpen(false);
        reset(defaultValues);
      } else {
        toast.error("Could not create task", {
          description: "Please try again later.",
        });
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("An unexpected error occurred", {
        description: "Please try again later.",
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>Add Task</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add New Task</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} />
          </div>
          <div>
            <Label htmlFor="date">Due Date</Label>
            <Input type="date" id="date" {...register("date")} />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={(value) =>
                register("status").onChange({ target: { value } })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Select
              onValueChange={(value) =>
                register("type").onChange({ target: { value } })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="followup">Follow-up</SelectItem>
                <SelectItem value="document">Document</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-red-500 text-sm">{errors.type.message}</p>
            )}
          </div>
          <Button type="submit">Create Task</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
