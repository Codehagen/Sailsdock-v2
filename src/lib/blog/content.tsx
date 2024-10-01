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

export const BLOG_CATEGORIES: {
  title: string;
  slug: "company" | "education";
  description: string;
}[] = [
  {
    title: "Company News",
    slug: "company",
    description: "Updates and announcements from Propwrite.",
  },
  // {
  //   title: "Education",
  //   slug: "education",
  //   description: "Educational content about link management.",
  // },
  // {
];

export const POPULAR_ARTICLES = [
  "what-is-dub",
  "how-can-i-download-my-dub-invoice",
  "how-can-i-download-my-dub-invoice",
  "how-can-i-download-my-dub-invoice",
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
    title: "Propwrite Overview",
    slug: "overview",
    description: "Learn about Propwrite and how it can help you.",
    icon: <Settings className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "Getting Started",
    slug: "getting-started",
    description: "Learn how to get started with Propwrite.",
    icon: <Settings className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "Link Management",
    slug: "link-management",
    description: "Learn how to manage your links on Propwrite.",
    icon: <Link2 className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "Custom Domains",
    slug: "custom-domains",
    description: "Learn how to use custom domains with Propwrite.",
    icon: <Globe className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "Migrating to Propwrite",
    slug: "migrating",
    description: "Easily migrate to Propwrite from other services.",
    icon: <Import className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "SAML SSO",
    slug: "saml-sso",
    description: "Secure your Propwrite project with SAML SSO.",
    icon: <Lock className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "API",
    slug: "api",
    description: "Learn how to use the Propwrite API.",
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
