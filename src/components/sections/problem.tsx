import BlurFade from "@/components/magicui/blur-fade";
import Section from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, FileText, Search } from "lucide-react";

const problems = [
  {
    title: "Time-Consuming Setup",
    description:
      "Businesses waste weeks setting up help centers and blogs from scratch, delaying crucial support and content delivery.",
    icon: Clock,
  },
  {
    title: "Content Management Challenges",
    description:
      "Managing and updating help center content and blog posts across multiple platforms is complex and time-consuming.",
    icon: FileText,
  },
  {
    title: "Poor User Experience",
    description:
      "Inadequate search capabilities and disorganized content make it difficult for users to find the information they need quickly.",
    icon: Search,
  },
];

export default function Component() {
  return (
    <Section
      title="Challenges in Help Center and Blog Management"
      subtitle="Why traditional methods fall short"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {problems.map((problem, index) => (
          <BlurFade key={index} delay={0.2 + index * 0.2} inView>
            <Card className="bg-background border-none shadow-none">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <problem.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{problem.title}</h3>
                <p className="text-muted-foreground">{problem.description}</p>
              </CardContent>
            </Card>
          </BlurFade>
        ))}
      </div>
    </Section>
  );
}
