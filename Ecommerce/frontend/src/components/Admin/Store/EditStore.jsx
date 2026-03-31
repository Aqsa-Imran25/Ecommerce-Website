import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { toast } from 'react-toastify';
import { adminToken, apiUrl } from '../../common/Http';
import { useNavigate, useParams } from 'react-router';
import Sample from '../../common/Sample'


function EditStore() {
    const [disable, setDisable] = useState(false)
    const navigate = useNavigate()
    const params = useParams()
      const [newImages, setNewImages] = useState([]);
      const [oldImages, setOldImages] = useState([]);
    

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        const fetchApi = async () => {
            console.log()
            setDisable(true)
            const res = await fetch(`${apiUrl}/admin/stores${params.id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "application/json",
                    "Authorization": `Bearer ${adminToken()}`

                },

            })
            setDisable(false)
            const result = await res.json();

            console.log("API Show Result:", result.data);

            if (result.status == 200) {
                reset({
                    name: result.data.name,
                    status: result.data.status,
                })
                toast.success(result.message)

            } else {
                console.log("Something went wrong!")
            }
        }
        fetchApi()
    }, [])

    const updateCategory = async (data) => {
        console.log(data)
        setDisable(true)
        const res = await fetch(`${apiUrl}/admin/stores/${params.id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json",
                "Authorization": `Bearer ${adminToken()}`

            }, body: JSON.stringify(data)


        })
        setDisable(false)
        const result = await res.json();

        console.log("API Show Result:", result.data);

        if (result.status == 200) {

            toast.success(result.message)
            navigate('/admin/categories')
        } else {
            console.log("Something went wrong!")
        }
    }
    return (
        <>
            <Sample title='Edit/Store' btnText='Back' to='/admin/stores'>

                <form onSubmit={handleSubmit(updateCategory)}>
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

                    <div className="flex flex-wrap -mx-3 mb-2">

                        <div className="w-full px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="grid-state">
                                Status
                            </label>

                            <div className="relative">
                                <select
                                    {
                                    ...register("status",
                                        {
                                            required: "Please Choose Atleast One Option.",
                                        })}
                                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-black py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                                    <option value="">Select Status</option>
                                    <option value="1">Active</option>
                                    <option value="0">Block</option>
                                </select>
                                {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-3 text-gray-700">Product Images</h3>

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
                            {oldImages.map((img) => (
                                <div className='w-full' key={img.id}>
                                    <div className="relative group rounded-xl shadow-md">
                                        <img src={`http://backend.test/storage/product/${img.name}`}
                                            alt="old"
                                            className="w-full h-32 object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => deleteImage('old', img.id)}
                                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                                        >
                                            <FontAwesomeIcon icon={faCircleXmark} className="text-red-500 text-lg" />
                                        </button>
                                    </div>

                                </div>
                            ))}
                        </div>

                        {/* New Images */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                            {newImages.map((img, index) => (
                                <div className='w-full'>
                                    <div key={index} className="relative group rounded-xl overflow-hidden shadow-md">
                                        <div>
                                            <img
                                                src={img.preview}
                                                alt="new"
                                                className="w-full h-32 object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => deleteImage('new', img.id)}
                                                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                                            >
                                                <FontAwesomeIcon icon={faCircleXmark} className="text-red-500 text-lg" />
                                            </button>
                                        </div>
                                    </div>


                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        className='rounded-md bg-[#007595] py-2 px-6 mt-2 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
                    >Update</button>
                </form>
            </Sample>
        </>
    )
}

export default EditStore