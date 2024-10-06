"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building,
  MapPin,
  DollarSign,
  Calendar,
  Globe,
  Users,
  Linkedin,
  Clock,
  Twitter,
  Check,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { cn, extractDomain } from "@/lib/utils";
import Link from "next/link";
import { AccountOwnerCombobox } from "./AccountOwnerComboBox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface OwnerInfo {
  name: string;
  orgNumber: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  arr: string;
  createdBy: string;
  website: string;
  employees: string;
  linkedin: string;
  lastUpdated: string;
  twitter: string;
  addedDate: string;
  contactPersonUuid: string; // Add this new property
}

interface InfoItem {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  isLink?: boolean;
  isBadge?: boolean;
  linkPrefix?: string;
  displayValue?: string; // Add this property
  editable?: boolean;
  onUpdate?: (newValue: string) => void;
}

export function CompanyUserDetails({
  companyDetails,
}: {
  companyDetails: { name: string };
}) {
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfo>({
    name: "Propdock AS",
    orgNumber: "912345678",
    contactPerson: "Christer Hagen",
    contactPersonUuid: "123e4567-e89b-12d3-a456-426614174000",
    email: "christer@propdock.no",
    phone: "+47 123 45 678",
    address: "Storgata 1, 0123 Oslo",
    arr: "10 000 000 NOK",
    createdBy: "John Doe",
    website: "https://propdock.no",
    employees: "50",
    linkedin: "https://linkedin.com/company/propdock",
    lastUpdated: "2023-04-15",
    twitter: "https://twitter.com/propdock",
    addedDate: "2023-05-15T10:30:00Z",
  });

  const [isOrgNumberPopoverOpen, setIsOrgNumberPopoverOpen] = useState(false);
  const [editedOrgNumber, setEditedOrgNumber] = useState(ownerInfo.orgNumber);

  const handleUpdateOrgNumber = () => {
    setOwnerInfo((prevInfo) => ({
      ...prevInfo,
      orgNumber: editedOrgNumber,
    }));
    setIsOrgNumberPopoverOpen(false);
  };

  const handleCancelOrgNumberEdit = () => {
    setEditedOrgNumber(ownerInfo.orgNumber);
    setIsOrgNumberPopoverOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "d. MMMM yyyy", { locale: nb });
  };

  const getTimeAgo = (dateString: string) => {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: nb });
  };

  const addedTimeAgo = getTimeAgo(ownerInfo.addedDate);

  const infoItems: InfoItem[] = [
    {
      icon: Building,
      label: "Org.nr",
      value: ownerInfo.orgNumber,
      editable: true,
    },
    { icon: MapPin, label: "Adresse", value: ownerInfo.address },
    { icon: DollarSign, label: "ARR", value: ownerInfo.arr },
    { icon: Calendar, label: "Opprettet av", value: ownerInfo.createdBy },
    {
      icon: Globe,
      label: "Nettside",
      value: ownerInfo.website,
      isLink: true,
      isBadge: true,
      displayValue: extractDomain(ownerInfo.website), // Add this line
    },
    { icon: Users, label: "Ansatte", value: ownerInfo.employees },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: ownerInfo.linkedin,
      isLink: true,
      isBadge: true,
      displayValue: extractDomain(ownerInfo.linkedin), // Add this line
    },
    {
      icon: Clock,
      label: "Sist oppdatert",
      value: formatDate(ownerInfo.lastUpdated),
    },
    {
      icon: Twitter,
      label: "Twitter",
      value: ownerInfo.twitter,
      isLink: true,
      isBadge: true,
      displayValue: extractDomain(ownerInfo.twitter), // Add this line
    },
    // Commented out items
    // {
    //   icon: Mail,
    //   label: "E-post",
    //   value: ownerInfo.email,
    //   isLink: true,
    //   linkPrefix: "mailto:",
    // },
    // {
    //   icon: Phone,
    //   label: "Telefon",
    //   value: ownerInfo.phone,
    //   isLink: true,
    //   linkPrefix: "tel:",
    // },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/path-to-company-logo.png" alt={ownerInfo.name} />
            <AvatarFallback>
              {ownerInfo.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{ownerInfo.name}</h3>
            <span className="block text-xs text-muted-foreground mt-1">
              Lagt til {addedTimeAgo}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {infoItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <item.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground font-medium min-w-[100px]">
                {item.label}:
              </span>
              {item.editable ? (
                <Popover
                  open={isOrgNumberPopoverOpen}
                  onOpenChange={setIsOrgNumberPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="p-0 h-auto font-normal">
                      <span className="text-sm text-muted-foreground">
                        {item.value}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <Input
                        value={editedOrgNumber}
                        onChange={(e) => setEditedOrgNumber(e.target.value)}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelOrgNumberEdit}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleUpdateOrgNumber}>
                          <Check className="h-4 w-4 mr-1" />
                          Confirm
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ) : item.isLink ? (
                item.isBadge ? (
                  <Badge variant="secondary" className="font-normal">
                    <a
                      href={item.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:underline text-muted-foreground"
                    >
                      {item.displayValue || item.value}
                    </a>
                  </Badge>
                ) : (
                  <a
                    href={
                      item.linkPrefix
                        ? `${item.linkPrefix}${item.value}`
                        : item.value
                    }
                    target={item.linkPrefix ? "_self" : "_blank"}
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    {item.displayValue || item.value}
                  </a>
                )
              ) : (
                <span className="text-sm text-muted-foreground">
                  {item.value}
                </span>
              )}
            </div>
          ))}
          <Separator className="my-4" />
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-muted-foreground">
                Account Owner
              </h4>
              <AccountOwnerCombobox />
            </div>
            <Link
              href={`/people/${ownerInfo.contactPersonUuid}`}
              className="inline-block"
            >
              <div className="inline-flex items-center gap-2 bg-secondary rounded-full py-1 px-2 hover:bg-secondary/80 transition-colors">
                <div
                  className={cn(
                    "flex items-center justify-center",
                    "w-6 h-6 rounded-full bg-orange-100 text-orange-500",
                    "text-xs font-medium"
                  )}
                >
                  {ownerInfo.contactPerson.charAt(0)}
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {ownerInfo.contactPerson}
                </span>
              </div>
            </Link>
          </div>
          <Separator className="my-4" />
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Muligheter
            </h4>
            <div className="inline-flex items-center gap-2 bg-secondary rounded-full py-1 px-2">
              <div
                className={cn(
                  "flex items-center justify-center",
                  "w-6 h-6 rounded-full bg-orange-100 text-orange-500",
                  "text-xs font-medium"
                )}
              >
                {ownerInfo.contactPerson.charAt(0)}
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {ownerInfo.contactPerson}
              </span>
            </div>
          </div>
          <Separator className="my-4" />
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Personer
            </h4>
            <div className="inline-flex items-center gap-2 bg-secondary rounded-full py-1 px-2">
              <div
                className={cn(
                  "flex items-center justify-center",
                  "w-6 h-6 rounded-full bg-orange-100 text-orange-500",
                  "text-xs font-medium"
                )}
              >
                {ownerInfo.contactPerson.charAt(0)}
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {ownerInfo.contactPerson}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
