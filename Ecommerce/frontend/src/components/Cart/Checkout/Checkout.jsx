import React, { useContext, useEffect, useState } from "react";
import Layout from "../../common/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { CartContext } from "../../context/Cart";
import { useForm } from "react-hook-form";
import { apiUrl, getAuthToken, UserToken } from "../../common/Http";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";

function Checkout() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const { cartData, shipping, subTotal, grandTotal } = useContext(CartContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [paymentMethod, setPaymentMethod] = useState(`cod`);
  // handlepayment
  const handlePayment = (e) => {
    setPaymentMethod(e.target.value);
  };
  // fetch user
  const fetchUserData = async () => {
    try {
      const res = await fetch(`${apiUrl}/getUser`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${UserToken()}`,
        },
      });

      const result = await res.json();
      console.log("API Response:", result);

      if (result.status === 200 && result.data) {
        setValue("name", result.data.name);
        setValue("email", result.data.email);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Something Went Wrong!");
    }
  };
  // fetchprofile
  const fetchProfileData = async () => {
    try {
      const res = await fetch(`${apiUrl}/myaccount`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${UserToken()}`,
        },
      });

      const result = await res.json();
      console.log("API Response:", result);

      if (result.status === 200 && result.data) {
        setValue("phone_num", result.data.phone_num);
        setValue("city", result.data.city);
        setValue("state", result.data.state);
        setValue("zip", result.data.zip);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Something Went Wrong!");
    }
  };

  const handleCheckout = async (data) => {
    console.log("Form Data:", data);
    console.log("Cart Data:", cartData);

    if (!data.payment) {
      toast.error("Please select payment method");
      return;
    }
    if (paymentMethod) {
      saveOrder(data);
    }
  };
  const saveOrder = async (formData) => {
    console.log(cartData);
    const newFormData = {
      ...formData,
      sub_total: subTotal(),
      shipping: shipping(),
      grand_total: grandTotal(),
      discount: 0,
      status: "pending",
      cart: cartData,
    };
    const res = await fetch(`${apiUrl}/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(newFormData),
    });
    const result = await res.json();

    console.log("API Show Result:", result);

    if (result.status == 200) {
      localStorage.removeItem("cart");
      navigate(`/myorder}`, {
        state: {
          order: result.data,
          orderItems: cartData,
        },
      });
    } else {
      toast.error(result.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchProfileData();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Billing Details</h2>

            <form className="space-y-6" onSubmit={handleSubmit(handleCheckout)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">
                    Name
                  </label>

                  <input
                    {...register("name", { required: "Name required" })}
                    type="text"
                    className="w-full border bg-gray-50
                                         rounded-lg px-4 py-2"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">
                    Email
                  </label>

                  <input
                    {...register("email", { required: "Email required" })}
                    type="email"
                    className="w-full bg-gray-50 border rounded-lg px-4 py-2"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-600">
                  Mobile
                </label>

                <input
                  {...register("phone_num", {
                    required: "Phone number required",
                  })}
                  placeholder="0778643677"
                  type="text"
                  className="w-full bg-gray-50 border rounded-lg px-4 py-2"
                />

                {errors.phone_num && (
                  <p className="text-red-500 text-sm">
                    {errors.phone_num.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">
                    City
                  </label>
                  <input
                    {...register("city", {
                      required: "City required",
                    })}
                    type="text"
                    placeholder="City"
                    className="w-full bg-gray-50 border rounded-lg px-4 py-2"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">
                    State
                  </label>
                  <input
                    {...register("state", {
                      required: "State required",
                    })}
                    type="text"
                    placeholder="State"
                    className="w-full bg-gray-50 border rounded-lg px-4 py-2"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm">
                      {errors.state.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">
                    Zip Code
                  </label>
                  <input
                    {...register("zip", {
                      required: "Zip required",
                    })}
                    type="text"
                    placeholder="Zip Code"
                    className="w-full bg-gray-50 border rounded-lg px-4 py-2"
                  />
                  {errors.zip && (
                    <p className="text-red-500 text-sm">{errors.zip.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-xl font-semibold mb-6">Order Items</h3>

                <div className="space-y-6">
                  {cartData?.map((cart, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row items-center justify-between border-b pb-5"
                    >
                      <div className="flex items-center gap-5">
                        <img
                          src={cart.image_url}
                          alt={cart.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />

                        <div>
                          <h4 className="font-medium text-lg">{cart.title}</h4>

                          <p className="text-sm text-gray-500">
                            RS {cart.price}
                          </p>
                        </div>
                      </div>

                      {cart.size && (
                        <span className="bg-[#007595] text-white px-4 py-2 rounded-md text-sm">
                          Size: {cart.size}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-8 bg-[#007595] hover:bg-gray-900 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
              >
                <FontAwesomeIcon icon={faShoppingCart} />
                Proceed To Checkout
              </button>
            </form>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md h-fit sticky top-20">
            <h3 className="text-xl font-semibold mb-6">Order Summary</h3>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs {subTotal()}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Rs {shipping()}</span>
              </div>

              <hr />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>Rs {grandTotal()}</span>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="font-semibold mb-4">Payment Method</h4>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="stripe"
                    {...register("payment", { required: true })}
                    className="accent-[#007595]"
                  />
                  Stripe
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="cod"
                    {...register("payment", { required: true })}
                    className="accent-[#007595]"
                  />
                  Cash On Delivery
                </label>

                {errors.payment && (
                  <p className="text-red-500 text-sm">
                    Please select payment method
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Checkout;
