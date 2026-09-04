import Navbar from "../components/landing/Navbar.jsx";
import heroBg from "../assets/hero-bg-image.png";
import Hero from "../components/landing/Hero.jsx";

const Landing = () => {
  return (
    <main className="min-h-screen">
      <section
        className="relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <Navbar />
        <Hero />
      </section>
    </main>
  );
};

export default Landing;
