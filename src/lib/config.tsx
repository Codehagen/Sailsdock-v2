import { Icons } from "@/components/icons";
import { FaTwitter } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";

export const BLUR_FADE_DELAY = 0.15;

export const siteConfig = {
  name: "Sailsdock",
  description: "Moderne CRM og kundeoppfølgingsplattform",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  keywords: [
    "CRM",
    "Kundeoppfølging",
    "Lead-generering",
    "Bedriftsdatabase",
    "Kundestøtte",
  ],
  links: {
    email: "support@sailsdock.no",
    twitter: "https://twitter.com/sailsdock",
    discord: "https://discord.gg/sailsdock",
    github: "https://github.com/sailsdock",
    instagram: "https://instagram.com/sailsdock/",
  },
  header: [
    {
      trigger: "Features",
      content: {
        main: {
          icon: <Icons.logo className="h-6 w-6" />,
          title: "Omfattende CRM-løsninger",
          description:
            "Finn, følg opp og analyser kunder med vår innovative plattform.",
          href: "#",
        },
        items: [
          {
            href: "#",
            title: "Rask Oppstart",
            description:
              "Kom i gang med kundeoppfølging på minutter med våre intuitive maler.",
          },
          {
            href: "#",
            title: "Kundehåndtering",
            description: "Organiser og oppdater kundeinformasjon enkelt.",
          },
          {
            href: "#",
            title: "Avansert Søk",
            description:
              "Kraftige søkemuligheter for brukervennlig navigasjon i kundedata.",
          },
        ],
      },
    },
    {
      trigger: "Løsninger",
      content: {
        items: [
          {
            title: "For Startups",
            href: "#",
            description: "Etabler profesjonell kundeoppfølging fra dag én.",
          },
          {
            title: "For Voksende Bedrifter",
            href: "#",
            description:
              "Skaler din kundeoppfølging etter hvert som bedriften vokser.",
          },
          {
            title: "For Større Selskaper",
            href: "#",
            description: "Håndter komplekse kundeforhold med letthet.",
          },
          {
            title: "For Utviklere",
            href: "#",
            description: "Integrer Sailsdocks plattform i din teknologistack.",
          },
        ],
      },
    },
    {
      href: "/blog",
      label: "Blogg",
    },
    {
      href: "/help",
      label: "Hjelp",
    },
  ],
  pricing: [
    {
      name: "BASIC",
      href: "#",
      price: "199 kr",
      period: "måned",
      yearlyPrice: "169 kr",
      features: [
        "1 CRM-bruker",
        "5GB Lagring",
        "Grunnleggende Støtte",
        "Begrenset Tilpasning",
        "Standard Analyser",
      ],
      description: "Perfekt for små team og startups",
      buttonText: "Kom i gang",
      isPopular: false,
    },
    {
      name: "PRO",
      href: "#",
      price: "499 kr",
      period: "måned",
      yearlyPrice: "399 kr",
      features: [
        "3 CRM-brukere",
        "50GB Lagring",
        "Prioritert Støtte",
        "Avansert Tilpasning",
        "Avanserte Analyser",
      ],
      description: "Ideell for voksende bedrifter og team",
      buttonText: "Kom i gang",
      isPopular: true,
    },
    {
      name: "ENTERPRISE",
      href: "#",
      price: "Tilpasset",
      period: "måned",
      yearlyPrice: "Tilpasset",
      features: [
        "Ubegrenset antall brukere",
        "Ubegrenset Lagring",
        "24/7 Premium Støtte",
        "Full Tilpasning",
        "AI-drevne Innsikter",
      ],
      description: "For storskala operasjoner og høyvolum kundeoppfølging",
      buttonText: "Kontakt Salg",
      isPopular: false,
    },
  ],
  faqs: [
    {
      question: "Hva er Sailsdock?",
      answer: (
        <span>
          Sailsdock er en moderne plattform for kundeoppfølging og CRM. Den
          tilbyr intuitive verktøy og tjenester for å effektivisere din
          kundehåndtering og lead-generering.
        </span>
      ),
    },
    {
      question: "Hvordan kommer jeg i gang med Sailsdock?",
      answer: (
        <span>
          Du kan komme i gang med Sailsdock ved å registrere en konto på vår
          nettside, velge en mal, og følge vår hurtigstartsguide. Vi tilbyr
          veiledninger og dokumentasjon for å hjelpe deg underveis.
        </span>
      ),
    },
    {
      question: "Kan jeg tilpasse utseendet på min CRM?",
      answer: (
        <span>
          Ja, Sailsdock tilbyr omfattende tilpasningsmuligheter. Du kan justere
          farger, fonter og oppsett for å matche din merkevareidentitet. Våre
          Pro- og Enterprise-planer tilbyr enda mer avanserte
          tilpasningsmuligheter.
        </span>
      ),
    },
    {
      question: "Er Sailsdock egnet for ikke-tekniske brukere?",
      answer: (
        <span>
          Absolutt! Sailsdock er designet for å være brukervennlig for både
          tekniske og ikke-tekniske brukere. Vårt intuitive grensesnitt og
          forhåndsbyggede maler gjør det enkelt for alle å opprette og
          administrere en profesjonell CRM-løsning.
        </span>
      ),
    },
    {
      question: "Hvilken type support tilbyr Sailsdock?",
      answer: (
        <span>
          Sailsdock tilbyr omfattende support inkludert dokumentasjon,
          videoveiledninger, et community-forum og dedikert kundestøtte. Vi
          tilbyr også premium supportplaner for bedrifter med mer komplekse
          behov.
        </span>
      ),
    },
  ],
  footer: [
    {
      title: "Produkt",
      links: [
        { href: "#", text: "Funksjoner", icon: null },
        { href: "#", text: "Priser", icon: null },
        { href: "#", text: "Dokumentasjon", icon: null },
        { href: "#", text: "API", icon: null },
      ],
    },
    {
      title: "Selskap",
      links: [
        { href: "#", text: "Om Oss", icon: null },
        { href: "#", text: "Karriere", icon: null },
        { href: "#", text: "Blogg", icon: null },
        { href: "#", text: "Presse", icon: null },
        { href: "#", text: "Partnere", icon: null },
      ],
    },
    {
      title: "Ressurser",
      links: [
        { href: "#", text: "Community", icon: null },
        { href: "#", text: "Kontakt", icon: null },
        { href: "#", text: "Support", icon: null },
        { href: "#", text: "Status", icon: null },
      ],
    },
    {
      title: "Sosiale Medier",
      links: [
        {
          href: "#",
          text: "Twitter",
          icon: <FaTwitter />,
        },
        {
          href: "#",
          text: "Instagram",
          icon: <RiInstagramFill />,
        },
        {
          href: "#",
          text: "Youtube",
          icon: <FaYoutube />,
        },
      ],
    },
  ],
};

export type SiteConfig = typeof siteConfig;
