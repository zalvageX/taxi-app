import AboutUs from "@/component/AboutUs";
import ChooseUs from "@/component/ChooseUs";
import ContactUs from "@/component/ContactUs";
import Counter from "@/component/Counter";
import Hero from "@/component/Hero";
import OurServices from "@/component/OurServices";
import Schedule from "@/component/Schedule";
import Testimonials from "@/component/Testimonials";


export default function Home() {
  return (
    
    <>
      <Hero />
      <Counter />
      <AboutUs />
      <OurServices />
      <ChooseUs />
      <Schedule />
      <Testimonials />
      <ContactUs />
    </>
  );
}
