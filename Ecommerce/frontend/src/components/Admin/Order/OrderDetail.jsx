import React, { useEffect, useState } from "react";
import Sample from "../../common/Sample";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../common/Loader";
import { apiUrl, adminToken, getUserRole, getAuthToken } from "../../common/Http";
import { useForm } from "react-hook-form";

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [profile, setProfile] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const role = getUserRole();
  const token = getAuthToken();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();


  // order status update
  const updateOrder = async (data) => {
    if (role !== admin)
      return;
    console.log(data)
    const res = await fetch(`${apiUrl}/orders/${id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        "Accept": "application/json",
        "Authorization": `Bearer ${adminToken()}`

      }, body: JSON.stringify(data)
    })
    console.log("res", res);
    const result = await res.json();

    console.log("API Show Result:", result.data);

    if (result.status == 200) {

      toast.success(result.message)
      navigate('/admin/orders')
    } else {
      console.log("Something went wrong!")
    }
  }
  // fetch single id order
  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (res.ok && result.data) {
          console.log(result)
          setOrder(result.data.order);
          setItems(result.data.items);
          reset({
            status: result.data.order.status,
          });
        } else {
          toast.error("Order not found!");
        }
      } catch (error) {
        toast.error("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

  }, [id]);

  if (loading) return <Loader />;
  if (!order) return <div className="p-10 text-center text-lg text-red-500">Order not found!</div>;

  return (
    <div>
   <Sample
  title={`Order Details — #${order.id}`}
  btnText="← Back to Orders"
  to="/orders"
>
  <div className="flex flex-col lg:flex-row gap-6">

    {/* ADMIN SIDEBAR */}
    {role === "admin" && (
      <div className="w-full lg:w-1/4 space-y-6">
        <div className="bg-white shadow-md rounded-lg p-4">
          <form onSubmit={handleSubmit(updateOrder)}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Order Status
              </label>

              <select
                {...register("status", { required: "Select order status" })}
                className="w-full border-gray-300 rounded-md px-2 py-2 border"
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {errors.status && (
                <p className="text-red-500 text-sm">
                  {errors.status.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#007595] text-white py-2 rounded-md hover:bg-[#005f70] transition"
            >
              Update Order
            </button>
          </form>
        </div>
      </div>
    )}

    {/* MAIN CONTENT */}
    <div className="w-full lg:w-3/4 space-y-6">

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
          <h3 className="font-semibold text-gray-700">Customer</h3>
          <p className="text-gray-600 break-words">{order.user?.name}</p>
          <p className="text-gray-600 break-words">{order.user?.email}</p>
          <p className="text-gray-600 break-words">
            {order.user?.profile?.phone_num}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
          <h3 className="font-semibold text-gray-700">Shipping</h3>
          <p className="text-gray-600 break-words">
            {order.user?.profile?.city}, {order.user?.profile?.state}
          </p>
          <p className="text-gray-600">
            ZIP: {order.user?.profile?.zip}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
          <h3 className="font-semibold text-gray-700">Status</h3>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span
              className={`px-3 py-1 text-sm rounded-full text-white ${
                order.status === "pending"
                  ? "bg-yellow-500"
                  : order.status === "shipped"
                  ? "bg-blue-500"
                  : order.status === "delivered"
                  ? "bg-green-600"
                  : "bg-gray-600"
              }`}
            >
              {order.status}
            </span>
          </div>
        </div>

      </div>

      {/* ORDER ITEMS */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md space-y-4">
        <h3 className="text-lg sm:text-xl font-semibold border-b pb-2">
          Ordered Items
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-4 border rounded-lg p-4 hover:shadow-lg transition"
            >
              <img
                src={item.product?.image_url}
                alt={item.product?.title}
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
              />

              <div className="text-center sm:text-left flex-1">
                <p className="font-medium text-gray-800 break-words">
                  {item.product?.title}
                </p>
                <p className="text-gray-500 text-sm">Qty: {item.qty}</p>
                <p className="text-gray-700 font-semibold">
                  Rs. {item.price}
                </p>
              </div>

              <div className="font-bold text-gray-900">
                Rs. {item.qty * item.price}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUMMARY */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md w-full sm:max-w-md ml-auto">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
          Order Summary
        </h3>

        <div className="space-y-2 text-gray-700 text-sm sm:text-base">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rs. {order.sub_total}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>Rs. {order.shipping}</span>
          </div>

          <div className="flex justify-between text-red-500">
            <span>Discount</span>
            <span>- Rs. {order.discount}</span>
          </div>

          <div className="flex justify-between font-bold border-t pt-3">
            <span>Total</span>
            <span>Rs. {order.grand_total}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</Sample>
    </div>
  );
}

export default OrderDetail;