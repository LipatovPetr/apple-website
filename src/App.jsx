import Hero from "./components/Hero";
import Highligts from "./components/Highligts";
import Navbar from "./components/Navbar";
import VideoCarousel from "./components/VideoCarousel";

const App = () => {
  return (
    <main className="bg-black">
      <Navbar />
      <Hero />
      <Highligts />
      <VideoCarousel />
    </main>
  );
};

export default App;
