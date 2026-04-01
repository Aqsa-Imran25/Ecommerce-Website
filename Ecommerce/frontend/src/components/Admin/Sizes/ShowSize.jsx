import React, { useEffect, useState } from 'react';
import AdminSample from '../../common/AdminSample'
import Loader from '../../common/Loader';
import Empty from '../../common/Empty';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons'; // The solid style icon
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { adminToken, apiUrl } from '../../common/Http';

function ShowSize() {
      const [sizes, setsizes] = useState([])
        const [loader, setLoader] = useState(false)
        // deleteCategory
    
        const deleteCategory = async (id) => {
            if (!window.confirm("Are you sure you want to delete this size?")) return;
    
            const res = await fetch(`${apiUrl}/sizes/${id}`, {
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
                setsizes(prevsizes => prevsizes.filter(sizes => sizes.id !== id));
    
            } else {
                console.log("Something went wrong!")
            }
        }
    
        const fetchSizeApi = async () => {
            setLoader(true)
            const res = await fetch(`${apiUrl}/sizes`, {
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
    
                setsizes(result.data)
    
            } else {
                console.log("Something went wrong!")
            }
    
    
        }
    
        useEffect(() => {
            fetchSizeApi()
        }, [])
  return (
     <>
            <AdminSample title='Product-Sizes' btnText='Create' to='/admin/sizes/create'>

                <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base">
                    {
                        loader == true && <Loader />
                    }{
                        loader == false && sizes.length == 0 && <Empty text='sizes Are Empty!' />
                    }
                    {
                        sizes && sizes.length > 0 &&

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
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    sizes.map((size,index) => (

                                        <tr key={index} className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-gray-300">
                                            <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                                                {size.id}
                                            </th>
                                            <td className="px-6 py-4">
                                                {size.name}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex gap-4">
    
                                                    <Link to={`/admin/size/${size.id}/edit`} className="font-medium text-fg-size hover:underline text-blue-600">
                                                        <FontAwesomeIcon icon={faPencil} />
                                                    </Link>
                                                    <Link
                                                        onClick={() => deleteCategory(size.id)}
                                                        to="#" className="font-medium text-fg-size hover:underline text-red-600">
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

export default ShowSize