import React from 'react';
import Layout from './Layout.jsx';
import Sidebar from './Sidebar.jsx';
import { getUserRole } from '../common/Http';


function Sample2({ title = "Ecommerce", children }) {
    const role = getUserRole();
    return (
        <div >
            <Layout>
                <div className='md:container md:mx-auto px-6 py-5 my-5'>
                    <div className='flex justify-between my-4'>
                        <h2 className='my-2 text-base md:text-2xl'>{title}</h2>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="w-full md:w-1/4">
                            <Sidebar role={role} />
                        </div>
                        <div className="w-full md:w-3/4">
                            <div className="shadow-lg border-2 border-gray-200 p-4">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </div>
    )
}

export default Sample2