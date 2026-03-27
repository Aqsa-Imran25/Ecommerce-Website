import React, { useState } from "react";
import Layout from "../common/Layout";
import Sidebar from "../User/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons"; // Specific icon import
import { useForm } from "react-hook-form";
import { apiUrl, UserToken } from "../common/Http";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Store() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [previewImages, setPreviewImages] = useState([]);
  const navigate = useNavigate();
  // saveStore
  const saveStore = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("status", data.status);
      formData.append("slug", data.slug || "");

      if (data.logo && data.logo.length > 0) {
        formData.append("logo", data.logo[0]); // correctly append file
      }

      const res = await fetch(`${apiUrl}/vendors`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${UserToken()}`,
          Accept: "application/json",
        },
        body: formData,
      });

      // parse response JSON
      const result = await res.json();

      // ❗ If profile incomplete (middleware response)
      if (res.status === 403) {
        toast.error(result.message || "Please complete your profile first!");
        return;
      }

      // ❗ If user not authenticated
      if (res.status === 401) {
        toast.error("You must login first before creating a store!");
        return;
      }

      // ✅ On success
      if (res.status === 200) {
        toast.success(result.message || "Store created successfully!");

        // Save vendor info
        localStorage.setItem("vendorInfo", JSON.stringify(result.vendor));
        localStorage.removeItem("userInfo");
        sessionStorage.removeItem("userInfo");

        navigate("/vendor"); // redirect user
      }

      // ❗ Validation errors (422)
      else if (res.status === 422 && result.errors) {
        Object.values(result.errors).forEach((errorArr) => {
          errorArr.forEach((msg) => {
            toast.error(msg); // show each error as toast
          });
        });
      }

      // ❗ Other error statuses
      else {
        toast.error(result.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Unexpected Error:", error);
      toast.error("Server is not responding. Try again later.");
    }
  };

  const uploadTempImages = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImages([url]);
    }
  };

  // delete-images
  const deleteImage = (index) => {
    // setPreviewImages
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    // gallery id delete
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <div>
      <Layout>
        <div className="md:container md:mx-auto px-6 py-5 my-5">
          <div className="mb-6">
            <h5 className="text-sm md:text-2xl font-bold text-gray-800">
              My Store
            </h5>
            <p className="text-gray-500 text-sm mt-1">
              Manage your store information
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="w-full md:w-1/4">
              <Sidebar />
            </div>
            <div className="w-full md:w-3/4">
              <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8">
                <form
                  onSubmit={handleSubmit(saveStore)}
                  encType="multipart/form-data"
                >
                  {/* name */}
                  <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-1/2 px-3 mb-6 md:mb-0">
                      <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2">
                        Name
                      </label>
                      <input
                        {...register("name", {
                          required: "The name field is required.",
                        })}
                        className="appearance-none block w-full text-black border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        type="text"
                        placeholder="Store name"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="w-1/2 px-3 mb-6 md:mb-0">
                      <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2">
                        Slug
                      </label>
                      <input
                        {...register("slug", {
                          required: "The slug field is required.",
                        })}
                        className="appearance-none block w-full text-black border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        type="text"
                        placeholder="Slug"
                      />
                      {errors.slug && (
                        <p className="text-red-500 text-sm">
                          {errors.slug.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* status */}
                  <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3 mb-6">
                      <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2">
                        Status
                      </label>
                      <div className="relative">
                        <select
                          {...register("status", {
                            required: "Please select a status.",
                          })}
                          className="block appearance-none w-full border border-gray-200 text-black py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        >
                          <option value="">Select a Status</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>

                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg
                            className="fill-current h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                      {errors.status && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.status.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3 mb-6 md:mb-0">
                      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                        Logo
                      </label>

                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-400 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition">
                        <span className="text-gray-600 text-sm font-medium">
                          Choose Files
                        </span>

                        <span className="text-gray-500 text-xs mt-1">
                          or drag and drop images here
                        </span>

                        <input
                          type="file"
                          name="logo"
                          {...register("logo", { required: false })}
                          onChange={uploadTempImages}
                          className="hidden"
                        />
                      </label>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                        {previewImages.map((img, index) => (
                          <div
                            key={index}
                            className="relative group rounded-xl overflow-hidden shadow-md"
                          >
                            <img
                              src={img}
                              alt="new"
                              className="w-full h-32 object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => deleteImage(index)}
                              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                            >
                              <FontAwesomeIcon
                                icon={faCircleXmark}
                                className="text-red-500 text-lg"
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="rounded-md bg-[#007595] py-2 px-6 mt-2 text-white hover:bg-[#005f66]"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default Store;
