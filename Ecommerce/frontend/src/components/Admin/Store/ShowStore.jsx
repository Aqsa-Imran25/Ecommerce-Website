import React, { useEffect, useState } from "react";
import Sample from "../../common/Sample";
import Loader from "../../common/Loader";
import Empty from "../../common/Empty";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons"; // The solid style icon
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { adminToken, apiUrl } from "../../common/Http";
import Sample2 from "../../common/Sample2";

function ShowStore() {
  const [stores, setStores] = useState([]);
  const [loader, setLoader] = useState(false);
  // deleteStore

  const deleteStore = async (id) => {
    if (!window.confirm("Are you sure you want to delete this store?")) return;

    const res = await fetch(`${apiUrl}/admin/stores/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${adminToken()}`,
      },
    });
    const result = await res.json();
    console.log("API Show Result:", result.data);
    if (result.status == 200) {
      toast.success(result.message);
      setStores((prevstores) =>
        prevstores.filter((stores) => stores.id !== id),
      );
    } else {
      console.log("Something went wrong!");
    }
  };

  const fetchStoreApi = async () => {
    setLoader(true);
    const res = await fetch(`${apiUrl}/admin/stores`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${adminToken()}`,
      },
    });
    setLoader(false);
    const result = await res.json();

    console.log("API Show Result:", result.data);

    console.log("Token-Show:", adminToken());
    if (result.status == 200) {
      setStores(result.data);
    } else {
      console.log("Something went wrong!");
    }
  };
  // approve
  const approveStore = async (id) => {
    const res = await fetch(`${apiUrl}/admin/approvedStore/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${adminToken()}`,
      },
    });

    const result = await res.json();

    if (result.status === 200) {
      toast.success(result.message);

      setStores((prev) =>
        prev.map((store) =>
          store.id === id ? { ...store, status: "active" } : store
        )
      );
    }
  };
  // rejected
  const rejectStore = async (id) => {
    const res = await fetch(`${apiUrl}/admin/rejectedStore/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${adminToken()}`,
      },
    });

    const result = await res.json();

    if (result.status === 200) {
      toast.success(result.message);

      setStores((prev) =>
        prev.map((store) =>
          store.id === id ? { ...store, status: "rejected" } : store
        )
      );
    }
  };

  useEffect(() => {
    fetchStoreApi();
  }, []);
  return (
    <>
      <Sample2 title="Stores">
        <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base">
          {loader == true && <Loader />}
          {loader == false && stores.length == 0 && (
            <Empty text="stores Are Empty!" />
          )}
          {stores && stores.length > 0 && (
            <table className="w-full text-sm text-left rtl:text-right text-body">
              <thead className="bg-neutral-secondary-soft border-b border-gray-300">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Id
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Slug
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Logo
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store, index) => (
                  <tr
                    key={index}
                    className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-gray-300"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                    >
                      {store.id}
                    </th>
                    <td className="px-6 py-4">{store.name}</td>
                    <td className="px-6 py-4">{store.slug}</td>
                    <td className="px-6 py-4">
                      <img
                        src={
                          store.logo
                            ? `http://backend.test/storage/logo-image/${store.logo}`
                            : "https://via.placeholder.com/50"
                        }
                        width={50}
                        alt="logo"
                      />
                    </td>
                    <td className="px-6 py-4">
                      {
                        store.status === "active" ? (
                          <span className="bg-green-600 text-white px-3 py-1 rounded">
                            Active
                          </span>
                        ) : store.status === "pending" ? (
                          <span className="bg-yellow-500 text-white px-3 py-1 rounded">
                            Pending
                          </span>
                        ) : (
                          <span className="bg-red-500 text-white px-3 py-1 rounded">
                            Rejected
                          </span>
                        )
                      }
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center">

                        {/* Approve / Reject */}
                        {store.status === "pending" && (
                          <>
                            <button
                              onClick={() => approveStore(store.id)}
                              className="bg-green-600 text-white px-2 py-1 rounded"
                            >
                              Approve
                            </button>

                            <button
                              onClick={() => rejectStore(store.id)}
                              className="bg-red-600 text-white px-2 py-1 rounded"
                            >
                              Reject
                            </button>
                          </>
                        )}

                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-around">
                        <Link
                          onClick={() => deleteStore(store.id)}
                          to="#"
                          className="font-medium text-fg-store hover:underline text-red-600"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Sample2>
    </>
  );
}

export default ShowStore;
