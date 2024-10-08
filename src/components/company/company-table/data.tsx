import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

export const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "todo",
    label: "Todo",
    icon: CircleIcon,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: StopwatchIcon,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircledIcon,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: CrossCircledIcon,
  },
];

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
];

import { BuildingIcon, UserIcon, UsersIcon } from "lucide-react";

export const companyTypes = [
  {
    value: "CUSTOMER",
    label: "Kunde",
    icon: BuildingIcon,
  },
  {
    value: "LEAD",
    label: "Lead",
    icon: UserIcon,
  },
  {
    value: "PARTNER",
    label: "Partner",
    icon: UsersIcon,
  },
];

export const companyStatuses = [
  {
    value: "ACTIVE",
    label: "Aktiv",
  },
  {
    value: "INACTIVE",
    label: "Inaktiv",
  },
  {
    value: "PROSPECT",
    label: "Prospekt",
  },
];

export const companyPriorities = [
  {
    value: "HIGH",
    label: "Høy",
  },
  {
    value: "MEDIUM",
    label: "Medium",
  },
  {
    value: "LOW",
    label: "Lav",
  },
];
