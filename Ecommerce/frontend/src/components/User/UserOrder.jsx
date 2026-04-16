import React, { useEffect, useState } from 'react'
import Layout from '../common/Layout'
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Empty from '../common/Empty';
import Loader from '../common/Loader';
import { apiUrl, getAuthToken, getUserRole, UserToken } from '../common/Http';
import Sidebar from '../common/Sidebar';

function UserOrder() {
    const [order, setOrder] = useState([])
    const [loader, setLoader] = useState(false)
    // roles
    const role = getUserRole();
    // token
    const token = getAuthToken();

    const fetchorder = async () => {
        setLoader(true)
        const res = await fetch(`${apiUrl}/order`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`

            },
        })
        setLoader(false)
        const result = await res.json();

        console.log("API Show Result:", result.data);
        console.log("Token-Show:", token);
        if (result.status == 200) {

            setOrder(result.data)

            console.log("User", result.data);

        } else {
            console.log("Something went wrong!")
            toast.error(result.error)
        }
    }

    useEffect(() => {
        fetchorder();
    }, [])
    return (
        <div >
            <Layout>
                <div className='md:container md:mx-auto px-6 py-5 my-5'>
                    <div className="mb-6">
                        <h5 className="text-sm md:text-2xl font-bold text-gray-800">
                            My Order
                        </h5>
                        <p className="text-gray-500 text-sm mt-1">
                            Check the status of your recent purchases.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="w-full md:w-1/4">
                            <Sidebar role={role} />
                        </div>
                        <div className="w-full md:w-3/4">
                            <div className="shadow-lg border-2 border-gray-200 p-4 rounded-lg">
                                <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base">

                                    {
                                        loader == true && <Loader />
                                    }{
                                        loader == false && order.length == 0 && <Empty text='Order Are Empty !' />
                                    }
                                    {
                                        order && order.length > 0 &&
                                        <div>

                                            <table className="w-full text-sm text-left rtl:text-right text-body">
                                                <thead className="bg-neutral-secondary-soft border-b border-gray-300">
                                                    <tr
                                                        className="odd:bg-neutral-primary even:bg-neutral-secondary-soft hover:bg-gray-100 transition"
                                                    >
                                                        <th scope="col" className="px-6 py-3 font-medium">
                                                            #
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 font-medium">
                                                            Customer
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 font-medium">
                                                            Email
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 font-medium text-center">
                                                            Item
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 font-medium text-center">
                                                            Total
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 font-medium text-center">
                                                            Date
                                                        </th>
                                                
                                                        <th scope="col" className="px-6 py-3 font-medium text-center">
                                                            Status
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 font-medium text-center">
                                                            Order-Confirmation
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        order.map((order, index) => (

                                                            <tr
                                                                key={index}
                                                                className="odd:bg-neutral-primary even:bg-neutral-secondary-soft hover:bg-gray-100  transition"
                                                            >
                                                                <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                                                                    <Link to={`/myorder/${order.id}`}
                                                                    >
                                                                        {order.id}
                                                                    </Link>
                                                                </th>
                                                                <td className="px-6 py-4">
                                                                    {order.user?.name}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    {order.user?.email}
                                                                </td>

                                                                <td className="px-6 py-4">

                                                                    <img src={order?.items?.[0]?.product?.image_url} width={50} alt="Product" />
                                                                </td>

                                                                <td className="px-6 py-4">
                                                                    RS {order.grand_total}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    {new Date(order.created_at).toISOString().split("T")[0]}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    {order.status == 'pending'
                                                                        &&
                                                                        <span className='text-white bg-yellow-400 hover:bg-yellow-300 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-full text-sm px-4 py-2 text-center leading-5'>Pending</span>
                                                                    }
                                                                    {order.status == 'delivered'
                                                                        &&
                                                                        <span className='text-white bg-green-700 hover:bg-green-300 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-full text-sm px-4 py-2 text-center leading-5'>Delivered</span>
                                                                    }
                                                                    {order.status == 'shipped'
                                                                        &&
                                                                        <span className='text-white bg-red-700 hover:bg-red-300 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-full text-sm px-4 py-2 text-center leading-5'>Shipped</span>
                                                                    }
                                                                    {order.status == 'cancelled'
                                                                        &&
                                                                        <span className='text-white bg-gray-700 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-full text-sm px-4 py-2 text-center leading-5'>Cancelled</span>
                                                                    }
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <span className='text-red-500 text-sm'>

                                                                        <Link
                                                                            className='text-sm'
                                                                            to={`/order/confirmation/${order.id}`}>
                                                                            Confirm Order
                                                                        </Link>

                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }

                                                </tbody>
                                            </table>
                                        </div>
                                    }
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </div>
    )
}

export default UserOrder