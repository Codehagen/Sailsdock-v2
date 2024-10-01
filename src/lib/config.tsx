import { Icons } from "@/components/icons";
import { FaTwitter } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";

export const BLUR_FADE_DELAY = 0.15;

export const siteConfig = {
  name: "Sailsdock",
  description: "Modern help center and blog platform",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  keywords: [
    "Help Center",
    "Knowledge Base",
    "Blog Platform",
    "Documentation",
    "Customer Support",
  ],
  links: {
    email: "support@Sailsdock.com",
    twitter: "https://twitter.com/Sailsdock",
    discord: "https://discord.gg/Sailsdock",
    github: "https://github.com/Sailsdock",
    instagram: "https://instagram.com/Sailsdock/",
  },
  header: [
    {
      trigger: "Features",
      content: {
        main: {
          icon: <Icons.logo className="h-6 w-6" />,
          title: "Comprehensive Help Center Solutions",
          description:
            "Create, manage, and optimize your help center and blog with ease.",
          href: "#",
        },
        items: [
          {
            href: "#",
            title: "Quick Setup",
            description:
              "Launch your help center in minutes with intuitive templates.",
          },
          {
            href: "#",
            title: "Content Management",
            description: "Easily organize and update your knowledge base.",
          },
          {
            href: "#",
            title: "Advanced Search",
            description:
              "Powerful search capabilities for user-friendly navigation.",
          },
        ],
      },
    },
    {
      trigger: "Solutions",
      content: {
        items: [
          {
            title: "For Startups",
            href: "#",
            description: "Establish a professional help center from day one.",
          },
          {
            title: "For Growing Businesses",
            href: "#",
            description: "Scale your support as your business expands.",
          },
          {
            title: "For Enterprises",
            href: "#",
            description: "Manage complex knowledge bases with ease.",
          },
          {
            title: "For Developers",
            href: "#",
            description: "Integrate Sailsdock's platform into your tech stack.",
          },
        ],
      },
    },
    {
      href: "/blog",
      label: "Blog",
    },
    {
      href: "/help",
      label: "Help",
    },
  ],
  pricing: [
    {
      name: "BASIC",
      href: "#",
      price: "$19",
      period: "month",
      yearlyPrice: "$16",
      features: [
        "1 Help Center",
        "5GB Storage",
        "Basic Support",
        "Limited Customization",
        "Standard Analytics",
      ],
      description: "Perfect for small teams and startups",
      buttonText: "Get Started",
      isPopular: false,
    },
    {
      name: "PRO",
      href: "#",
      price: "$49",
      period: "month",
      yearlyPrice: "$40",
      features: [
        "3 Help Centers",
        "50GB Storage",
        "Priority Support",
        "Advanced Customization",
        "Advanced Analytics",
      ],
      description: "Ideal for growing businesses and teams",
      buttonText: "Get Started",
      isPopular: true,
    },
    {
      name: "ENTERPRISE",
      href: "#",
      price: "Custom",
      period: "month",
      yearlyPrice: "Custom",
      features: [
        "Unlimited Help Centers",
        "Unlimited Storage",
        "24/7 Premium Support",
        "Full Customization",
        "AI-Powered Insights",
      ],
      description: "For large-scale operations and high-volume support",
      buttonText: "Contact Sales",
      isPopular: false,
    },
  ],
  faqs: [
    {
      question: "What is Sailsdock?",
      answer: (
        <span>
          Sailsdock is a modern platform for creating and managing help centers
          and blogs. It provides intuitive tools and services to streamline your
          knowledge base and content management.
        </span>
      ),
    },
    {
      question: "How can I get started with Sailsdock?",
      answer: (
        <span>
          You can get started with Sailsdock by signing up for an account on our
          website, choosing a template, and following our quick-start guide. We
          offer tutorials and documentation to help you along the way.
        </span>
      ),
    },
    {
      question: "Can I customize the look of my help center?",
      answer: (
        <span>
          Yes, Sailsdock offers extensive customization options. You can adjust
          colors, fonts, and layouts to match your brand identity. Our Pro and
          Enterprise plans offer even more advanced customization features.
        </span>
      ),
    },
    {
      question: "Is Sailsdock suitable for non-technical users?",
      answer: (
        <span>
          Absolutely! Sailsdock is designed to be user-friendly for both
          technical and non-technical users. Our intuitive interface and
          pre-built templates make it easy for anyone to create and manage a
          professional help center or blog.
        </span>
      ),
    },
    {
      question: "What kind of support does Sailsdock provide?",
      answer: (
        <span>
          Sailsdock provides comprehensive support including documentation,
          video tutorials, a community forum, and dedicated customer support. We
          also offer premium support plans for enterprises with more complex
          needs.
        </span>
      ),
    },
  ],
  footer: [
    {
      title: "Product",
      links: [
        { href: "#", text: "Features", icon: null },
        { href: "#", text: "Pricing", icon: null },
        { href: "#", text: "Documentation", icon: null },
        { href: "#", text: "API", icon: null },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "#", text: "About Us", icon: null },
        { href: "#", text: "Careers", icon: null },
        { href: "#", text: "Blog", icon: null },
        { href: "#", text: "Press", icon: null },
        { href: "#", text: "Partners", icon: null },
      ],
    },
    {
      title: "Resources",
      links: [
        { href: "#", text: "Community", icon: null },
        { href: "#", text: "Contact", icon: null },
        { href: "#", text: "Support", icon: null },
        { href: "#", text: "Status", icon: null },
      ],
    },
    {
      title: "Social",
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
