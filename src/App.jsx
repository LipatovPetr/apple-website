import Features from "./components/Features";
import Hero from "./components/Hero";
import Highligts from "./components/Highligts";
import HowItWorks from "./components/HowItWorks";
import Model from "./components/Model";
import Navbar from "./components/Navbar";
import VideoCarousel from "./components/VideoCarousel";

import * as Sentry from "@sentry/react";

const App = () => {
  return (
    <main className="bg-black">
      <Navbar />
      <Hero />
      <Highligts />
      <VideoCarousel />
      <Model />
      <Features />
      <HowItWorks />
    </main>
  );
};

export default Sentry.withProfiler(App);
