
import React, { useEffect, useState } from 'react';
import Sample from '../../common/Sample'
import Loader from '../../common/Loader';
import Empty from '../../common/Empty';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons'; // The solid style icon
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { adminToken, apiUrl } from '../../common/Http';

function ShowStore() {
    const [stores, setStores] = useState([])
    const [loader, setLoader] = useState(false)
    // deleteStore

    const deleteStore = async (id) => {
        if (!window.confirm("Are you sure you want to delete this store?")) return;

        const res = await fetch(`${apiUrl}/admin/stores/${id}`, {
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
            setStores(prevstores => prevstores.filter(stores => stores.id !== id));

        } else {
            console.log("Something went wrong!")
        }
    }

    const fetchStoreApi = async () => {
        setLoader(true)
        const res = await fetch(`${apiUrl}/admin/stores`, {
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

            setStores(result.data)

        } else {
            console.log("Something went wrong!")
        }


    }

    useEffect(() => {
        fetchStoreApi()
    }, [])
    return (
        <>
            <Sample title='stores' btnText='Create' to='/admin/stores/create'>

                <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base">
                    {
                        loader == true && <Loader />
                    }{
                        loader == false && stores.length == 0 && <Empty text='stores Are Empty!' />
                    }
                    {
                        stores && stores.length > 0 &&

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
                                        Slug
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-medium">
                                        Image
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
                                    stores.map((store, index) => (

                                        <tr key={index} className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-gray-300">
                                            <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                                                {store.id}
                                            </th>
                                            <td className="px-6 py-4">
                                                {store.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {store.slug}
                                            </td>
                                            <td className="px-6 py-4">
                                                <img
                                                    src={store.logo
                                                    }
                                                    width={50}
                                                    alt="Product"
                                                />

                                            </td>
                                            <td className="px-6 py-4">
                                                {store.status == 1 ?
                                                    <span className='text-white bg-green-700 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-full text-sm px-4 py-2 text-center leading-5'>Active</span>
                                                    :
                                                    <span className='text-white bg-red-500 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-full text-sm px-4 py-2 text-center leading-5'>Block</span>
                                                }
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex justify-around">
                                                    <Link to={`/admin/stores/${store.id}/edit`} className="font-medium text-fg-store hover:underline text-blue-600">
                                                        <FontAwesomeIcon icon={faPencil} />
                                                    </Link>
                                                    <Link
                                                        onClick={() => deleteStore(store.id)}
                                                        to="#" className="font-medium text-fg-store hover:underline text-red-600">
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
            </Sample>
        </>
    )
}

export default ShowStore