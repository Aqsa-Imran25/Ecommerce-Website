import React, { useContext, useEffect, useState } from "react";
import Layout from "../common/Layout";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { CartContext } from "../context/Cart";


function Cart() {
  
  const {
    cartData,
    shipping,
    subTotal,
    grandTotal,
    updateCartqty,
    removeItem,
    shippingCost,
  } = useContext(CartContext);

  const isEmpty = cartData.length === 0;


  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-4xl font-bold text-center mb-12 text-[#007595]">
          Shopping Cart
        </h2>

        {isEmpty && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">🛒 Your cart is empty</p>
            <Link
              to="/shop"
              className="mt-4 inline-block bg-[#007595] text-white px-6 py-2 rounded-lg hover:bg-black transition"
            >
              Continue Shopping
            </Link>
          </div>
        )}

        {!isEmpty && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {cartData.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row gap-6 items-center hover:shadow-2xl transition duration-300"
                >
                  <img
                    src={item.image_url}
                    className="w-28 h-28 rounded-xl object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#007595]">
                      {item.title}
                    </h3>

                    <p className="text-gray-500 mt-1">Price: Rs {item.price}</p>

                    <div className="flex items-center gap-4 mt-4">
                      <button
                        onClick={() =>
                          updateCartqty(
                            item.product_id,
                            item.qty - 1,
                            item.size,
                          )
                        }
                        disabled={item.qty <= 1}
                        className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                      >
                        −
                      </button>

                      <span className="font-bold text-lg">{item.qty}</span>

                      <button
                        onClick={() =>
                          updateCartqty(
                            item.product_id,
                            item.qty + 1,
                            item.size,
                          )
                        }
                        className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:scale-110 transition duration-300"
                  >
                    <FontAwesomeIcon icon={faTrashCan} className="text-2xl" />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 h-fit sticky top-10">
              <h3 className="text-2xl font-bold mb-6">Order Summary</h3>

              <div className="flex justify-between mb-3">
                <span>Subtotal</span>
                <span>Rs {subTotal()}</span>
              </div>

              <div className="flex justify-between mb-3">
                <span>Shipping</span>
                <span>Rs {shipping()}</span>
              </div>

              <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>Rs {grandTotal()}</span>
              </div>

              <Link
                to="/checkout"
                className="w-full mt-6 bg-[#007595] text-white py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-black transition duration-300 hover:scale-105"
              >
                <FontAwesomeIcon icon={faShoppingCart} />
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Cart;
