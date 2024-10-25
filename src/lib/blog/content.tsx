// import { Logo } from "#/ui/icons";
import { allHelpPosts } from "content-collections";
import {
  Airplay,
  BarChart,
  Building,
  Cable,
  Globe,
  Import,
  Link2,
  Lock,
  PartyPopper,
  QrCode,
  Settings,
  TrendingUp,
  Users,
  Webhook,
} from "lucide-react";

import type { JSX } from "react";

export const BLOG_CATEGORIES: {
  title: string;
  slug: "company" | "education";
  description: string;
}[] = [
  {
    title: "Selskapsnyheter",
    slug: "company",
    description: "Oppdateringer og kunngjøringer fra Sailsdock.",
  },
  // {
  //   title: "Education",
  //   slug: "education",
  //   description: "Educational content about link management.",
  // },
  // {
];

export const POPULAR_ARTICLES = [
  "hva-er-sailsdock",
  "hvordan-bruker-bedrifter-i-sailsdock",
  "hvordan-bruke-personer-i-sailsdock",
  "hvordan-bruke-muligheter-i-sailsdock",
  "hva-er-favoritter",
  "hvordan-bruke-visninger-og-filtre",
];

export const HELP_CATEGORIES: {
  title: string;
  slug:
    | "overview"
    | "getting-started"
    | "link-management"
    | "custom-domains"
    | "migrating"
    | "api"
    | "saml-sso";
  description: string;
  icon: JSX.Element;
}[] = [
  {
    title: "Oversikt over Sailsdock",
    slug: "overview",
    description: "Lær om Sailsdock og hvordan det kan hjelpe deg.",
    icon: <Settings className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "Kom i gang",
    slug: "getting-started",
    description: "Lær hvordan du kommer i gang med Sailsdock.",
    icon: <Settings className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "Personer",
    slug: "link-management",
    description: "Lær hvordan du administrerer lenkene dine på Sailsdock.",
    icon: <Link2 className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "Bedrifter",
    slug: "custom-domains",
    description: "Lær hvordan du bruker egendefinerte domener med Sailsdock.",
    icon: <Globe className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "Migrering til Sailsdock",
    slug: "migrating",
    description: "Enkelt migrere til Sailsdock fra andre tjenester.",
    icon: <Import className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "API",
    slug: "api",
    description: "Lær hvordan du bruker Sailsdock API.",
    icon: <Webhook className="h-6 w-6 text-gray-500" />,
  },
];

export const getPopularArticles = () => {
  const popularArticles = POPULAR_ARTICLES.map((slug) => {
    const post = allHelpPosts.find((post) => post.slug === slug);
    if (!post) {
      console.warn(`Popular article with slug "${slug}" not found`);
    }
    return post;
  }).filter((post) => post != null);

  return popularArticles;
};
