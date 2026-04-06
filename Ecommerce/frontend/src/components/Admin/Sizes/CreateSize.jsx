import React, { useState } from 'react'
import { adminToken, apiUrl, getAdminVendorToken } from '../../common/Http';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import Sample from '../../common/Sample';
import { toast } from 'react-toastify';
import AdminSample from '../../common/AdminSample';

function CreateSize() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [disable, setDisable] = useState(false)
    const navigate = useNavigate()

    const saveSizes = async (data) => {
        setDisable(true)
        console.log(data)
        const res = await fetch(`${apiUrl}/sizes`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json",
                "Authorization": `Bearer ${getAdminVendorToken()}`

            },
            body: JSON.stringify(data)
        })
        setDisable(false)
        console.log("token",getAdminVendorToken());
        const result = await res.json();
        console.log("API Show Result:", result.data);
        if (result.status == 200) {
            toast.success(result.message)
            navigate('/admin/sizes')

        } else {
            console.log("Something went wrong!")
        }


    }
    return (
        <>
            <AdminSample title='Size-Create' btnText='Back' to='/admin/sizes'>

                <form onSubmit={handleSubmit(saveSizes)}>
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


                    <button
                        className='rounded-md bg-[#007595] py-2 px-6 mt-2 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
                    >Submit</button>
                </form>
            </AdminSample>
        </>
    )
}

export default CreateSize