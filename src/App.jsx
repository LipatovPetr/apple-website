import Hero from "./components/Hero";
import Highligts from "./components/Highligts";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <main className="bg-black">
      <Navbar />
      <Hero />
      <Highligts />
    </main>
  );
};

export default App;
