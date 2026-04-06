import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "./Http";
import striptags from "striptags";
import { FaHeart, FaShoppingCart } from "react-icons/fa";

function Cards() {

    const [newProducts, setNewProduct] = useState([]);

    const newArrivals = async () => {
        const res = await fetch(`${apiUrl}/latestProduct`);
        const result = await res.json();

        if (result.status === 200) {
            setNewProduct(result.data);
        }
    };

    useEffect(() => {
        newArrivals();
    }, []);

    return (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {newProducts.map((product) => (

                <div
                    key={product.id}

                    className="group relative rounded-2xl overflow-hidden
          bg-white/80 backdrop-blur-md border border-gray-200
          shadow-sm hover:shadow-2xl transition-all duration-500
          hover:-translate-y-2"
                >


                    <div className="relative overflow-hidden">

                        <Link to={`/product/${product.id}`}>
                            <img
                                src={product.image_url}
                                alt={product.title}
                                className="h-72 w-full object-cover
                transition duration-700 group-hover:scale-110"
                            />
                        </Link>



                    </div>


                    <div className="p-6">

                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-[#007595] transition">
                            {product.title}
                        </h3>

                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                            {striptags(product.description)}
                        </p>

                        <div className="flex items-center justify-between mt-4">

                            <span className="text-lg font-semibold text-[#007595]">
                                Rs {product.price}
                            </span>

                            <Link
                                to={`/product/${product.id}`}
                                className="text-sm border border-[#007595]
                text-[#007595] px-4 py-1 rounded-full
                hover:bg-[#007595] hover:text-white transition"
                            >
                                View
                            </Link>

                        </div>

                    </div>

                </div>

            ))}
        </div>
    );
}

export default Cards;