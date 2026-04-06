import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiUrl, getAuthToken, getUserRole, UserToken } from "../common/Http";
import Layout from "../common/Layout";
import Loader from "../common/Loader";
import Sidebar from "../common/Sidebar";

function UserOrderDetail() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState(null);
    const token = getAuthToken();
    const role=getUserRole();

    // fetch single id order
    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${apiUrl}/order/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const result = await res.json();
                if (res.ok && result.data) {
                    console.log(result)
                    setOrder(result.data.order);
                    setItems(result.data.items);
                } else {
                    toast.error("Order not found!");
                }
            } catch (error) {
                toast.error("Something went wrong!");
            } finally {
                setLoading(false);
            }
        };

        // fetchprofiledata
        const fetchProfileData = async () => {
            try {
                const res = await fetch(`${apiUrl}/myaccount`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        "Accept": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                });

                const result = await res.json();
                console.log("API Response:", result);

                if (result.status === 200 && result.data) {
                    setProfile(result.data)
                }

            } catch (error) {
                console.error("Fetch error:", error);

            }
        };
        fetchOrder();
        fetchProfileData();
    }, [id]);

    if (loading) return <Loader />;
    if (!order) return <div className="p-10 text-center text-lg text-red-500">Order not found!</div>;

    return (
        <div >
            <Layout>
                <div className='md:container md:mx-auto px-6 py-5 my-5'>

                    <div className="mb-6">
                        <div className="mb-6">
                            <h5 className="text-sm md:text-2xl font-bold text-gray-800">
                                Order-Detail
                            </h5>
                            <p className="text-gray-500 text-sm mt-1">
                                Check the order detail of your recent purchases.
                            </p>
                        </div>

                    </div>

                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="w-full md:w-1/4">
                            <Sidebar role={role} />
                        </div>
                        <div className="w-full md:w-3/4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


                                <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
                                    <h3 className="font-semibold text-gray-700">Customer</h3>
                                    <p className="text-gray-600 test-sm">{order.user?.name}</p>
                                    <p className="text-gray-600 text-sm">{order.phone_num}</p>
                                    <p className="text-gray-600 text-sm">{order.user?.email}</p>
                                </div>


                                <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
                                    <h3 className="font-semibold text-gray-700">Shipping</h3>
                                    <p className="text-gray-600 text-sm">{profile?.city}, {profile?.state}</p>
                                    <p className="text-gray-600 text-sm">{profile?.zip}</p>
                                </div>


                                <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
                                    <h3 className="font-semibold text-gray-700">Status</h3>
                                    <div className="flex gap-2 mt-2">
                                        <span className={`px-3 py-1 text-sm rounded-full text-white ${order.status === "pending" ? "bg-yellow-500" :
                                            order.status === "shipped" ? "bg-blue-500" :
                                                order.status === "delivered" ? "bg-green-600" :
                                                    "bg-gray-600"
                                            }`}>
                                            {order.status}
                                        </span>

                                        <span className={`px-3 py-1 text-sm rounded-full text-white ${order.payment_status === "paid" ? "bg-green-600" : "bg-red-500"
                                            }`}>
                                            {order.payment_status}
                                        </span>
                                    </div>
                                </div>

                            </div>


                            <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
                                <h3 className="text-xl font-semibold border-b pb-2">Ordered Items</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {items.map(item => (
                                        <div
                                            key={item.id}
                                            className="flex flex-col sm:flex-row items-center gap-4 border rounded-lg p-4 hover:shadow-lg transition"
                                        >
                                            <img
                                                src={item.product?.image_url}
                                                alt={item.product?.title}
                                                className="w-24 h-24 object-cover rounded-lg hover:scale-105 transition"
                                            />
                                            <div className="sm:ml-4 text-center sm:text-left">
                                                <p className="font-medium text-gray-800">{item.product?.title}</p>
                                                <p className="text-gray-500 text-sm">Qty: {item.qty}</p>
                                                <p className="text-gray-700 font-semibold">Rs. {item.price}</p>
                                            </div>
                                            <div className="sm:ml-auto font-bold text-gray-900">
                                                Rs. {item.qty * item.price}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md lg:max-w-sm ml-auto mt-4">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h3>
                                <div className="space-y-2 text-gray-700">
                                    <div className="flex justify-between"><span>Subtotal</span><span>Rs. {order.sub_total}</span></div>
                                    <div className="flex justify-between"><span>Shipping</span><span>Rs. {order.shipping}</span></div>
                                    <div className="flex justify-between text-red-500">
                                        <span>Discount</span><span>- Rs. {order.discount}</span></div>
                                    <div className="flex justify-between font-bold border-t pt-3">
                                        <span>Total</span><span>Rs. {order.grand_total}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </div>
    )
}

export default UserOrderDetail