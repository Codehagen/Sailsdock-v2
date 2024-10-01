import Header from "@/components/sections/header";
import Hero from "@/components/sections/hero";
import Logos from "@/components/sections/logos";
import Problem from "@/components/sections/problem";
import Solution from "@/components/sections/solution";
import HowItWorks from "@/components/sections/how-it-works";
import Testimonials from "@/components/sections/testimonials";
import Pricing from "@/components/sections/pricing";
import FAQ from "@/components/sections/faq";
import CTA from "@/components/sections/cta";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Logos />
      <Problem />
      <Solution />
      <HowItWorks />
      {/* <TestimonialsCarousel /> */}
      {/* <Features /> */}
      <Testimonials />
      {/* <Pricing /> */}
      {/* <FAQ /> */}
      {/* <Blog /> */}
      <CTA />
      <Footer />
    </main>
  );
}
