import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";

const InvoiceHistory = ({invoiceData,setInvoiceData,handleDownload}) => {
    let navigate = useNavigate();
    // if (!invoiceData || invoiceData.length === 0) {
    //     return <div>No invoice data available</div>;
    // }
    const ownerId = localStorage.getItem("ownerId");

    

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_APP_BACKEND_URL_FOR_PRODUCTS}/getAllInvoices/${ownerId}`,
            {
                headers:
                {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwtToken")
                }
            })
            .then(response => {
                setInvoiceData(response.data.invoices);
                // console.log(response)
            })
            .catch(error => {
                if (error.response.status === 401) {
                    toast.error("Invalid Session or Session expired. Please Log In again", {
                        position: "top-center",
                        autoClose: 2000
                    })
                    localStorage.clear();
                    setTimeout(() => {
                        navigate("/");
                    }, 2000);
                    return;
                }
                console.error(error);
            })
    }, [])
    if (!invoiceData) {
        // If quizData is still loading, you can return a loading indicator or null
        return <p>Loading.....</p>;
    }
    return (
        <div >
            {invoiceData && invoiceData.length>0 && <><table className='border-collapse w-1/2'>
                <caption className='font-bold text-2xl'>Product Invoices</caption>
                <thead>
                    <tr>
                        <th className='py-2 px-2'>Sr.No</th>
                        <th className='py-2 px-2'>Product Invoice</th>
                        <th className='py-2 px-2'>Created At</th>
                        <th className='py-2 px-2'></th>
                    </tr>
                </thead>
                <tbody>
                    {invoiceData && invoiceData.length > 0 && invoiceData.map((invoice, index) => {
                        const createdAtDate = new Date(invoice.createdAt);
                        const formattedDate = `${String(createdAtDate.getDate()).padStart(2, '0')} ${createdAtDate.toLocaleString('default', { month: 'short' })}, ${String(createdAtDate.getFullYear())}`;
                        return (
                            <tr className='even:bg-slate-400' key={index}>
                                <td className='text-center py-2 px-2'>{index + 1}</td>
                                <td className='text-center py-2 px-2'>Invoice_{invoice._id}</td>
                                <td className='text-center py-2 px-2'>{formattedDate}</td>
                                <td className='text-center py-2 px-2'><button className='bg-green-800 text-white rounded-lg h-7 w-24 cursor-pointer' onClick={() => handleDownload(invoice)}>Download</button></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table><div className='mt-4'>
                    <button className='bg-green-800 text-white rounded-lg h-7 w-24 cursor-pointer' onClick={() => navigate("/addProduct")}>Back</button>
                </div></>}
            <ToastContainer />
        </div>
    )
}

export default InvoiceHistory
