import React, { useContext } from 'react'
import Layout from '../common/Layout'
import Sidebar from '../User/Sidebar';
import { VendorAuthContext } from '../context/VendorAuth';
import { UserAuthContext } from '../context/UserAuth';
import SidebarVendor from '../Vendor/SidebarVendor';



function UserDashboard() {
    const { user: vendorUser } = useContext(VendorAuthContext);
    const { user: userUser } = useContext(UserAuthContext);
    return (

        <div >
            <Layout>
                <div className='md:container md:mx-auto px-6 py-5 my-5'>
                    <h2 className='my-2 text-base md:text-2xl'>Dashboard</h2>
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="w-full md:w-1/4">
                            {
                                           vendorUser ? (
<SidebarVendor/>
                                            ): (  userUser && <Sidebar/>)
                            }
                        </div>
                        <div className="w-full md:w-3/4">
                        {

                        }
                            <div className="shadow-lg border-2 border-gray-200 p-4">
                                <div className="flex flex-wrap -mx-3 mb-6">
                                    <div className="w-full px-3 mb-6 md:mb-0">
                                        {
                                           vendorUser ? (
                                                  <h3 className='text-center'>Welcome to the Vendor Dashboard</h3>
                                            ): (  userUser && <h3 className='text-center'>Welcome to the User Dashboard</h3>)
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </div>
    )
}

export default UserDashboard