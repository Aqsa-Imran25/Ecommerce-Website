import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiUrl } from "../common/Http";
import striptags from "striptags";

function SectionThree() {
  const [newfeatures, setFeatures] = useState([]);

  const featuredProduct = async () => {
    try {
      const res = await fetch(`${apiUrl}/featuredProduct`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const result = await res.json();
      if (result.status === 200) {
        setFeatures(result.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    featuredProduct();
  }, []);

  return (
    <section className="bg-gradient-to-b from-white to-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-[#007595] tracking-wide">
            Featured Jewelry
          </h2>

          <div className="w-20 h-[3px] bg-[#007595] mx-auto mt-4 rounded-full"></div>

          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Discover our curated collection of handcrafted jewelry designed
            with elegance, craftsmanship, and timeless beauty.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">

          {newfeatures.map((product) => (
            <div
              key={product.id}

              className="group relative bg-white/70 backdrop-blur-lg border border-gray-200 
              rounded-2xl shadow-md overflow-hidden transition-all duration-500 
              hover:shadow-2xl hover:-translate-y-2"
            >

              <div className="relative overflow-hidden">

                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image_url}
                    alt={product.title}

                    className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </Link>

               
              </div>

              <div className="p-6">

           
                <h3 className="text-lg font-semibold text-[#007595] mb-2 group-hover:underline">
                  {product.title}
                </h3>

             
                <p className="text-gray-500 text-sm line-clamp-2">
                  {striptags(product.description)}
                </p>

                 <div className="flex items-center justify-between mt-4">

                  <span className="text-lg font-bold text-[#007595]">
                    ${product.price}
                  </span>

                  <Link
                    to={`/product/${product.id}`}
                    className="text-sm font-medium text-[#007595]
                    border border-[#007595] px-4 py-1 rounded-full
                    hover:bg-[#007595] hover:text-white
                    transition"
                  >
                    View
                  </Link>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SectionThree;