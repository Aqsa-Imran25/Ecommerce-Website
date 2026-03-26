import React, { useState } from 'react'
import Layout from '../common/Layout'
import Sidebar from '../User/Sidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'; // Specific icon import
import { useForm } from 'react-hook-form';
import { apiUrl, UserToken } from '../common/Http';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


function Store() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [previewImages, setPreviewImages] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [galleryIds, setGalleryIds] = useState([]);
    const navigate = useNavigate();
    // saveStore
    const saveStore = async (data) => {
        console.log(data)
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("status", data.status);
            formData.append("slug", data.slug || "");

            const res = await fetch(`${apiUrl}/vendors`, {
                method: "POST",

                headers: {
                    "Authorization": `Bearer ${UserToken()}`,
                    "Accept": "application/json",

                },
                body: formData
            });
            const text = await res.text();
            console.log(text);

            let result;
            try {
                result = JSON.parse(text);
            } catch (err) {
                console.error("Not JSON:", text);
            }
            console.log(result);

            if (res.status === 200) {
                toast.success(result.message);

                localStorage.removeItem("userInfo");
                sessionStorage.removeItem("userInfo");

                localStorage.setItem("vendorInfo", JSON.stringify(result.vendor));
                navigate("/vendor");
            }

            else if (res.status === 422 && result.errors) {
                Object.values(result.errors).forEach(errorArray => {
                    errorArray.forEach(message => {
                        toast.error(message);
                        console.log(message);
                    });
                });
            }

            else {
                toast.error(result.message || "Something went wrong");
                console.log(result.message);

            }

        } catch (error) {
            console.error("Unexpected Error:", error);
            toast.error("Unexpected Server Error");
        }
    }

    // delete-images
    const deleteImage = (index) => {
        // setPreviewImages
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
        // gallery id delete
        setGalleryIds(prev => prev.filter((_, i) => i !== index));

    }
    return (
        <div >
            <Layout>
                <div className='md:container md:mx-auto px-6 py-5 my-5'>
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
                                <form onSubmit={handleSubmit(saveStore)}>
                                    {/* name */}
                                    <div className="flex flex-wrap -mx-3 mb-6">
                                        <div className="w-1/2 px-3 mb-6 md:mb-0">
                                            <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2">name</label>
                                            <input
                                                {...register("name", { required: "The name field is required." })}
                                                className="appearance-none block w-full text-black border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                                type="text"
                                                placeholder="Store name"
                                            />
                                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                                        </div>
                                        <div className="w-1/2 px-3 mb-6 md:mb-0">
                                            <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2">name</label>
                                            <input
                                                {...register("slug", { required: "The slug field is required." })}
                                                className="appearance-none block w-full text-black border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                                type="text"
                                                placeholder="Slug"
                                            />
                                            {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
                                        </div>
                                    </div>

                                    {/* status */}
                                    <div className="flex flex-wrap -mx-3 mb-6">
                                        <div className="w-full px-3 mb-6">
                                            <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2">Status</label>
                                            <div className="relative">
                                                <select
                                                    {...register("status", { required: "Please select a status." })}
                                                    className="block appearance-none w-full border border-gray-200 text-black py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                >
                                                    <option value="">Select a Status</option>
                                                    <option value="1">Active</option>
                                                    <option value="0">Block</option>
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
                                            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
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
                                                  
                                                    // onChange={uploadTempImages}
                                                    className="hidden"
                                                />
                                            </label>

                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                                                {previewImages.map((img, index) => (
                                                    <div key={index} className="relative group rounded-xl overflow-hidden shadow-md">
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
                                                            <FontAwesomeIcon icon={faCircleXmark} className="text-red-500 text-lg" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <button type="submit"
                                        className='rounded-md bg-[#007595] py-2 px-6 mt-2 text-white hover:bg-[#005f66]'>
                                        Submit
                                    </button>
                                </form >
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </div>
    )
}

export default Store