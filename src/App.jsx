import Hero from "./components/Hero";
import Highligts from "./components/Highligts";
import Model from "./components/Model";
import Navbar from "./components/Navbar";
import VideoCarousel from "./components/VideoCarousel";

import * as Sentry from "@sentry/react";

const App = () => {
  return <button onClick={() => methodDoesNotExist()}>Break the world</button>;
  return (
    <main className="bg-black">
      <Navbar />
      <Hero />
      <Highligts />
      <VideoCarousel />
      <Model />
    </main>
  );
};

export default Sentry.withProfiler(App);
