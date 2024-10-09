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
import { format, parseISO, formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { cn, extractDomain } from "@/lib/utils";
import Link from "next/link";
import { AccountOwnerCombobox } from "./AccountOwnerComboBox";
import { OpportunityCombobox } from "./OpportunityCombobox";
import { PersonCombobox } from "./PersonCombobox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import countries from "@/lib/countries";

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
  accountOwners: Array<{ name: string; uuid: string }>;
  opportunities: Array<{ name: string; uuid: string }>;
  people: Array<{ name: string; uuid: string }>;
}

interface InfoItem {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  isLink?: boolean;
  isBadge?: boolean;
  linkPrefix?: string;
  displayValue?: string;
  editable?: boolean;
}

// Define the Zod schema for address validation
const addressSchema = z.object({
  address1: z.string().min(1, "Adresse 1 er påkrevd"),
  address2: z.string().optional(),
  postcode: z.string().min(4, "Postnummer må være minst 4 siffer"),
  city: z.string().min(1, "By er påkrevd"),
  country: z.string().min(1, "Land er påkrevd"),
});

type AddressFormData = z.infer<typeof addressSchema>;

export function CompanyUserDetails({
  companyDetails,
}: {
  companyDetails: { name: string };
}) {
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfo>({
    name: "Propdock AS",
    orgNumber: "912345678",
    contactPerson: "Christer Hagen",
    email: "christer@propdock.no",
    phone: "+47 123 45 678",
    address: "Storgata 1, 0123 Oslo",
    arr: "1 000 000 NOK",
    createdBy: "John Doe",
    website: "https://propdock.no",
    employees: "50",
    linkedin: "https://linkedin.com/company/propdock",
    lastUpdated: "2023-04-15",
    twitter: "https://twitter.com/propdock",
    addedDate: "2023-05-15T10:30:00Z",
    accountOwners: [
      { name: "Christer Hagen", uuid: "123e4567-e89b-12d3-a456-426614174000" },
    ],
    opportunities: [
      { name: "Mulighet 1", uuid: "123e4567-e89b-12d3-a456-426614174001" },
      { name: "Mulighet 2", uuid: "123e4567-e89b-12d3-a456-426614174002" },
    ],
    people: [
      { name: "Christer Hagen", uuid: "123e4567-e89b-12d3-a456-426614174003" },
      { name: "John Doe", uuid: "123e4567-e89b-12d3-a456-426614174004" },
      { name: "Jane Doe", uuid: "123e4567-e89b-12d3-a456-426614174005" },
    ],
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

  const [isAddressPopoverOpen, setIsAddressPopoverOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address1: "",
      address2: "",
      postcode: "",
      city: "",
      country: "",
    },
  });

  const handleUpdateAddress = (data: AddressFormData) => {
    const selectedCountry = countries.find(
      (country) => country.code === data.country
    );
    const countryName = selectedCountry ? selectedCountry.name : data.country;

    setOwnerInfo((prevInfo) => ({
      ...prevInfo,
      address: `${data.address1}, ${data.postcode} ${data.city}, ${countryName}`,
    }));
    setIsAddressPopoverOpen(false);
    reset();
  };

  const handleCancelAddressEdit = () => {
    reset();
    setIsAddressPopoverOpen(false);
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
    {
      icon: MapPin,
      label: "Adresse",
      value: ownerInfo.address,
      editable: true,
    },
    { icon: DollarSign, label: "ARR", value: ownerInfo.arr },
    { icon: Calendar, label: "Opprettet av", value: ownerInfo.createdBy },
    {
      icon: Globe,
      label: "Nettside",
      value: ownerInfo.website,
      isLink: true,
      isBadge: true,
      displayValue: extractDomain(ownerInfo.website),
    },
    { icon: Users, label: "Ansatte", value: ownerInfo.employees },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: ownerInfo.linkedin,
      isLink: true,
      isBadge: true,
      displayValue: extractDomain(ownerInfo.linkedin),
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
      displayValue: extractDomain(ownerInfo.twitter),
    },
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
                item.label === "Org.nr" ? (
                  <Popover
                    open={isOrgNumberPopoverOpen}
                    onOpenChange={setIsOrgNumberPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="p-0 h-auto font-normal"
                      >
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
                ) : item.label === "Adresse" ? (
                  <Popover
                    open={isAddressPopoverOpen}
                    onOpenChange={setIsAddressPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="p-0 h-auto font-normal"
                      >
                        <span className="text-sm text-muted-foreground">
                          {item.value}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <form
                        onSubmit={handleSubmit(handleUpdateAddress)}
                        className="grid gap-4"
                      >
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">
                            Adressedetaljer
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Vennligst fyll inn adresseinformasjonen.
                          </p>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="address1">Adresse 1</Label>
                          <Input
                            id="address1"
                            placeholder="Storgata 1"
                            {...register("address1")}
                          />
                          {errors.address1 && (
                            <p className="text-sm text-red-500">
                              {errors.address1.message}
                            </p>
                          )}
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="address2">Adresse 2</Label>
                          <Input
                            id="address2"
                            placeholder="Leilighet 4B"
                            {...register("address2")}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="postcode">Postnummer</Label>
                            <Input
                              id="postcode"
                              placeholder="0123"
                              {...register("postcode")}
                            />
                            {errors.postcode && (
                              <p className="text-sm text-red-500">
                                {errors.postcode.message}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="city">By</Label>
                            <Input
                              id="city"
                              placeholder="Oslo"
                              {...register("city")}
                            />
                            {errors.city && (
                              <p className="text-sm text-red-500">
                                {errors.city.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="country">Land</Label>
                          <Controller
                            name="country"
                            control={control}
                            render={({ field }) => (
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger id="country">
                                  <SelectValue placeholder="Velg land" />
                                </SelectTrigger>
                                <SelectContent>
                                  {countries.map((country) => (
                                    <SelectItem
                                      key={country.code}
                                      value={country.code}
                                    >
                                      {country.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.country && (
                            <p className="text-sm text-red-500">
                              {errors.country.message}
                            </p>
                          )}
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={handleCancelAddressEdit}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Avbryt
                          </Button>
                          <Button type="submit" size="sm">
                            <Check className="h-4 w-4 mr-1" />
                            Bekreft
                          </Button>
                        </div>
                      </form>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {item.value}
                  </span>
                )
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
                Account Owner ({ownerInfo.accountOwners.length})
              </h4>
              <AccountOwnerCombobox />
            </div>
            {ownerInfo.accountOwners.map((owner, index) => (
              <Link
                key={index}
                href={`/people/${owner.uuid}`}
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
                    {owner.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {owner.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-muted-foreground">
                Muligheter ({ownerInfo.opportunities.length})
              </h4>
              <OpportunityCombobox />
            </div>
            {ownerInfo.opportunities.map((opportunity, index) => (
              <Link
                key={index}
                href={`/opportunity/${opportunity.uuid}`}
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
                    {opportunity.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {opportunity.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-muted-foreground">
                Personer ({ownerInfo.people.length})
              </h4>
              <PersonCombobox />
            </div>
            {ownerInfo.people.map((person, index) => (
              <Link
                key={index}
                href={`/people/${person.uuid}`}
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
                    {person.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {person.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
