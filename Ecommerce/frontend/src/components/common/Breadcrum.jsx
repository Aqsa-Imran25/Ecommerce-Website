import React from 'react'
import { Link } from 'react-router-dom'

function Breadcrum({ bread }) {
    return (
        <nav aria-label="breadcrumb" className="w-max my-2">
            <ol className="flex flex-wrap items-center rounded-md py-2">
                <li className="flex items-center text-sm text-slate-500 hover:text-[#007595]">
                    <Link to="/" className='text-black hover:text-[#007595]'>Home</Link>
                    <span className="pointer-events-none mx-2 text-gray-400">/</span>
                </li>
                <li className="flex items-center text-sm text-slate-500 hover:text-[#007595]">
                 {bread}
                </li>
            </ol>
        </nav>
    )
}

export default Breadcrum