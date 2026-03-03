import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiUrl, UserToken } from '../common/Http';
import Layout from '../common/Layout';
import Sidebar from './Sidebar';

function Profile() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [disable, setDisable] = useState(false)
    const navigate = useNavigate()

    const saveProfile = async (data) => {
        console.log(data)
        setDisable(true)
        const res = await fetch(`${apiUrl}/myaccount`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json",
                "Authorization": `Bearer ${UserToken()}`

            },
            body: JSON.stringify(data)

        })
        setDisable(false)
        const result = await res.json();

        console.log("API Show Result:", result.data);

        if (result && result.status === 200) {
            console.log(result.data)
            toast.success(result.message)
            navigate('/myaccount')
        } else {
            console.log("Something went wrong!")
        }
    }
    // fetchuserInfo
    const fetchUserData = async () => {
        try {
            const res = await fetch(`${apiUrl}/getUser`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "application/json",
                    Authorization: `Bearer ${UserToken()}`
                },
            });

            const result = await res.json();

            if (result.status === 200 && result.data) {
                setValue("name", result.data.name)
                setValue("email", result.data.email)
            }

        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Something Went Wrong!");
        }
    };

    // fetchprofile data
    const fetchProfileData = async () => {
        try {
            const res = await fetch(`${apiUrl}/myaccount`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "application/json",
                    Authorization: `Bearer ${UserToken()}`
                },
            });

            const result = await res.json();

            if (result.status === 200 && result.data) {

                setValue("phone_num", result.data.phone_num)
                setValue("city", result.data.city)
                setValue("state", result.data.state)
                setValue("zip", result.data.zip)
            }

        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Something Went Wrong!");
        }
    };

    useEffect(() => {
        fetchUserData();
        fetchProfileData();
    }, []);


    return (
        <div >
            <Layout>
                <div className='md:container md:mx-auto px-6 py-5 my-5'>
                    <div className="mb-6">
                        <h5 className="text-sm md:text-2xl font-bold text-gray-800">
                            My Account
                        </h5>
                        <p className="text-gray-500 text-sm mt-1">
                            Manage your profile information
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="w-full md:w-1/4">
                            <Sidebar />
                        </div>
                        <div className="w-full md:w-3/4">
                            <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8">
                                <form
                                    className="space-y-8"
                                    onSubmit={handleSubmit(saveProfile)}
                                >

                                    {/* Name & Email */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-gray-700">
                                                Full Name
                                            </label>
                                            <input
                                                {...register("name", { required: "Name required" })}
                                                type="text"
                                                placeholder="Enter your name"
                                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#007595] transition"
                                            />
                                            {errors.name && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.name.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-gray-700">
                                                Email Address
                                            </label>
                                            <input
                                                {...register("email", { required: "Email required" })}
                                                type="email"
                                                placeholder="Enter your email"
                                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#007595] transition"
                                            />
                                            {errors.email && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.email.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                                            Mobile Number
                                        </label>
                                        <input
                                            {...register("phone_num", {
                                                required: "Phone number required",
                                            })}
                                            type="text"
                                            placeholder="03XXXXXXXXX"
                                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#007595] transition"
                                        />
                                        {errors.phone_num && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.phone_num.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Address Section */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-gray-700">
                                                City
                                            </label>
                                            <input
                                                {...register("city", { required: "City required" })}
                                                type="text"
                                                placeholder="Rawalpindi"
                                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#007595] transition"
                                            />
                                            {errors.city && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.city.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-gray-700">
                                                State
                                            </label>
                                            <input
                                                {...register("state", { required: "State required" })}
                                                type="text"
                                                placeholder="Punjab"
                                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#007595] transition"
                                            />
                                            {errors.state && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.state.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-gray-700">
                                                Zip Code
                                            </label>
                                            <input
                                                {...register("zip", { required: "Zip required" })}
                                                type="text"
                                                placeholder="46000"
                                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#007595] transition"
                                            />
                                            {errors.zip && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.zip.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={disable}
                                            className={`w-full sm:w-auto px-8 py-3 rounded-xl text-white font-semibold transition duration-300 ${disable
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-[#007595] hover:bg-gray-900"
                                                }`}
                                        >
                                            {disable ? "Updating..." : "Update Profile"}
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </div>
    )
}

export default Profile