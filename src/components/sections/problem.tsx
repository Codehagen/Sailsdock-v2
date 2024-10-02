import BlurFade from "@/components/magicui/blur-fade";
import Section from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, FileText, Search } from "lucide-react";

const problems = [
  {
    title: "Tidkrevende datainnsamling",
    description:
      "Bedrifter kaster bort uker på å samle inn og organisere kundedata manuelt, noe som forsinker viktig oppfølging og vekst.",
    icon: Clock,
  },
  {
    title: "Utfordringer med kundeoppfølging",
    description:
      "Å holde oversikt over og oppdatere kundeinformasjon på tvers av flere plattformer er komplekst og tidkrevende.",
    icon: FileText,
  },
  {
    title: "Ineffektiv kundeanalyse",
    description:
      "Mangel på avanserte analyseverktøy gjør det vanskelig for bedrifter å få meningsfulle innsikter og ta datadrevne beslutninger.",
    icon: Search,
  },
];

export default function Component() {
  return (
    <Section
      title="Utfordringer i tradisjonell CRM"
      subtitle="Hvorfor vanlige metoder kommer til kort"
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
