import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { toast } from 'react-toastify';
import { adminToken, apiUrl, getAuthToken } from '../../common/Http';
import { useNavigate, useParams } from 'react-router';
import Sample from '../../common/Sample'
import AdminSample from '../../common/AdminSample';

function EditPayment() {

    const [disable, setDisable] = useState(false)
    const [stores, setStore] = useState([])

    const navigate = useNavigate()
    const params = useParams()

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // ✅ FETCH PAYMENT DATA
    useEffect(() => {
        const fetchApi = async () => {
            setDisable(true)

            const res = await fetch(`${apiUrl}/admin/payment-settings/${params.id}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${adminToken()}`
                },
            })

            const result = await res.json()
            setDisable(false)

            if (result.status == 200) {
                reset({
                    commission: result.data.commission,
                    currency: result.data.currency,
                    store_id: result.data.store_id,
                    cod_enabled: result.data.cod_enabled == 1
                })
            } else {
                toast.error("Failed to load data")
            }
        }

        fetchApi()
    }, [])

    // ✅ FETCH STORES
    const fetchStore = async () => {
        try {
            const res = await fetch(`${apiUrl}/admin/stores`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${getAuthToken()}`
                },
            });

            const result = await res.json();
            if (result.status === 200) setStore(result.data);

        } catch (error) {
            toast.error("Store fetch error");
        }
    };

    useEffect(() => {
        fetchStore()
    }, [])

    // ✅ UPDATE PAYMENT
    const updatePayment = async (data) => {

        const payload = {
            cod_enabled: data.cod_enabled ? 1 : 0,
            commission: data.commission,
            currency: data.currency,
            store_id: data.store_id || null
        }

        setDisable(true)

        const res = await fetch(`${apiUrl}/admin/payment-settings/${params.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${adminToken()}`
            },
            body: JSON.stringify(payload)
        })

        const result = await res.json()
        setDisable(false)

        if (result.status == 200) {
            toast.success(result.message)
            navigate('/admin/payments')
        } else {
            toast.error(result.message || "Update failed")
        }
    }

    return (
        <>
            <AdminSample title='Edit Payment' btnText='Back' to='/admin/payments'>

                <form onSubmit={handleSubmit(updatePayment)}>

                    {/* COD */}
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3 mb-6 md:mb-0">
                            <label className="block uppercase text-xs font-bold mb-2">
                                Cod
                            </label>

                            <input
                                type="checkbox"
                                {...register("cod_enabled")}
                                className="mr-2"
                            />
                            Enable COD
                        </div>
                    </div>

                    {/* COMMISSION */}
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3 mb-6">
                            <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2">
                                Commission
                            </label>

                            <input
                                {...register("commission", { required: "Commission required" })}
                                className="appearance-none block w-full text-black border border-gray-200 rounded py-3 px-4 mb-3"
                                type="number"
                            />

                            {errors.commission &&
                                <p className="text-red-500 text-sm">{errors.commission.message}</p>
                            }
                        </div>
                    </div>

                    {/* CURRENCY */}
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3 mb-6">
                            <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2">
                                Currency
                            </label>


                            <select
                                {...register("currency", { required: "Currency required" })}
                                className="appearance-none block w-full text-black border border-gray-200 rounded py-3 px-4 mb-3"
                            >
                                <option value="">Select Currency</option>
                                <option value="PKR">PKR</option>
                                <option value="USD">USD</option>
                                <option value="SAR">SAR</option>
                            </select>

                            {errors.currency &&
                                <p className="text-red-500 text-sm">{errors.currency.message}</p>
                            }
                        </div>
                    </div>

                    {/* STORE */}
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3 mb-6">
                            <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2">
                                Store
                            </label>

                            <select
                                {...register("store_id")}
                                className="appearance-none block w-full text-black border border-gray-200 rounded py-3 px-4 mb-3"
                            >
                                <option value="">Select Store</option>
                                {stores.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        disabled={disable}
                        className='rounded-md bg-[#007595] py-2 px-6 mt-2 text-white hover:bg-[#005f66]'
                    >
                        Update
                    </button>

                </form>
            </AdminSample>
        </>
    )
}

export default EditPayment