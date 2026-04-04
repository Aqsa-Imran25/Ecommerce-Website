import React, { useEffect, useState } from "react";
import Loader from "../../common/Loader";
import Empty from "../../common/Empty";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { adminToken, apiUrl, getAuthToken } from "../../common/Http";
import Sample from "../../common/Sample";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons"; // The solid style icon

function ShowStore({ mode }) {
  const [stores, setStores] = useState([]);
  const [loader, setLoader] = useState(false);

  const fetchStoreApi = async () => {
    setLoader(true);

    let url = "";

    if (mode === "admin") {
      url = `${apiUrl}/admin/stores`;
    } else if (mode === "vendor") {
      url = `${apiUrl}/vendor/stores`;
    } else {
      url = `${apiUrl}/vendor/stores`;
    }

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    const result = await res.json();

    setLoader(false);

    if (result.status === 200) {
      setStores(result.data);
    } else {
      toast.error("Failed to load store");
    }
  };

  const deleteStore = async (id) => {
    if (!window.confirm("Are you sure you want to delete this store?")) return;

    const url =
      mode === "admin"
        ? `${apiUrl}/admin/stores/${id}`
        : `${apiUrl}/vendor/stores/${id}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${
          mode === "admin" ? adminToken() : getAuthToken()
        }`,
      },
    });

    const result = await res.json();

    if (result.status === 200) {
      toast.success(result.message);
      setStores((prev) => prev.filter((store) => store.id !== id));
    } else {
      toast.error(result.message || "Delete failed");
    }
  };

  const approveStore = async (id) => {
    if (mode !== "admin") return;

    const res = await fetch(`${apiUrl}/admin/approvedStore/${id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${adminToken()}`,
      },
    });

    const result = await res.json();

    if (result.status === 200) {
      toast.success(result.message);

      setStores((prev) =>
        prev.map((store) =>
          store.id === id ? { ...store, status: "active" } : store,
        ),
      );
    } else {
      toast.error(result.message || "Approval failed");
    }
  };

  const rejectStore = async (id) => {
    if (mode !== "admin") return;

    const res = await fetch(`${apiUrl}/admin/rejectedStore/${id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${adminToken()}`,
      },
    });

    const result = await res.json();

    if (result.status === 200) {
      toast.success(result.message);

      setStores((prev) =>
        prev.map((store) =>
          store.id === id ? { ...store, status: "rejected" } : store,
        ),
      );
    } else {
      toast.error(result.message || "Reject failed");
    }
  };

  useEffect(() => {
    fetchStoreApi();
  }, [mode]);

  return (
    <Sample title="Stores" btnText="Create" to="/vendor">
      <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base">
        {loader && <Loader />}

        {!loader && stores.length === 0 && <Empty text="stores Are Empty!" />}

        {stores.length > 0 && (
          <table className="w-full text-sm text-left text-body">
            <thead className="bg-neutral-secondary-soft border-b border-gray-300">
              <tr>
                <th className="px-6 py-3">Id</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Slug</th>
                <th className="px-6 py-3">Logo</th>
                <th className="px-6 py-3">Status</th>
                {mode === "admin" && <th className="px-6 py-3">is_Approved</th>}
                {mode === "vendor" && stores.status !== "rejected" && (
                  <th className="px-6 py-3">Action</th>
                )}
              </tr>
            </thead>

            <tbody>
              {stores.map((store) => (
                <tr
                  key={store.id}
                  className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-gray-300"
                >
                  <td className="px-6 py-4">{store.id}</td>
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

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    {store.status === "active" ? (
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
                    )}
                  </td>

                  {/* ACTION */}

                  {mode === "admin" && store.status === "pending" && (
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center">
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
                      </div>
                    </td>
                  )}

                  {/* actions */}
                  <td className="px-6 py-4">
                    <div className="flex">
                      {mode === "vendor" && store.status !== "rejected" && (
                        <Link
                          to={`/vendor/store/${store.id}/edit`}
                          className="font-medium text-fg-brand hover:underline text-blue-600"
                        >
                          <FontAwesomeIcon icon={faPencil} />
                        </Link>
                      )}
                      {mode === "vendor" && store.status !== "rejected" && (
                        <Link
                          onClick={() => deleteStore(store.id)}
                          to="#"
                          className="font-medium text-fg-brand hover:underline text-red-600"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Sample>
  );
}

export default ShowStore;
