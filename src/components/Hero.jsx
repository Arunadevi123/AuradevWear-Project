import React from "react";
import { useNavigate } from "react-router-dom";
import Hero1 from "../assets/hero1.png";

const Hero = () => {
  const navigate = useNavigate();

  const goToProducts = () => {
    navigate("/products");
  };

  return (
    <section className="relative w-full h-[80vh] max-h-[700px] overflow-hidden rounded-lg shadow-lg">
      {/* Background Image */}
      <img
        src={Hero1}
        alt="Hero background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

      {/* Offer Box */}
      <div className="relative z-10 flex items-center md:items-start justify-center md:justify-end w-full h-full px-4 md:px-12 py-6">
        <div className="text-gray-900 p-6 md:p-10 shadow-2xl max-w-md w-full sm:w-3/4 md:w-auto animate-fadeIn text-center md:text-right">
          <h1 className="text-3xl sm:text-2xl md:text-5xl font-extrabold mb-4 leading-tight text-white">
            Mega <span className="text-secondary">Sale</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 font-medium text-black">
            Grab the hottest deals of the season and upgrade your style today!
          </p>
          <ul className="space-y-3 text-sm sm:text-base md:text-lg font-semibold">
            <li className="flex items-center justify-center md:justify-start gap-2">
              <span>Flat 50% Off on New Arrivals</span>
            </li>
          </ul>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={goToProducts}
              className="bg-primary text-secondary px-6 py-3 rounded-lg font-semibold hover:bg-accent hover:text-primary transition shadow-md"
            >
              Shop Now
            </button>
            <button
              onClick={goToProducts}
              className="bg-transparent border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-secondary transition"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
