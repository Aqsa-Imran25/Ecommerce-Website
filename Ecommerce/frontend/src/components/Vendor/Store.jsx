import React, { useContext, useState } from "react";
import Layout from "../common/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { apiUrl, getUserRole, UserToken } from "../common/Http";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { VendorAuthContext } from "../context/VendorAuth";
import Sidebar from "../common/Sidebar";

function Store() {
  const { login: vendorLogin } = useContext(VendorAuthContext);
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [previewImages, setPreviewImages] = useState([]);
  const navigate = useNavigate();
  // role
  const role = getUserRole();

  const saveStore = async (data) => {
    try {
      console.log("FULL DATA:", data);
      const formData = new FormData();
      formData.append("name", data.name);

      if (data.logo && data.logo.length > 0) {
        console.log("Image", data.logo[0]);
        formData.append("logo", data.logo[0]);
      }

      const res = await fetch(`${apiUrl}/vendors`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${UserToken()}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const result = await res.json();
      console.log("Result", result);
      if (res.status === 401) {
        toast.error("You must login first before creating a store!");
        return;
      }
      if (res.status === 200) {
        console.log("Result-200", result);

        toast.success(
          result.message ||
            "Store created successfully wait for admin approval!",
        );

        console.log("Vendor", result.data);

        navigate("/vendor");
      } else if (res.status === 422 && result.errors) {
        Object.values(result.errors).forEach((errorArr) => {
          errorArr.forEach((msg) => {
            toast.error(msg);
          });
        });
      } else {
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

  // slug
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
  };

  // delete-images
  const deleteImage = (index) => {
    // setPreviewImages
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
              <h3>Role:{role}</h3>
              <Sidebar role={role} />
            </div>
            <div className="w-full md:w-3/4">
              <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8">
                <form
                  onSubmit={handleSubmit(saveStore)}
                  encType="multipart/form-data"
                >
                  <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-1/2 px-3 mb-6 md:mb-0">
                      <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2">
                        Name
                      </label>
                      <input
                        {...register("name", {
                          required: "The name field is required.",
                        })}
                        onChange={(e) => {
                          setValue("slug", generateSlug(e.target.value));
                        }}
                        className="appearance-none block w-full text-black border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
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
                        {...register("slug")}
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
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setValue("logo", e.target.files);

                            uploadTempImages(e);
                          }}
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
