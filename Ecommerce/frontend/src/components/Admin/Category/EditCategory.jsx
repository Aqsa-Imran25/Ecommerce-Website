import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { toast } from 'react-toastify';
import { adminToken, apiUrl } from '../../common/Http';
import { useNavigate, useParams } from 'react-router';
import Sample from '../../common/Sample'


function EditCategory() {
    const [disable, setDisable] = useState(false)
    const navigate = useNavigate()
    const params = useParams()

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        const fetchApi = async () => {
            console.log()
            setDisable(true)
            const res = await fetch(`${apiUrl}/admin/categories/${params.id}`, {
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
        const res = await fetch(`${apiUrl}/admin/categories/${params.id}`, {
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
            <Sample title='Edit-Category' btnText='Back' to='/admin/categories'>

                <form onSubmit={handleSubmit(updateCategory)}>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3 mb-6 md:mb-0">
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
                    <button
                        className='rounded-md bg-[#007595] py-2 px-6 mt-2 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
                    >Update</button>
                </form>
            </Sample>
        </>
    )
}

export default EditCategory