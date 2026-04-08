import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../common/Layout";
import Sidebar from "../common/Sidebar";
import { getUserRole, apiUrl, getAuthToken } from "../common/Http";

function Dashboard() {
  const role = getUserRole();
  const [commission, setCommission] = useState(0);
  // vendor
  const [earningsVendor, setEarningsVendor] = useState([]);

  const [earnings, setEarnings] = useState([]);
  // admin
  const [counts, setCounts] = useState({
    users: 0,
    products: 0,
    orders: 0,
  });
  // vendor
  const [countsVendor, setCountsVendor] = useState({
    users: 0,
    products: 0,
    orders: 0,
  });
  // admin
  const fetchEarnings = async () => {
    const res = await fetch(`${apiUrl}/admin/totalEarnings`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    const result = await res.json();
    if (result.status === 200) {
      setEarnings(result.data);
    }
  };

  //   counts-admin
  const countData = async () => {
    if (role !== "admin") return;
    const res = await fetch(`${apiUrl}/dashboard-count`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    const result = await res.json();
    console.log("API Show Result:", result);
    if (result.status == 200) {
      setCounts({
        users: result.users,
        products: result.products,
        orders: result.orders,
      });
    } else {
      console.log("Something went wrong!");
    }
  };
  // commission
  const fetchCommission = async () => {
    const res = await fetch(`${apiUrl}/admin/totalCommission`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    const result = await res.json();
    if (result.status === 200) {
      setCommission(result.total_commission);
    }
  };

  //   counts-vendor
  const countVendor = async () => {
    const res = await fetch(`${apiUrl}/dashboard-count-vendor`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    const result = await res.json();
    console.log("API Show Result Vendor:", result);
    if (result.status == 200) {
      console.log("API Show Result Vendor-200:", result.products);
      setCountsVendor({
        products: result.products,
        orders: result.orders,
        stores: result.stores,
      });
    } else {
      console.log("Something went wrong!");
    }
  };
  // earning-vendor
  const fetchVendorEarnings = async () => {
    const res = await fetch(`${apiUrl}/vendor/totalEarnings`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    console.log("res", res);
    const result = await res.json();
    if (result.status === 200) {
      console.log("result-200", result);
      setEarningsVendor(result.data);
    }
  };
  useEffect(() => {
    countData();
    countVendor();
    fetchCommission();
    fetchEarnings();
    fetchVendorEarnings();
  }, []);

  return (
    <div>
      <Layout>
        <div className="md:container md:mx-auto px-6 py-5 my-5">
          {
            role === "admin" && 
            <h2 className="my-2 text-base md:text-2xl">Admin Dashboard</h2>

          }
            {
            role === "vendor" && 
            <h2 className="my-2 text-base md:text-2xl">Vendor Dashboard</h2>

          }
            {
            role === "user" && 
            <h2 className="my-2 text-base md:text-2xl">User Dashboard</h2>

          }
          <div className="flex flex-col md:flex-row gap-3">
            <div className="w-full md:w-1/4">
              {/* Role={role} */}
              <Sidebar role={role} />
            </div>
            <div className="w-full md:w-3/4">
              {role === "admin" && (
                <div className="grid md:grid-cols-3 gap-5">
                  <div className="shadow-lg rounded-lg border-2 border-gray-200">
                    <div className="p-4 text-sm md:text-2xl">
                      <span>{counts.users}</span>
                      <h2>Users</h2>
                    </div>
                    <div className="bg-gray-100 text-center py-2 border-t border-gray-300">
                      <Link to="/admin/users">View Users</Link>
                    </div>
                  </div>
                  <div className="shadow-lg rounded-lg border-2 border-gray-200">
                    <div className="p-4 text-sm md:text-2xl">
                      <span>{counts.products}</span>
                      <h2>Products</h2>
                    </div>
                    <div className="bg-gray-100 py-2 text-center border-t border-gray-300">
                      <Link to="/products">View Products</Link>
                    </div>
                  </div>
                  <div className="shadow-lg rounded-lg border-2 border-gray-200">
                    <div className="p-4 text-sm md:text-2xl">
                      <span>{counts.orders}</span>
                      <h2>Orders</h2>
                    </div>
                    <div className="bg-gray-100 text-center py-2 border-t border-gray-300">
                      <Link to="/admin/orders">View Orders</Link>
                    </div>
                  </div>
                  {/* <div className="shadow-lg rounded-lg border-2 border-gray-200">
                    <div className="p-4 text-sm md:text-2xl">
                      <span>{earnings ? earnings.length : 0}</span>
                      <h2>Earnings</h2>
                    </div>
                    <div className="bg-gray-100 py-2 text-center border-t border-gray-300">
                      <Link to="/admin/earnings/">View Earnings</Link>
                    </div>
                  </div>
                  <div className="shadow-lg rounded-lg border-2 border-gray-200">
                    <div className="p-4 text-sm md:text-2xl">
                      <span>{commission}</span>
                      <h2>Total Commission</h2>
                    </div>
                  </div>
                  <div className="shadow-lg rounded-lg border-2 border-gray-200">
                    <div className="p-4 text-sm md:text-2xl">
                      <span>
                        {earnings.reduce(
                          (sum, item) => sum + parseFloat(item.net_amount || 0),
                          0,
                        )}
                      </span>
                      <h2>Vendor Earnings</h2>
                    </div>
                    <div className="bg-gray-100 py-2 text-center border-t border-gray-300">
                      <Link to="/admin/earnings/">View Vendor Earnings</Link>
                    </div>

                  </div> */}
                </div>
              )}

              {/* vendor */}
              {role === "vendor" && (
                <div className="grid md:grid-cols-3 gap-5">
                  <div className="shadow-lg rounded-lg border-2 border-gray-200">
                    <div className="p-4 text-sm md:text-2xl">
                      <span>{countsVendor.stores}</span>
                      <h2>Stores</h2>
                    </div>
                    <div className="bg-gray-100 py-2 text-center border-t border-gray-300">
                      <Link to="/my-store">View Stores</Link>
                    </div>
                  </div>
                  <div className="shadow-lg rounded-lg border-2 border-gray-200">
                    <div className="p-4 text-sm md:text-2xl">
                      <span>{countsVendor.products}</span>
                      <h2>Products</h2>
                    </div>
                    <div className="bg-gray-100 py-2 text-center border-t border-gray-300">
                      <Link to="/products">View Products</Link>
                    </div>
                  </div>
                  <div className="shadow-lg rounded-lg border-2 border-gray-200">
                    <div className="p-4 text-sm md:text-2xl">
                      <span>{countsVendor.orders}</span>
                      <h2>Orders</h2>
                    </div>
                    <div className="bg-gray-100 text-center py-2 border-t border-gray-300">
                      <Link to="/orders">View Orders</Link>
                    </div>
                  </div>
                  <div className="shadow-lg rounded-lg border-2 border-gray-200">
                    <div className="p-4 text-sm md:text-2xl">
                      <span>
                      </span>
                      <span>{earningsVendor ? earningsVendor : 0}</span>
                      <h2>Earnings</h2>
                    </div>
                    <div className="bg-gray-100 py-2 text-center border-t border-gray-300">
                      <Link to="/vendor/earnings/">View Earnings</Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default Dashboard;
