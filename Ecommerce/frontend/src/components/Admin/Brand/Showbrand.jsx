
import React, { useEffect, useState } from 'react';
import Loader from '../../common/Loader';
import Empty from '../../common/Empty';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons'; // The solid style icon
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { adminToken, apiUrl } from '../../common/Http';
import Sample from '../../common/Sample';
import AdminSample from '../../common/AdminSample';

function Showbrand() {
    const [brands, setBrands] = useState([])
    const [loader, setLoader] = useState(false)
    // deleteCategory

    const deleteCategory = async (id) => {
        if (!window.confirm("Are you sure you want to delete this brand?")) return;

        const res = await fetch(`${apiUrl}/admin/brands/${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json",
                "Authorization": `Bearer ${adminToken()}`
            },
        })
        const result = await res.json();
        console.log("API Show Result:", result.data);
        if (result.status == 200) {
            toast.success(result.message)
            setBrands(prevBrands => prevBrands.filter(brands => brands.id !== id));

        } else {
            console.log("Something went wrong!")
        }
    }

    const fetchBrandApi = async () => {
        setLoader(true)
        const res = await fetch(`${apiUrl}/admin/brands`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json",
                "Authorization": `Bearer ${adminToken()}`

            },
        })
        setLoader(false)
        const result = await res.json();

        console.log("API Show Result:", result.data);
        console.log("Token-Show:", adminToken());
        if (result.status == 200) {

            setBrands(result.data)

        } else {
            console.log("Something went wrong!")
        }


    }

    useEffect(() => {
        fetchBrandApi()
    }, [])
    return (
        <>
            <AdminSample title='Brands' btnText='Create' to='/admin/brands/create'>

                <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base">
                    {
                        loader == true && <Loader />
                    }{
                        loader == false && brands.length == 0 && <Empty text='Brands Are Empty!' />
                    }
                    {
                        brands && brands.length > 0 &&

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
                                    brands.map((brand,index) => (

                                        <tr key={index} className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-gray-300">
                                            <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                                                {brand.id}
                                            </th>
                                            <td className="px-6 py-4">
                                                {brand.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {brand.status == 1 ?
                                                    <span className='text-white bg-green-700 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-full text-sm px-4 py-2 text-center leading-5'>Active</span>
                                                    :
                                                    <span className='text-white bg-red-500 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-full text-sm px-4 py-2 text-center leading-5'>Block</span>
                                                }
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex justify-around">
                                                    <Link to={`/admin/brands/${brand.id}/edit`} className="font-medium text-fg-brand hover:underline text-blue-600">
                                                        <FontAwesomeIcon icon={faPencil} />
                                                    </Link>
                                                    <Link
                                                        onClick={() => deleteCategory(brand.id)}
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
            </AdminSample>
        </>
    )
}

export default Showbrand