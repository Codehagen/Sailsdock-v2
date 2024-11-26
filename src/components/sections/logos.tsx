import Marquee from "@/components/magicui/marquee";
import Image from "next/image";

const companies = [
  {
    name: "Cornpornor",
    imageId: "f779a8b3-acb3-48cd-3c76-b9bc17fe9200/public",
  },
  // {
  //   name: "Kjeldsberg",
  //   imageId: "3775a191-6a88-4261-5c8f-db36edc00300/public",
  // },
  {
    name: "Propdock",
    imageId: "098eebfe-c85e-4563-8212-d6c7ac5c5900/public",
  },
  {
    name: "Proaktiv",
    imageId: "d38b0b93-970b-4d79-d060-53b791e72d00/public",
  },
  {
    name: "Real",
    imageId: "45ec51b6-f194-461a-ad5b-6c9b22e26d00/public",
  },
];

export default function Logos() {
  return (
    <section id="logos">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <h3 className="text-center text-sm font-semibold text-gray-500">
          Gir superkrefter til alle bedrifter, fra ivrige startups til etablerte
          selskaper.
        </h3>
        <div className="relative mt-6">
          <Marquee className="max-w-full [--duration:40s]">
            {companies.map((company, idx) => (
              <Image
                key={idx}
                width={112}
                height={40}
                src={`https://imagedelivery.net/r-6-yk-gGPtjfbIST9-8uA/${company.imageId}`}
                className="h-10 w-28 dark:brightness-0 dark:invert grayscale opacity-30"
                alt={company.name}
                unoptimized
              />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 h-full w-1/3 bg-gradient-to-r from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 h-full w-1/3 bg-gradient-to-l from-background"></div>
        </div>
      </div>
    </section>
  );
}
