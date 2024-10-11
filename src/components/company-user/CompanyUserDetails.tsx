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
import { updateCompany } from "@/actions/company/update-companies";
import { toast } from "sonner";

interface CompanyDetails {
  id: number;
  last_contacted: string;
  potential_revenue: number;
  contact_points: number;
  num_tasks: number;
  notes: any[];
  default_contact: null | any;
  contacts: any[];
  labels_details: any[];
  opportunities: Array<{
    id: number;
    uuid: string;
    name: string;
  }>;
  people: Array<{
    id: number;
    uuid: string;
    date_created: string;
    last_modified: string;
    name: string;
    title: string;
    phone: string;
    email: string;
    department: string;
    address_street: string;
    address_zip: string;
    address_city: string;
    pref_com: string;
    url: string;
    user: number;
    workspace: number;
    company: number;
  }>;
  account_owners: Array<{
    id: number;
    clerk_id: string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
  }>;
  timeline: any[];
  type: string;
  business: boolean;
  uuid: string;
  date_created: string;
  name: string;
  orgnr: string;
  address_street: string;
  address_zip: string;
  address_city: string;
  address_municipalty: string;
  url: string;
  some_linked: string;
  some_face: string;
  some_insta: string;
  some_twitter: string;
  status: string;
  label: string;
  priority: string;
  stage: number;
  date_converted: string;
  arr: number;
  contact_person: string;
  title: string;
  phone: string;
  email: string;
  all_contacts: null | any;
  current_business: string;
  preferred_communication: string;
  region: string;
  ceo: string;
  adm_manager: string;
  adm_board: string[];
  orgform: string;
  sections: string;
  comments_1: string;
  comments_2: string;
  num_employees: number;
  company: number;
  user: number;
  lead: null | any;
  contact: null | any;
  department: any[];
  labels: any[];
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
});

type AddressFormData = z.infer<typeof addressSchema>;

