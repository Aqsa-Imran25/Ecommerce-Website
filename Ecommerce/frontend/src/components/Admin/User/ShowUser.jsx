import React, { useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import { Link } from 'react-router'
import Sidebar from '../../common/Sidebar'
import Loader from '../../common/Loader'
import Empty from '../../common/Empty'
import { adminToken, apiUrl, getUserRole } from '../../common/Http'
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function ShowUser() {
  const [users, setUsers] = useState([])
  const [loader, setLoader] = useState(false)
  const role = getUserRole();
  const fetachUsers = async () => {
    setLoader(true)
    const res = await fetch(`${apiUrl}/admin/users`, {
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

      setUsers(result.data)

    } else {
      console.log("Something went wrong!")
    }


  }

  // deleteuser
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    const res = await fetch(`${apiUrl}/admin/users/${id}`, {
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
      setUsers(prev => prev.filter(user => user.id !== id));

    } else {
      console.log("Something went wrong!")
    }
  }

  useEffect(() => {
    fetachUsers()
  }, [])

  return (
    <div >
      <Layout>
        <div className='md:container md:mx-auto px-6 py-5 my-5'>
          <div className='flex justify-between my-4'>
            <h2 className='my-2 text-base md:text-2xl'>users</h2>
           
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
                    loader == false && users.length == 0 && <Empty text='users Not Created Yet!' />
                  }
                  {
                    users && users.length > 0 &&

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
                            Email
                          </th>
                          <th scope="col" className="px-6 py-3 font-medium text-center">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          users.map((user, index) => (

                            <tr key={index} className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-gray-300">
                              <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                                {user.id}
                              </th>
                              <td className="px-6 py-4">
                                {user.name}
                              </td>
                              <td className="px-6 py-4">
                                {user.email}
                              </td>

                              <td className="px-6 py-4">
                                <div className="flex justify-around">

                                  <Link
                                    onClick={() => deleteUser(user.id)}
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

export default ShowUser