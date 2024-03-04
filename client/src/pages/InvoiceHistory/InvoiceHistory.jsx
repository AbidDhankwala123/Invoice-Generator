import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { saveAs } from 'file-saver';

const InvoiceHistory = () => {
    let navigate = useNavigate();
    // if (!invoiceData || invoiceData.length === 0) {
    //     return <div>No invoice data available</div>;
    // }
    const ownerId = localStorage.getItem("ownerId");
    const [invoiceData, setInvoiceData] = useState("");

    

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
    const handleDownload = (invoice) => {
        axios.post(`${import.meta.env.VITE_APP_BACKEND_URL_FOR_PRODUCTS}/create-pdf`, {invoice},
            {
                headers:
                {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwtToken")
                }
            }
        )
            .then(() => axios.get(`${import.meta.env.VITE_APP_BACKEND_URL_FOR_PRODUCTS}/fetch-pdf`, {
                headers:
                {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwtToken")
                }
            },
                { responseType: 'blob' }))
            .then((res) => {
                console.log("res= ",res);
                const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
                saveAs(pdfBlob, 'invoice.pdf')

            })

    }
    return (
        <div>
            <table className='border-collapse w-1/2'>
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
                    {invoiceData && invoiceData.map((invoice, index) => {
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
            </table>
            <div className='mt-4'>
                <button className='bg-green-800 text-white rounded-lg h-7 w-24 cursor-pointer' onClick={() => navigate("/addProduct")}>Back</button>
            </div>
            <ToastContainer />
        </div>
    )
}

export default InvoiceHistory
