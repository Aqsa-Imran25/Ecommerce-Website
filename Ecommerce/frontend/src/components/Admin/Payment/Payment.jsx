import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { adminToken, apiUrl, getAuthToken } from '../../common/Http';
import { useNavigate } from 'react-router';
import AdminSample from '../../common/AdminSample';

function Payment() {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [stores, setStore] = useState([]);

    const savePayment = async (data) => {
        console.log(data);

        try {
            const payload = {
                cod_enabled: data.cod_enabled ? 1 : 0,
                commission: data.commission,
                currency: data.currency, // REQUIRED
                store_id: data.store_id || null
            };

            const res = await fetch(`${apiUrl}/admin/payment-settings`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${adminToken()}`,
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            if (res.ok) {
                toast.success(result.message);
                navigate("/admin/payments");
            }
            else if (res.status === 422 && result.errors) {
                Object.values(result.errors).forEach(arr => {
                    arr.forEach(msg => toast.error(msg));
                });
            }
            else {
                toast.error(result.message || "Something went wrong");
            }

        } catch (error) {
            console.error("Unexpected Error:", error);
            toast.error("Server Error");
        }
    }
    // stores fetch
    const fetchStore = async () => {
        try {
            const token = getAuthToken();
            const res = await fetch(`${apiUrl}/admin/stores`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            const result = await res.json();
            console.log("Stores", result)
            if (result.status === 200) setStore(result.data);
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Something Went Wrong!");
        }
    };

    useEffect(() => {
        fetchStore();

    }, []);

    return (
        <>
            <AdminSample title='Payment-Create' btnText='Back' to='/admin/payments'>
                <form onSubmit={handleSubmit(savePayment)}>

                    {/* cod_enabled (FIX: checkbox instead of text) */}
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2">
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

                    {/* commission */}
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

                                {/* MOST COMMON */}
                                <option value="PKR">PKR - Pakistani Rupee</option>
                                <option value="USD">USD - US Dollar</option>
                                <option value="SAR">SAR - Saudi Riyal</option>

                            </select>

                            {errors.currency && (
                                <p className="text-red-500 text-sm">{errors.currency.message}</p>
                            )}
                        </div>
                    </div>

                    {/* store-id */}
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3 mb-6">
                            <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2">Stores</label>

                            <div className='relative'>
                                <select {...register("store_id", { required: "Please select a store." })}
                                    className="block appearance-none w-full border border-gray-200 text-black py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                                    <option value="">Select a Store</option>
                                    {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
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
                            {errors.store_id && <p className="text-red-500 text-sm">{errors.store_id.message}</p>}
                        </div>


                    </div>

                    <button
                        type="submit"
                        className='rounded-md bg-[#007595] py-2 px-6 mt-2 text-white hover:bg-[#005f66]'
                    >
                        Submit
                    </button>

                </form>
            </AdminSample>
        </>
    );
}

export default Payment;