export function CompanyUserDetails({
  companyDetails,
}: {
  companyDetails: CompanyDetails;
}) {
  const [editedCompanyName, setEditedCompanyName] = useState(
    companyDetails.name
  );
  const [editedOrgNumber, setEditedOrgNumber] = useState(companyDetails.orgnr);
  const [editedArr, setEditedArr] = useState(companyDetails.arr.toString());
  const [editedEmployees, setEditedEmployees] = useState(
    companyDetails.num_employees.toString()
  );

  const [isOrgNumberPopoverOpen, setIsOrgNumberPopoverOpen] = useState(false);
  const [isAddressPopoverOpen, setIsAddressPopoverOpen] = useState(false);
  const [isArrPopoverOpen, setIsArrPopoverOpen] = useState(false);
  const [isEmployeesPopoverOpen, setIsEmployeesPopoverOpen] = useState(false);
  const [isCompanyNamePopoverOpen, setIsCompanyNamePopoverOpen] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address1: companyDetails.address_street,
      address2: "", // Assuming there's no address2 in the companyDetails
      postcode: companyDetails.address_zip,
      city: companyDetails.address_city,
    },
  });

  const handleUpdateOrgNumber = async () => {
    try {
      const updatedCompany = await updateCompany(companyDetails.uuid, {
        orgnr: editedOrgNumber,
      });
      if (updatedCompany) {
        setEditedOrgNumber(updatedCompany.orgnr);
        toast.success("Organization number updated successfully");
      } else {
        toast.error("Failed to update organization number");
      }
    } catch (error) {
      console.error("Error updating organization number:", error);
      toast.error("An error occurred while updating organization number");
    }
    setIsOrgNumberPopoverOpen(false);
  };

  const handleCancelOrgNumberEdit = () => {
    setEditedOrgNumber(companyDetails.orgnr);
    setIsOrgNumberPopoverOpen(false);
  };

  const handleUpdateAddress = async (data: AddressFormData) => {
    try {
      const updatedCompany = await updateCompany(companyDetails.uuid, {
        address_street: data.address1,
        address_zip: data.postcode,
        address_city: data.city,
      });

      if (updatedCompany) {
        // Update local state with the new address details
        setCompanyDetails((prevDetails) => ({
          ...prevDetails,
          address_street: updatedCompany.address_street,
          address_zip: updatedCompany.address_zip,
          address_city: updatedCompany.address_city,
        }));
        toast.success("Address updated successfully");
      } else {
        toast.error("Failed to update address");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("An error occurred while updating address");
    }

    setIsAddressPopoverOpen(false);
    reset();
  };

  const handleCancelAddressEdit = () => {
    reset();
    setIsAddressPopoverOpen(false);
  };

  const handleUpdateArr = async () => {
    try {
      const updatedCompany = await updateCompany(companyDetails.uuid, {
        arr: parseFloat(editedArr),
      });
      if (updatedCompany) {
        setEditedArr(updatedCompany.arr.toString());
        toast.success("ARR updated successfully");
      } else {
        toast.error("Failed to update ARR");
      }
    } catch (error) {
      console.error("Error updating ARR:", error);
      toast.error("An error occurred while updating ARR");
    }
    setIsArrPopoverOpen(false);
  };

  const handleCancelArrEdit = () => {
    setEditedArr(companyDetails.arr.toString());
    setIsArrPopoverOpen(false);
  };

  const handleUpdateEmployees = async () => {
    try {
      const updatedCompany = await updateCompany(companyDetails.uuid, {
        num_employees: parseInt(editedEmployees, 10),
      });
      if (updatedCompany) {
        setEditedEmployees(updatedCompany.num_employees.toString());
        toast.success("Number of employees updated successfully");
      } else {
        toast.error("Failed to update number of employees");
      }
    } catch (error) {
      console.error("Error updating number of employees:", error);
      toast.error("An error occurred while updating number of employees");
    }
    setIsEmployeesPopoverOpen(false);
  };

  const handleCancelEmployeesEdit = () => {
    setEditedEmployees(companyDetails.num_employees.toString());
    setIsEmployeesPopoverOpen(false);
  };

  const handleUpdateCompanyName = async () => {
    try {
      const updatedCompany = await updateCompany(companyDetails.uuid, {
        name: editedCompanyName,
      });
      if (updatedCompany) {
        setEditedCompanyName(updatedCompany.name);
        toast.success("Company name updated successfully");
      } else {
        toast.error("Failed to update company name");
      }
    } catch (error) {
      console.error("Error updating company name:", error);
      toast.error("An error occurred while updating company name");
    }
    setIsCompanyNamePopoverOpen(false);
  };

  const handleCancelCompanyNameEdit = () => {
    setEditedCompanyName(companyDetails.name);
    setIsCompanyNamePopoverOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "d. MMMM yyyy", { locale: nb });
  };

  const getTimeAgo = (dateString: string) => {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: nb });
  };

  const addedTimeAgo = getTimeAgo(companyDetails.date_created);

  const infoItems: InfoItem[] = [
    {
      icon: Building,
      label: "Org.nr",
      value: companyDetails.orgnr,
      editable: true,
    },
    {
      icon: MapPin,
      label: "Adresse",
      value: `${companyDetails.address_street}, ${companyDetails.address_zip} ${companyDetails.address_city}`,
      editable: true,
    },
    {
      icon: DollarSign,
      label: "ARR",
      value: `${companyDetails.arr} NOK`,
      editable: true,
    },
    {
      icon: Calendar,
      label: "Opprettet",
      value: formatDate(companyDetails.date_created),
    },
    {
      icon: Globe,
      label: "Nettside",
      value: companyDetails.url,
      isLink: true,
      isBadge: true,
      displayValue: extractDomain(companyDetails.url),
    },
    {
      icon: Users,
      label: "Ansatte",
      value: companyDetails.num_employees.toString(),
      editable: true,
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: companyDetails.some_linked,
      isLink: true,
      isBadge: true,
      displayValue: extractDomain(companyDetails.some_linked),
    },
    {
      icon: Clock,
      label: "Sist kontaktet",
      value: companyDetails.last_contacted,
      displayValue: getTimeAgo(companyDetails.last_contacted),
    },
    {
      icon: Twitter,
      label: "Twitter",
      value: companyDetails.some_twitter,
      isLink: true,
      isBadge: true,
      displayValue: extractDomain(companyDetails.some_twitter),
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src="/path-to-company-logo.png"
              alt={companyDetails.name}
            />
            <AvatarFallback>
              {companyDetails.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <Popover
              open={isCompanyNamePopoverOpen}
              onOpenChange={setIsCompanyNamePopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button variant="ghost" className="p-0 h-auto font-normal">
                  <h3 className="text-lg font-semibold">{editedCompanyName}</h3>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <Input
                    value={editedCompanyName}
                    onChange={(e) => setEditedCompanyName(e.target.value)}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelCompanyNameEdit}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Avbryt
                    </Button>
                    <Button size="sm" onClick={handleUpdateCompanyName}>
                      <Check className="h-4 w-4 mr-1" />
                      Bekreft
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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
                          {editedOrgNumber}
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
                            Avbryt
                          </Button>
                          <Button size="sm" onClick={handleUpdateOrgNumber}>
                            <Check className="h-4 w-4 mr-1" />
                            Bekreft
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
                          {`${companyDetails.address_street}, ${companyDetails.address_zip} ${companyDetails.address_city}`}
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
                ) : item.label === "ARR" ? (
                  <Popover
                    open={isArrPopoverOpen}
                    onOpenChange={setIsArrPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="p-0 h-auto font-normal"
                      >
                        <span className="text-sm text-muted-foreground">
                          {parseFloat(editedArr).toLocaleString("no-NO")} NOK
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Input
                            type="number"
                            value={editedArr}
                            onChange={(e) => setEditedArr(e.target.value)}
                            className="pr-12"
                          />
                          <span className="ml-[-40px] text-sm text-muted-foreground">
                            NOK
                          </span>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelArrEdit}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Avbryt
                          </Button>
                          <Button size="sm" onClick={handleUpdateArr}>
                            <Check className="h-4 w-4 mr-1" />
                            Bekreft
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                ) : item.label === "Ansatte" ? (
                  <Popover
                    open={isEmployeesPopoverOpen}
                    onOpenChange={setIsEmployeesPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="p-0 h-auto font-normal"
                      >
                        <span className="text-sm text-muted-foreground">
                          {parseInt(editedEmployees, 10).toLocaleString(
                            "no-NO"
                          )}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <Input
                          type="number"
                          value={editedEmployees}
                          onChange={(e) => setEditedEmployees(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEmployeesEdit}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Avbryt
                          </Button>
                          <Button size="sm" onClick={handleUpdateEmployees}>
                            <Check className="h-4 w-4 mr-1" />
                            Bekreft
                          </Button>
                        </div>
                      </div>
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
                  {item.displayValue || item.value}
                </span>
              )}
            </div>
          ))}
          <Separator className="my-4" />
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-muted-foreground">
                Account Owner ({companyDetails.account_owners.length})
              </h4>
              <AccountOwnerCombobox />
            </div>
            {companyDetails.account_owners.map((owner, index) => (
              <Link
                key={index}
                href={`/people/${owner.clerk_id}`}
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
                    {owner.first_name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {`${owner.first_name} ${owner.last_name}`}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-muted-foreground">
                Muligheter ({companyDetails.opportunities.length})
              </h4>
              <OpportunityCombobox />
            </div>
            {companyDetails.opportunities.map((opportunity, index) => (
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
                Personer ({companyDetails.people.length})
              </h4>
              <PersonCombobox />
            </div>
            {companyDetails.people.map((person, index) => (
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
