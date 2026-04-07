import React from "react";
import Cards from "../common/Cards";

function SectionTwo() {
  return (
    <section className="py-20 bg-gradient-to-b from-white via-[#f7fbfc] to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.35em] uppercase text-[#007595] mb-3">
            New Arrivals
          </p>

          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900">
  Fresh Finds You’ll Love
          </h2>

          <div className="w-24 h-[2px] bg-[#007595] mx-auto mt-6"></div>

          <p className="text-gray-500 mt-6 max-w-xl mx-auto">
            From trending styles to everyday essentials, shop the latest drops and
            best-sellers across all categories — all in one place.
          </p>
        </div>

        <Cards />
      </div>
    </section>
  );
}

export default SectionTwo;
