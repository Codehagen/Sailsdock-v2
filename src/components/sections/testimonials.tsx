"use client";

import Marquee from "@/components/magicui/marquee";
import Section from "@/components/section";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "bg-primary/20 p-1 py-0.5 font-bold text-primary dark:bg-primary/20 dark:text-primary",
        className
      )}
    >
      {children}
    </span>
  );
};

export interface TestimonialCardProps {
  name: string;
  role: string;
  img?: string;
  description: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const TestimonialCard = ({
  description,
  name,
  img,
  role,
  className,
  ...props
}: TestimonialCardProps) => (
  <div
    className={cn(
      "mb-4 flex w-full cursor-pointer break-inside-avoid flex-col items-center justify-between gap-6 rounded-xl p-4",
      "border border-neutral-200 bg-white",
      "dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      className
    )}
    {...props}
  >
    <div className="select-none text-sm font-normal text-neutral-700 dark:text-neutral-400">
      {description}
      <div className="flex flex-row py-1">
        <Star className="size-4 text-yellow-500 fill-yellow-500" />
        <Star className="size-4 text-yellow-500 fill-yellow-500" />
        <Star className="size-4 text-yellow-500 fill-yellow-500" />
        <Star className="size-4 text-yellow-500 fill-yellow-500" />
        <Star className="size-4 text-yellow-500 fill-yellow-500" />
      </div>
    </div>

    <div className="flex w-full select-none items-center justify-start gap-5">
      <Image
        width={40}
        height={40}
        src={img || ""}
        alt={name}
        className="h-10 w-10 rounded-full ring-1 ring-border ring-offset-4"
      />

      <div>
        <p className="font-medium text-neutral-500">{name}</p>
        <p className="text-xs font-normal text-neutral-400">{role}</p>
      </div>
    </div>
  </div>
);

const testimonials = [
  {
    name: "Alexander Olsen",
    role: "CTO hos InnovaTech AS",
    img: "https://randomuser.me/api/portraits/men/91.jpg",
    description: (
      <p>
        De AI-drevne analysene fra #Sailsdock har revolusjonert vår
        produktutviklingssyklus.
        <Highlight>
          Innsiktene er nå mer nøyaktige og raskere enn noensinne.
        </Highlight>{" "}
        En game-changer for teknologiselskaper.
      </p>
    ),
  },
  {
    name: "Sofie Larsen",
    role: "Markedsdirektør hos NextGen Løsninger",
    img: "https://randomuser.me/api/portraits/women/12.jpg",
    description: (
      <p>
        Implementeringen av Sailsdocks kundeprediksjon har drastisk forbedret
        vår målrettingsstrategi.
        <Highlight>Vi ser en 50% økning i konverteringsrater!</Highlight>{" "}
        Anbefaler sterkt deres løsninger.
      </p>
    ),
  },
  {
    name: "Ravi Patel",
    role: "Grunnlegger & CEO hos StartUp Grid",
    img: "https://randomuser.me/api/portraits/men/45.jpg",
    description: (
      <p>
        Som en startup trenger vi å bevege oss raskt og ligge foran. Sailsdocks
        automatiserte kundeoppfølging hjelper oss med nettopp det.
        <Highlight>Vår utviklingshastighet har doblet seg.</Highlight> Et
        essensielt verktøy for enhver startup.
      </p>
    ),
  },
  {
    name: "Emma Chen",
    role: "Produktsjef hos Digital Bølge",
    img: "https://randomuser.me/api/portraits/women/83.jpg",
    description: (
      <p>
        Sailsdocks AI-drevne kundeanalyse har gjort det å skape globale
        produkter til en lek.
        <Highlight>Lokalisering er nå sømløs og effektiv.</Highlight> Et must
        for globale produktteam.
      </p>
    ),
  },
  {
    name: "Mikkel Brun",
    role: "Data Scientist hos FinTech Innovasjoner",
    img: "https://randomuser.me/api/portraits/men/1.jpg",
    description: (
      <p>
        Å utnytte Sailsdocks AI for våre finansielle modeller har gitt oss et
        forsprang i prediktiv nøyaktighet.
        <Highlight>
          Våre investeringsstrategier er nå drevet av sanntids dataanalyse.
        </Highlight>{" "}
        Transformativt for finansbransjen.
      </p>
    ),
  },
  {
    name: "Linda Wu",
    role: "Operasjonsdirektør hos LogiChain Løsninger",
    img: "https://randomuser.me/api/portraits/women/5.jpg",
    description: (
      <p>
        Sailsdocks verktøy for optimalisering av forsyningskjeden har drastisk
        redusert våre driftskostnader.
        <Highlight>
          Effektivitet og nøyaktighet i logistikk har aldri vært bedre.
        </Highlight>{" "}
      </p>
    ),
  },
  {
    name: "Karl Gundersen",
    role: "FoU-leder hos EcoInnovate",
    img: "https://randomuser.me/api/portraits/men/14.jpg",
    description: (
      <p>
        Ved å integrere Sailsdocks bærekraftige energiløsninger har vi sett en
        betydelig reduksjon i karbonavtrykk.
        <Highlight>
          Vi leder an i miljøvennlig forretningspraksis.
        </Highlight>{" "}
        Banebrytende endring i bransjen.
      </p>
    ),
  },
  {
    name: "Aisha Khan",
    role: "Markedssjef hos Fashion Forward",
    img: "https://randomuser.me/api/portraits/women/56.jpg",
    description: (
      <p>
        Sailsdocks markedsanalyse-AI har transformert hvordan vi tilnærmer oss
        motetrender.
        <Highlight>
          Våre kampanjer er nå datadrevne med høyere kundeengasjement.
        </Highlight>{" "}
        Revolusjonerer motemarketing.
      </p>
    ),
  },
  {
    name: "Thomas Chen",
    role: "IT-direktør hos HealthTech Solutions",
    img: "https://randomuser.me/api/portraits/men/18.jpg",
    description: (
      <p>
        Implementering av Sailsdock i våre pasientbehandlingssystemer har
        forbedret pasientutfall betydelig.
        <Highlight>
          Teknologi og helsevesen jobber hånd i hånd for bedre helse.
        </Highlight>{" "}
        En milepæl innen medisinsk teknologi.
      </p>
    ),
  },
  {
    name: "Sofia Pettersen",
    role: "CEO hos EduTech Innovasjoner",
    img: "https://randomuser.me/api/portraits/women/73.jpg",
    description: (
      <p>
        Sailsdocks AI-drevne personlige læringsplaner har doblet studentenes
        ytelsesmetrikk.
        <Highlight>
          Utdanning skreddersydd for hver enkelt elevs behov.
        </Highlight>{" "}
        Transformerer utdanningslandskapet.
      </p>
    ),
  },
  {
    name: "Jakob Mortensen",
    role: "CTO hos SecureNet Tech",
    img: "https://randomuser.me/api/portraits/men/25.jpg",
    description: (
      <p>
        Med Sailsdocks AI-drevne sikkerhetssystemer er våre
        databeskyttelsesnivåer uovertrufne.
        <Highlight>Sikrer trygghet og tillit i digitale rom.</Highlight>{" "}
        Redefinerer standarder for cybersikkerhet.
      </p>
    ),
  },
  {
    name: "Nadia Ali",
    role: "Produktsjef hos Creative Solutions",
    img: "https://randomuser.me/api/portraits/women/78.jpg",
    description: (
      <p>
        Sailsdocks AI har strømlinjeformet vår kreative prosess, forbedret
        produktivitet og innovasjon.
        <Highlight>Bringer kreativitet og teknologi sammen.</Highlight> En
        game-changer for kreative bransjer.
      </p>
    ),
  },
  {
    name: "Omar Farooq",
    role: "Grunnlegger av Startup Hub",
    img: "https://randomuser.me/api/portraits/men/54.jpg",
    description: (
      <p>
        Sailsdocks innsikt i startup-økosystemer har vært uvurderlig for våre
        vekst- og finansieringsstrategier.
        <Highlight>Styrker startups med datadrevne beslutninger.</Highlight> En
        katalysator for startup-suksess.
      </p>
    ),
  },
];

export default function Testimonials() {
  return (
    <Section
      title="Kundeomtaler"
      subtitle="Hva våre kunder sier"
      className="max-w-8xl"
    >
      <div className="relative mt-6 max-h-screen overflow-hidden">
        <div className="gap-4 md:columns-2 xl:columns-3 2xl:columns-4">
          {Array(Math.ceil(testimonials.length / 3))
            .fill(0)
            .map((_, i) => (
              <Marquee
                vertical
                key={i}
                className={cn({
                  "[--duration:60s]": i === 1,
                  "[--duration:30s]": i === 2,
                  "[--duration:70s]": i === 3,
                })}
              >
                {testimonials.slice(i * 3, (i + 1) * 3).map((card, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: Math.random() * 0.8,
                      duration: 1.2,
                    }}
                  >
                    <TestimonialCard {...card} />
                  </motion.div>
                ))}
              </Marquee>
            ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 w-full bg-gradient-to-t from-background from-20%"></div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 w-full bg-gradient-to-b from-background from-20%"></div>
      </div>
    </Section>
  );
}
