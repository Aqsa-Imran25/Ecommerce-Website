import React, { useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import Sidebar from '../../common/Sidebar'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { adminToken, apiUrl, getAuthToken, getUserRole } from '../../common/Http';
import Loader from '../../common/Loader';
import Empty from '../../common/Empty';
import Pagination from '../../Pagination';

function ShowOrder() {
    const [orders, setOrders] = useState([])
    const [loader, setLoader] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const token = getAuthToken();
    const role = getUserRole();

    const fetchOrders = async (page = 1) => {
        setLoader(true)
        const res = await fetch(`${apiUrl}/orders?page=${page}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`

            },
        })
        setLoader(false)
        const result = await res.json();

        console.log("API Show Result:", result);
        console.log("Token-Show:", token);
        if (result.status == 200) {

            setOrders(result.data)

        } else {
            console.log("Something went wrong!")
            toast.error(result.error)
        }


    }

    useEffect(() => {
        fetchOrders(currentPage);
    }, [currentPage])

    return (
        <div >
            <Layout>
                <div className='md:container md:mx-auto px-6 py-5 my-5'>
                    <div className='flex justify-between my-4'>
                        <h2 className='my-2 text-base md:text-2xl'>Orders</h2>
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
                                        !loader && (!orders?.data || orders.data.length === 0) && <Empty text="Orders Not Found!" />}
                                    {
                                        orders?.data && orders.data.length > 0 &&
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
                                                            Total Amount
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 font-medium text-center">
                                                            Date
                                                        </th>

                                                        <th scope="col" className="px-6 py-3 font-medium text-center">
                                                            Status
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        orders.data.map((order, index) => (

                                                            <tr
                                                                key={index}
                                                                className="odd:bg-neutral-primary even:bg-neutral-secondary-soft hover:bg-gray-100  transition"
                                                            >
                                                                <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                                                                    <Link to={`/orders/${order.id}`}>
                                                                        {index + 1}
                                                                    </Link>
                                                                </th>
                                                                <td className="px-6 py-4">
                                                                    {order.user?.name}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    {order.user?.email}
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
                                                            </tr>
                                                        ))
                                                    }

                                                </tbody>
                                            </table>
                                        </div>
                                    }
                                </div>

                            </div>
                            {
                                orders?.data && orders.data.length > 0 &&
                                <div className='flex justify-end items-end'>
                                    <Pagination
                                        currentPage={orders.current_page}
                                        lastPage={orders.last_page}
                                        onPageChange={(page) => setCurrentPage(page)}
                                    />
                                </div>
                            }

                        </div>
                    </div>
                </div>
            </Layout>
        </div>
    )
}

export default ShowOrder