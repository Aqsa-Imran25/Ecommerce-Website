import React, { useEffect, useState } from "react";
import { apiUrl, getAuthToken, getUserRole } from "../../common/Http";
import Sample2 from "../../common/Sample2";
import Loader from "../../common/Loader";
import Empty from "../../common/Empty";

function EarningDashboard() {
  const role = getUserRole();
  const [loader, setLoader] = useState(false);

  const [earningsVendor, setEarningsVendor] = useState([]);

  const [earnings, setEarnings] = useState([]);

  // fetch all earnings
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

  // vendorearnings
  const fetchVendorEarnings = async () => {
    const res = await fetch(`${apiUrl}/vendorEarnings`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    const result = await res.json();
    console.log("Vendorresult", result);
    if (result.status === 200) {
      setEarningsVendor(result.data);
    }
  };

  useEffect(() => {
    if (role === "admin") {
      fetchEarnings();
    } else {
      fetchVendorEarnings();
    }
  }, [role]);

  return (
    //  manually
    <Sample2 title="Earnings">
      <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base">
        {loader == true && <Loader />}
        {role === "admin" && loader == false && earnings.length == 0 && (
          <Empty text="Earnings Are Empty!" />
        )}
        {role === "vendor" && loader == false && earningsVendor.length == 0 && (
          <Empty text="Vendor Earnings Are Empty!" />
        )}
        {role === "admin" && earnings.length > 0 && (
          <table className="w-full text-sm text-left rtl:text-right text-body">
            <thead className="bg-neutral-secondary-soft border-b border-gray-300">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">
                  Order
                </th>

                <th scope="col" className="px-6 py-3 font-medium">
                  Store
                </th>

                <th scope="col" className="px-6 py-3 font-medium">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Commission
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Net
                </th>
              </tr>
            </thead>
            <tbody>
              {earnings.map((earning, index) => (
                <tr
                  key={index}
                  className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-gray-300"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                  >
                    {earning.order.order_number}{" "}
                  </th>
                  <td className="px-6 py-4">{earning.store.name} </td>
                  <td className="px-6 py-4">
                    {new Date(earning.order.created_at).toLocaleString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </td>{" "}
                  <td className="px-6 py-4">{earning.amount}</td>
                  <td className="px-6 py-4">{earning.commission}</td>
                  <td className="px-6 py-4">{earning.net_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {role === "vendor" && earningsVendor.length > 0 && (
          <table className="w-full text-sm text-left rtl:text-right text-body">
            <thead className="bg-neutral-secondary-soft border-b border-gray-300">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">
                  Order
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Order Date
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Commission
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Net
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {earningsVendor.map((earning, index) => (
                <tr
                  key={index}
                  className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-gray-300"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                  >
                    {earning.order.order_number}{" "}
                  </th>
                  <td className="px-6 py-4">
                    {new Date(earning.order.created_at).toLocaleString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </td>{" "}
                  <td className="px-6 py-4">{earning.order.grand_total} </td>
                  <td className="px-6 py-4">{earning.amount}</td>
                  <td className="px-6 py-4">{earning.commission}</td>
                  <td className="px-6 py-4">{earning.net_amount}</td>
                  <td className="px-6 py-4">{earning.order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Sample2>
  );
}

export default EarningDashboard;
