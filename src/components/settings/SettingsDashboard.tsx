"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Briefcase,
  AtSign,
  Calendar,
  Settings,
  Users,
  Sun,
  ChevronRight,
  Key,
  Mail,
  Bell as BellIcon,
  Type,
  Phone,
  Copy,
  ArrowRight,
  ExternalLink,
  Zap,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User as UserType } from "@/types/user";
import { updateUserData } from "@/actions/user/update-user-data";

const navItems = [
  {
    category: "Bruker",
    items: [
      { id: "profile", label: "Profil", icon: User },
      { id: "experience", label: "Oppsett", icon: Briefcase },
      {
        id: "accounts",
        label: "Kontoer",
        icon: AtSign,
        subItems: [
          { id: "emails", label: "E-poster", icon: AtSign },
          { id: "calendars", label: "Kalendere", icon: Calendar },
        ],
      },
    ],
  },
  {
    category: "Arbeidsområde",
    items: [
      { id: "general", label: "Generelt", icon: Settings },
      { id: "members", label: "Medlemmer", icon: Users },
      { id: "integrations", label: "Integrasjoner", icon: Zap },
    ],
  },
];

export default function SettingsDashboard({ user }: { user: UserType }) {
  const [activeTab, setActiveTab] = useState("profile");
  const { theme, setTheme } = useTheme();
  const [inviteLink, setInviteLink] = useState(
    "https://sailsdock.no/invite/1a29c552-fd92-49d9-b6e4-a"
  );

  const [firstName, setFirstName] = useState(user.first_name || "");
  const [lastName, setLastName] = useState(user.last_name || "");
  const [phone, setPhone] = useState(user.phone || "");

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success("Invitasjonslenke kopiert til utklippstavlen");
  };

  const handleSaveChanges = async () => {
    const updatedUserData = await updateUserData({
      first_name: firstName,
      last_name: lastName,
      phone: phone,
    });

    if (updatedUserData) {
      toast.success("Profil oppdatert");
    } else {
      toast.error("Kunne ikke oppdatere profil");
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-screen flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto w-full max-w-6xl">
          <nav className="flex items-center text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-foreground">
              Innstillinger
            </a>
            <ChevronRight className="mx-2 h-4 w-4" />
            <span className="text-foreground">
              {
                navItems
                  .flatMap((category) => category.items)
                  .find((item) => item.id === activeTab)?.label
              }
            </span>
          </nav>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr]">
          <nav className="flex flex-col space-y-6">
            {navItems.map((category) => (
              <div key={category.category}>
                <h3 className="mb-2 px-4 text-lg font-semibold text-muted-foreground">
                  {category.category}
                </h3>
                <ul className="space-y-1">
                  {category.items.map((item) => (
                    <li key={item.id}>
                      <Button
                        variant={activeTab === item.id ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveTab(item.id)}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Button>
                      {item.subItems && (
                        <ul className="ml-6 mt-1 space-y-1">
                          {item.subItems.map((subItem) => (
                            <li key={subItem.id}>
                              <Button
                                variant={
                                  activeTab === subItem.id ? "default" : "ghost"
                                }
                                className="w-full justify-start"
                                onClick={() => setActiveTab(subItem.id)}
                              >
                                <subItem.icon className="mr-2 h-4 w-4" />
                                {subItem.label}
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="grid gap-6"
            >
              {activeTab === "profile" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Profilinformasjon</CardTitle>
                    <CardDescription>
                      Oppdater din personlige informasjon her. E-postadressen
                      kan ikke endres her.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">Fornavn</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="first-name"
                          className="pl-10"
                          placeholder="Skriv inn ditt fornavn"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Etternavn</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="last-name"
                          className="pl-10"
                          placeholder="Skriv inn ditt etternavn"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-post</Label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          className="pl-10"
                          placeholder="Din e-postadresse"
                          defaultValue={user.email || ""}
                          disabled
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        E-postadressen kan ikke endres her. Vennligst kontakt
                        support for å endre e-postadressen.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefonnummer</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          className="pl-10"
                          placeholder="Skriv inn ditt telefonnummer"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSaveChanges}>Lagre endringer</Button>
                  </CardFooter>
                </Card>
              )}
              {activeTab === "security" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Sikkerhetsinnstillinger</CardTitle>
                    <CardDescription>
                      Administrer kontosikkerhet og passord.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">
                        Nåværende passord
                      </Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="current-password"
                          type="password"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nytt passord</Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="new-password"
                          type="password"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">
                        Bekreft nytt passord
                      </Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type="password"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Oppdater passord</Button>
                  </CardFooter>
                </Card>
              )}
              {activeTab === "notifications" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Varslingsinnstillinger</CardTitle>
                    <CardDescription>
                      Administrer hvordan du mottar varsler.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="email-notifications">
                          E-postvarsler
                        </Label>
                      </div>
                      <Switch id="email-notifications" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BellIcon className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="push-notifications">Push-varsler</Label>
                      </div>
                      <Switch id="push-notifications" />
                    </div>
                  </CardContent>
                </Card>
              )}
              {activeTab === "appearance" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Utseendeinnstillinger</CardTitle>
                    <CardDescription>
                      Tilpass utseendet og følelsen av applikasjonen.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme-select">Tema</Label>
                      <div className="relative">
                        <Sun className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Select
                          onValueChange={(value) => setTheme(value)}
                          defaultValue={theme}
                        >
                          <SelectTrigger id="theme-select" className="pl-10">
                            <SelectValue placeholder="Velg tema" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="system">System</SelectItem>
                            <SelectItem value="light">Lys</SelectItem>
                            <SelectItem value="dark">Mørk</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="font-size">Skriftstørrelse</Label>
                      <div className="relative">
                        <Type className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Select>
                          <SelectTrigger id="font-size" className="pl-10">
                            <SelectValue placeholder="Velg skriftstørrelse" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Liten</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Stor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              {activeTab === "members" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Medlemmer</CardTitle>
                    <CardDescription>
                      Administrer medlemmene i arbeidsområdet ditt her
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Inviter via lenke
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Del denne lenken for å invitere brukere til å bli med i
                        arbeidsområdet ditt
                      </p>
                      <div className="flex items-center space-x-2">
                        <Input
                          value={inviteLink}
                          readOnly
                          className="flex-grow"
                        />
                        <Button
                          onClick={copyInviteLink}
                          className="flex items-center"
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Kopier lenke
                        </Button>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Nåværende medlemmer
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Navn</TableHead>
                            <TableHead>E-post</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                <span>Tim Apple</span>
                              </div>
                            </TableCell>
                            <TableCell>tim@apple.dev</TableCell>
                          </TableRow>
                          {/* Legg til flere rader etter behov */}
                        </TableBody>
                      </Table>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Inviter via e-post
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Send en invitasjon på e-post til teamet ditt
                      </p>
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Skriv inn e-postadresser"
                          className="flex-grow"
                        />
                        <Button>Inviter</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              {activeTab === "experience" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Oppsett</CardTitle>
                    <CardDescription>
                      Tilpass opplevelsen av applikasjonen.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme-select">Tema</Label>
                      <div className="relative">
                        <Sun className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Select
                          onValueChange={(value) => setTheme(value)}
                          defaultValue={theme}
                        >
                          <SelectTrigger id="theme-select" className="pl-10">
                            <SelectValue placeholder="Velg tema" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="system">System</SelectItem>
                            <SelectItem value="light">Lys</SelectItem>
                            <SelectItem value="dark">Mørk</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {/* You can add more setup options here if needed */}
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => toast.success("Innstillinger lagret")}
                    >
                      Lagre innstillinger
                    </Button>
                  </CardFooter>
                </Card>
              )}
              {activeTab === "accounts" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tilkoblede kontoer</CardTitle>
                    <CardDescription>
                      Administrer dine internettkontoer.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <h3 className="text-lg font-semibold mb-2">
                        Ingen tilkoblede kontoer
                      </h3>
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <Button
                          variant="outline"
                          className="w-full max-w-xs"
                          onClick={() => toast.success("Kobler til Google...")}
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Koble til Google
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full max-w-xs"
                          onClick={() =>
                            toast.success("Kobler til Exchange...")
                          }
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Koble til Exchange
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              {activeTab === "integrations" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Integrasjoner</CardTitle>
                    <CardDescription>
                      Administrer dine integrasjoner og automatiseringer.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Med Zapier</h3>
                        <Button variant="link" className="text-sm">
                          Se alle zaps <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {[
                          {
                            from: "Z0",
                            to: "Slack",
                            desc: "Publiser på Slack når et selskap oppdateres",
                          },
                          {
                            from: "Cal",
                            to: "Z0",
                            desc: "Opprett en person når Cal.com-hendelse opprettes",
                          },
                          {
                            from: "MailChimp",
                            to: "Z0",
                            desc: "Opprett en person når MailChimp-abonnement opprettes",
                          },
                          {
                            from: "Tally",
                            to: "Z0",
                            desc: "Opprett et selskap når et Tally-skjema sendes",
                          },
                        ].map((integration, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-muted rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold">
                                {integration.from[0]}
                              </div>
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold">
                                {integration.to[0]}
                              </div>
                              <span className="text-sm">
                                {integration.desc}
                              </span>
                            </div>
                            <Button variant="outline" size="sm">
                              <Zap className="mr-2 h-4 w-4" />
                              Use
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Med Windmill
                      </h3>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center text-white font-bold">
                            W
                          </div>
                          <span className="text-sm">
                            Opprett en arbeidsflyt med Windmill
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Gå til Windmill
                        </Button>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Be om en integrasjon
                      </h3>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white">
                            <svg
                              viewBox="0 0 24 24"
                              className="h-5 w-5 fill-current"
                            >
                              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                          </div>
                          <span className="text-sm">
                            Be om en integrasjon på GitHub-diskusjoner
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Gå til GitHub
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
