import React, { useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import Sidebar from '../../common/Sidebar'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons'; // The solid style icon
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { adminToken, apiUrl, getAdminVendorToken, getAuthToken, getUserRole } from '../../common/Http';
import Loader from '../../common/Loader';
import Empty from '../../common/Empty';


function ShowCategory() {
    const [categories, setCategories] = useState([])
    const [loader, setLoader] = useState(false)
    const role=getUserRole();

    // deleteCategory

    const deleteCategory = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        const res = await fetch(`${apiUrl}/admin/categories/${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json",
                "Authorization": `Bearer ${getAdminVendorToken()}`
            },
        })
        const result = await res.json();
        console.log("API Show Result:", result.data);
        if (result.status == 200) {
            toast.success(result.message)
            setCategories(prevCategories => prevCategories.filter(cat => cat.id !== id));

        } else {
            console.log("Something went wrong!")
        }
    }
// show
    const categoryApi = async () => {
        setLoader(true)
        const res = await fetch(`${apiUrl}/admin/categories`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json",
                "Authorization": `Bearer ${getAdminVendorToken()}`

            },
        })
        setLoader(false)
        const result = await res.json();

        console.log("API Show Result:", result.data);
        console.log("Token-Show:", adminToken());
        if (result.status == 200) {

            setCategories(result.data)

        } else {
            console.log("Something went wrong!")
        }


    }

    useEffect(() => {
        categoryApi()
    }, [])

    return (
        <div >
            <Layout>
                <div className='md:container md:mx-auto px-6 py-5 my-5'>
                    <div className='flex justify-between my-4'>
                        <h2 className='my-2 text-base md:text-2xl'>Categories</h2>
                        <Link to="/admin/categories/create" className="bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow
                    hover:bg-[#007595] hover:text-white">
                            Create
                        </Link>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="w-full md:w-1/4">
                            <Sidebar role={role} />
                        </div>
                        <div className="w-full md:w-3/4">
                            <div className="shadow-lg border-2 border-gray-200 p-4">
                                <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base">
                                    {
                                        loader == true && <Loader />
                                    }{
                                        loader == false && categories.length == 0 && <Empty text='Categories Not Created Yet!' />
                                    }
                                    {
                                        categories && categories.length > 0 &&

                                        <table className="w-full text-sm text-left rtl:text-right text-body">
                                            <thead className="bg-neutral-secondary-soft border-b border-gray-300">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 font-medium">
                                                        Id
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 font-medium">
                                                        Name
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 font-medium">
                                                        Status
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 font-medium text-center">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    categories.map((category,index) => (

                                                        <tr key={index} className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-gray-300">
                                                            <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                                                                {category.id}
                                                            </th>
                                                            <td className="px-6 py-4">
                                                                {category.name}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {category.status == 1 ?
                                                                    <span className='text-white bg-green-700 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-full text-sm px-4 py-2 text-center leading-5'>Active</span>
                                                                    :
                                                                    <span className='text-white bg-red-500 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-full text-sm px-4 py-2 text-center leading-5'>Block</span>
                                                                }
                                                            </td>

                                                            <td className="px-6 py-4">
                                                                <div className="flex justify-around">
                                                                    <Link to={`/admin/categories/edit/${category.id}`} className="font-medium text-fg-brand hover:underline text-blue-600">
                                                                        <FontAwesomeIcon icon={faPencil} />
                                                                    </Link>
                                                                    <Link
                                                                        onClick={() => deleteCategory(category.id)}
                                                                        to="#" className="font-medium text-fg-brand hover:underline text-red-600">
                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                    </Link>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }

                                            </tbody>
                                        </table>
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

export default ShowCategory