import React, { useEffect, useState } from 'react'
import Sample from '../../common/Sample'
import { useForm } from "react-hook-form"
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { adminToken, apiUrl } from '../../common/Http';
import Sample2 from '../../common/Sample2';


function Shipping() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const navigate = useNavigate()

    // save-shipping
    const saveShipping = async (data) => {
        console.log(data)

        const res = await fetch(`${apiUrl}/admin/saveCharge`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json",
                "Authorization": `Bearer ${adminToken()}`

            },
            body: JSON.stringify(data)

        })

        const result = await res.json();

        console.log("API Show Result:", result.data);

        if (result.status == 200) {

            toast.success(result.message)
            reset({
                shipping_charge: result.data.shipping_charge,

            })
            navigate('/admin/shipping')
        } else {
            console.log("Something went wrong!")
        }
    }
    // getshipping
    useEffect(() => {
        const fetchApi = async () => {
            console.log()

            const res = await fetch(`${apiUrl}/admin/getCharge`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "application/json",
                    "Authorization": `Bearer ${adminToken()}`

                },

            })

            const result = await res.json();

            console.log("API Show Result:", result.data);

            if (result.status == 200) {
                reset({
                    shipping_charge: result.data.shipping_charge,
                })
               

            } else {
                console.log("Something went wrong!")
            }
        }
        fetchApi()
    }, [])

    return (
        <>
            <Sample2 title='Shipping-Cost'>

                <form onSubmit={handleSubmit(saveShipping)}>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="grid-first-name">
                                Shipping_Charge
                            </label>
                            <input name='shipping_charge'
                                {
                                ...register("shipping_charge",
                                    {
                                        required: "The shipping charge field is required.",
                                    })}
                                className="appearance-none block w-full bg-gray-200 text-black border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" />
                            {errors.shipping_charge && <p className="text-red-500 text-sm">{errors.shipping_charge.message}</p>}
                        </div>
                    </div>
                    <button
                        className='rounded-md bg-[#007595] py-2 px-6 mt-2 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
                    >Submit</button>
                </form>
            </Sample2>
        </>
    )
}

export default Shipping