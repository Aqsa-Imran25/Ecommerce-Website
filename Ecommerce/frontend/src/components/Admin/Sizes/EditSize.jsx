import React, { useEffect, useState } from 'react'
import Sample from '../../common/Sample'
import { useForm } from "react-hook-form"
import { toast } from 'react-toastify';
import { adminToken, apiUrl } from '../../common/Http';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';

function EditSize() {
    const [disable, setDisable] = useState(false)
    const navigate = useNavigate()
    const { id } = useParams();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();


    // get data from db using show url
    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await fetch(`${apiUrl}/sizes/${id}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        "Accept": "application/json",
                        "Authorization": `Bearer ${adminToken()}`

                    },

                })
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                setDisable(false)
                const result = await res.json();

                if (result.status == 200) {
                    console.log("Result=", result)
                    reset({
                        name: result.data.name,

                    })
                }
            }
            catch (error) {
                console.error("Fetch error:", error);
                toast.error("Something Went Wrong!")
            }
        }
        fetchApi();
    }, [id])

    // updateSize
    const updateSize = async (data) => {
        console.log(data)
        try {

            const res = await fetch(`${apiUrl}/sizes/${id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "application/json",
                    "Authorization": `Bearer ${adminToken()}`

                },
                body: JSON.stringify(data)

            })
            if (!res.ok) {
                console.log(res)
                throw new Error('Network response was not ok');
            }
            setDisable(false)
            const result = await res.json();
            console.log("API Show Result:", result.data);

            if (result.status == 200) {
                navigate('/admin/sizes')
                toast.success(result.message)
            }
        }
        catch (error) {
            console.error("Error:", error);
            toast.error("Something Went Wrong!")

        }
    }
    return (
        <>
            <Sample title='Size-Edit' btnText='Back' to='/admin/sizes'>

                <form onSubmit={handleSubmit(updateSize)}>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="grid-first-name">
                                Name
                            </label>
                            <input
                                {
                                ...register("name",
                                    {
                                        required: "The name field is required.",
                                    })}
                                className="appearance-none block w-full bg-gray-200 text-black border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>
                    </div>
                    <button disabled={disable}
                        className='rounded-md bg-[#007595] py-2 px-6 mt-2 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
                    >Update</button>
                </form>
            </Sample>
        </>
    )
}

export default EditSize