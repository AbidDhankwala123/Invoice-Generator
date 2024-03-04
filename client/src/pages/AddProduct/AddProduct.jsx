import React, { useState, useEffect } from 'react'
import { FaTimes } from "react-icons/fa";
import { CiCirclePlus } from "react-icons/ci";
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";

const AddProduct = ({setInvoiceData}) => {
    let navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);

    const ownerId = localStorage.getItem("ownerId");

    const [products, setProducts] = useState(
        [
            {
                name: "",
                quantity: null,
                rate: null,
                total: 0
            }
        ]
    )

    useEffect(() => {
        const total = products.reduce((prev, curr) => prev + curr.total, 0)
        setTotalAmount(total);

        const gstAmount = total * 0.18; // 18% GST
        const totalAmountWithGST = total + gstAmount;
        setGrandTotal(totalAmountWithGST);

    }, [products])

    const invoiceObject = {
        ownerId,
        products,
        totalAmount,
        grandTotal
    }

    const handlePlus = () => {
        setProducts(prevProducts => [
            ...prevProducts,
            {
                name: "",
                quantity: null,
                rate: null,
                total: 0
            }
        ]);
    }
    const handleName = (e, index) => {
        const updatedProducts = [...products];
        updatedProducts[index].name = e.target.value;
        setProducts(updatedProducts);
    }
    const handleQuantity = (e, index) => {
        const updatedProducts = [...products];
        updatedProducts[index].quantity = e.target.value;
        updatedProducts[index].total = e.target.value * updatedProducts[index].rate;
        setProducts(updatedProducts);
    }

    const handleRate = (e, index) => {
        const updatedProducts = [...products];
        updatedProducts[index].rate = e.target.value;
        updatedProducts[index].total = e.target.value * updatedProducts[index].quantity;
        setProducts(updatedProducts);
    }

    const handleProductDelete = (index) => {

        const updatedProducts = products.filter((_, i) => i !== index); // filter out that index 
        setProducts(updatedProducts);
    };

    const validateName = () => {
        if (products.some(product => !product.name || product.name.trim().length === 0)) {
            toast.error("Product Name is required", {
                position: "top-center",
                autoClose: 2000
              })
            return true;
        }
        return false;
    }
    const validateQuantity = () => {
        let regex = /^[0-9]+$/;
        if (products.some(product => !product.quantity || !regex.test(product.quantity))) {
            toast.error("Product Quantity must be numberic", {
                position: "top-center",
                autoClose: 2000
              })
            return true;
        }
        return false;

    }
    const validateRate = () => {
        let regex = /^[0-9]+$/;
        if (products.some(product => !product.rate || !regex.test(product.rate))) {
            toast.error("Product Rate must be numberic", {
                position: "top-center",
                autoClose: 2000
              })
            return true;
        }
        return false;

    }

    const handleNext = () => {
        if (loading) {
            return
        }

        if (validateName() || validateQuantity() || validateRate()) {
            return;
        }

        setLoading(true);

        axios.post(import.meta.env.VITE_APP_BACKEND_URL_FOR_PRODUCTS, invoiceObject, { headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem("jwtToken") } })
            .then(response => {
                // listProducts();
                console.log(response);
                navigate("/pdfInvoice");
                setInvoiceData(response.data.newInvoice);
                setLoading(false);
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
                toast.error(error.response.data.message, {
                    position: "top-center",
                    autoClose: 1000
                });
                setLoading(false);

                console.error(error);
            })
    }

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    }

    return (
        <div className='h-screen'>
            <button className='bg-green-800 text-white rounded-lg h-7 w-1/6 absolute top-2 left-4 cursor-pointer' onClick={() => navigate("/invoiceHistory")}>Invoices History</button>
            <button className='bg-red-800 text-white rounded-lg h-7 w-1/12 absolute top-2 right-4 cursor-pointer' onClick={handleLogout}>Log Out</button>
            <h1 className='text-center font-bold text-3xl'>Add Product</h1>
            <div className='h-5/6 overflow-auto'>
                {products && products.map((_, index) => {
                    return (
                        <div className='pl-3 mt-4' key={index}>
                            <div className='flex justify-between pr-4 '>
                                <h1 className='text-2xl'>Product {index + 1}</h1>
                                {products.length > 1 && <p><FaTimes title='Delete Product' className="text-red-600 cursor-pointer text-3xl" onClick={() => handleProductDelete(index)} /></p>}
                            </div><br />
                            <div className='flex gap-4'>
                                <input type="text" onChange={(e) => handleName(e, index)} value={products[index].name} className='h-10 w-3/12 pl-2.5 border-slate-400 border-solid border-2 rounded' name="name" placeholder='Product Name' />
                                <input type="text" onChange={(e) => handleQuantity(e, index)} value={products[index].quantity !== null ? products[index].quantity : ""} className='h-10 w-3/12 pl-2.5 border-slate-400 border-solid border-2 rounded' name="quantity" placeholder='Product Quantity' />
                                <input type="text" onChange={(e) => handleRate(e, index)} value={products[index].rate !== null ? products[index].rate : ""} className='h-10 w-3/12 pl-2.5 border-slate-400 border-solid border-2 rounded' name="rate" placeholder='Product Rate' />
                                <span className='text-lg'>Total - {products[index].total}</span>
                            </div>
                        </div>

                    )
                })}
                <div className='float-right mr-4 mt-3 '>
                    <CiCirclePlus className='cursor-pointer text-3xl' title='Add Product' onClick={handlePlus} />
                </div>
            </div>
            <div className='mt-4'>
                <button className='bg-green-800 text-white rounded-lg h-7 w-1/12 absolute right-4 cursor-pointer' onClick={handleNext}>{loading ? "Please Wait..." : "Next"}</button>
            </div>
            <ToastContainer />
        </div>
    )
}

export default AddProduct