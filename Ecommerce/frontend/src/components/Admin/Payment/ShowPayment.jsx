
import React, { useEffect, useState } from 'react';
import Loader from '../../common/Loader';
import Empty from '../../common/Empty';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons'; // The solid style icon
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { adminToken, apiUrl } from '../../common/Http';
import AdminSample from '../../common/AdminSample';

function ShowPayment() {
    const [payments, setPayments] = useState([])
    const [loader, setLoader] = useState(false)
    // deletePayment

    const deletePayment = async (id) => {
        if (!window.confirm("Are you sure you want to delete this payment?")) return;

        const res = await fetch(`${apiUrl}/admin/payments/${id}`, {
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
            setPayments(prevpayments => prevpayments.filter(payments => payments.id !== id));

        } else {
            console.log("Something went wrong!")
        }
    }

    const fetchPaymentApi = async () => {
        setLoader(true)
        const res = await fetch(`${apiUrl}/admin/payment-settings`, {
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

            setPayments(result.data)

        } else {
            console.log("Something went wrong!")
        }


    }

    useEffect(() => {
        fetchPaymentApi()
    }, [])
    return (
        <>
            <AdminSample title='Payments' btnText='Create' to='/admin/payments/create'>

                <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base">
                    {
                        loader == true && <Loader />
                    }{
                        loader == false && payments.length == 0 && <Empty text='Payments Are Empty!' />
                    }
                    {
                        payments && payments.length > 0 &&

                        <table className="w-full text-sm text-left rtl:text-right text-body">
                            <thead className="bg-neutral-secondary-soft border-b border-gray-300">
                                <tr>
                                    <th scope="col" className="px-6 py-3 font-medium">
                                        Store-Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-medium">
                                        COD
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-medium">
                                        Commission
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-medium">
                                        Currency
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-medium text-center">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    payments.map((payment, index) => (

                                        <tr key={index} className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-gray-300">
                                            <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                                                {payment.store?.name || "N/A"}                                            </th>
                                            <td className="px-6 py-4">
                                                {payment.cod_enabled ? "Enabled" : "Disabled"}                                            </td>
                                            <td className="px-6 py-4">
                                                {payment.commission}%
                                            </td>
                                            <td className="px-6 py-4">
                                                {payment.currency}
                                            </td>


                                            <td className="px-6 py-4">
                                                <div className="flex justify-around">
                                                    <Link to={`/admin/payments/${payment.id}/edit`} className="font-medium text-fg-payment hover:underline text-blue-600">
                                                        <FontAwesomeIcon icon={faPencil} />
                                                    </Link>
                                                    <Link
                                                        onClick={() => deletePayment(payment.id)}
                                                        to="#" className="font-medium text-fg-payment hover:underline text-red-600">
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

export default ShowPayment