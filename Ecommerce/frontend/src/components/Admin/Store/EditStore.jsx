import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { toast } from 'react-toastify';
import { adminToken, apiUrl, vendorToken } from '../../common/Http';
import { useNavigate, useParams } from 'react-router';
import Sample from '../../common/Sample'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'; // Specific icon import



function EditStore({ mode }) {
    const [disable, setDisable] = useState(false)
    const navigate = useNavigate()
    const params = useParams()
    // oldimages in db
    const [oldImages, setOldImages] = useState(null);
    // new-image create
    const [newImages, setNewImages] = useState([]);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        const fetchStoreApi = async () => {
            setDisable(true)

            const res = await fetch(`${apiUrl}/vendor/store/${params.id}/edit`, {
                headers: {
                    "Authorization": `Bearer ${vendorToken()}`
                },
            });

            const result = await res.json();
            setDisable(false)

            if (result.status === 200) {
                const store = result.data;

                reset({
                    name: store.name,
                    slug: store.slug,
                });

                setOldImages(store.logo);
            }
        };

        fetchStoreApi();
    }, []);
    // deleteImage
    const deleteImage = async () => {
        try {
            const res = await fetch(`${apiUrl}/store-delete/${params.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${vendorToken()}`
                },
            });

            const result = await res.json();

            if (result.status === 200) {
                setOldImages(null);
                toast.success(result.message);
            }

        } catch (error) {
            console.error(error);
            toast.error("Delete failed");
        }
    };


    const updateStore = async (data) => {
        setDisable(true);

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("_method", "PUT");

        if (newImages.length > 0) {
            formData.append("logo", newImages[0].file);
        }

        try {
            const res = await fetch(`${apiUrl}/vendor/store/${params.id}`, {
                method: "POST",
                headers: {
                       "Accept": "application/json",
                    "Authorization": `Bearer ${vendorToken()}`
                },
                body: formData
            });

            const text = await res.text();
            console.log("RAW RESPONSE:", text);

            let result;
            try {
                result = JSON.parse(text);
            } catch {
                toast.error("Server error (not JSON)");
                return;
            }

            if (result.status === 200) {
                toast.success(result.message);
                navigate('/vendor/stores');
            } else {
                console.log(result);
                toast.error("Update failed");
            }

        } catch (error) {
            console.error(error);
            toast.error("Request failed");
        }

        setDisable(false);
    };
    return (
        <>
            <Sample title='Edit-Store' btnText='Back' to='/vendor/stores'>

                <form onSubmit={handleSubmit(updateStore)}>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-1/2 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="grid-first-name">
                                Name
                            </label>
                            <input name='name'
                                {
                                ...register("name",
                                    {
                                        required: "The name field is required.",
                                    })}
                                className="appearance-none block w-full bg-gray-200 text-black border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>
                        <div className="w-1/2 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="grid-first-name">
                                Slug
                            </label>
                            <input name='slug'
                                {
                                ...register("slug",
                                    {
                                        required: "The name field is required.",
                                    })}
                                className="appearance-none block w-full bg-gray-200 text-black border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>
                    </div>
                    {/* Images */}
                    {
                        mode === "vendor" &&

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-3 text-gray-700">Logo</h3>

                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-400 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition">
                                <span className="text-gray-600 text-sm font-medium">Choose Files</span>
                                <span className="text-gray-500 text-xs mt-1">or drag and drop images here</span>
                                <input
                                    type="file"
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files);
                                        const preview = files.map(file => ({
                                            file,
                                            preview: URL.createObjectURL(file)
                                        }));
                                        setNewImages(prev => [...prev, ...preview]);
                                    }}
                                    className="hidden"
                                />
                            </label>

                            {/* Existing Images */}

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                                {oldImages && (
                                    <div className="relative">
                                        <img
                                            src={`http://backend.test/storage/logo-image/${oldImages}`}
                                            className="w-full h-32 object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={deleteImage}
                                            className="absolute top-2 right-2 bg-white p-1"
                                        >
                                            <FontAwesomeIcon icon={faCircleXmark} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* New Images */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                                {newImages.map((img, index) => (
                                    <div key={index} className="relative">
                                        <img src={img.preview} className="w-full h-32 object-cover" />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setNewImages(prev => prev.filter((_, i) => i !== index))
                                            }
                                        >
                                            <FontAwesomeIcon icon={faCircleXmark} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                    <button
                        className='rounded-md bg-[#007595] py-2 px-6 mt-2 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
                    >Update</button>
                </form>
            </Sample>
        </>
    )
}

export default EditStore