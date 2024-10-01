import Features from "@/components/features-vertical";
import Section from "@/components/section";
import { Upload, Zap, Sparkles } from "lucide-react";

const data = [
  {
    id: 1,
    title: "1. Choose Your Template",
    content:
      "Select from our library of pre-designed help center and blog templates that suit your needs.",
    image: "/dashboard.png",
    icon: <Upload className="w-6 h-6 text-primary" />,
  },
  {
    id: 2,
    title: "2. Customize and Populate",
    content:
      "Easily customize the design and add your content using our intuitive editor.",
    image: "/dashboard.png",
    icon: <Zap className="w-6 h-6 text-primary" />,
  },
  {
    id: 3,
    title: "3. Launch and Manage",
    content:
      "Publish your help center and blog instantly, then effortlessly manage and update content as needed.",
    image: "/dashboard.png",
    icon: <Sparkles className="w-6 h-6 text-primary" />,
  },
];

export default function Component() {
  return (
    <Section
      title="How Propwrite Works"
      subtitle="Create your help center and blog in 3 simple steps"
    >
      <Features data={data} />
    </Section>
  );
}
