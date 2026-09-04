import UrlGenerator from "./UrlGenerator.jsx";

const Hero = () => {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-16 text-center text-white md:pt-24">
      
      <h1 className="text-4xl font-semibold tracking-tighter md:text-6xl lg:text-7xl">
        <span className="text-white/65">Shorten Links.</span>
        <br />
        Share Everywhere.
      </h1>

      <p className="mt-6 text-base text-white/70 md:text-lg">
        Create short links in a click. No sign up required.
      </p>

      <UrlGenerator />

    </section>
  );
};

export default Hero;