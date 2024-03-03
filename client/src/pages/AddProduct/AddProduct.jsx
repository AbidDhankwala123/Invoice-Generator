import React, { useState, useEffect } from 'react'
import { FaTimes } from "react-icons/fa";
import { CiCirclePlus } from "react-icons/ci";
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";

const AddProduct = () => {
    let navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);

    const [errorProductName, setErrorProductName] = useState("");
    const [errorProductQuantity, setErrorProductQuantity] = useState("");
    const [errorProductRate, setErrorProductRate] = useState("");

//ccjscdlbc
    const productOwnerId = localStorage.getItem("productOwnerId");

    const [products, setProducts] = useState(
        [
            {
                productName: "",
                productQuantity: null,
                productRate: null,
                productTotal: 0
            }
        ]
    )

    useEffect(() => {
        const total = products.reduce((prev, curr) => prev + curr.productTotal, 0)
        setTotalAmount(total);

        const gstAmount = total * 0.18; // 18% GST
        const totalAmountWithGST = total + gstAmount;
        setGrandTotal(totalAmountWithGST);

    }, [products])

    const productObject = {
        productOwnerId,
        products,
        totalAmount,
        grandTotal
    }

    const handlePlus = () => {
        setProducts(prevProducts => [
            ...prevProducts,
            {
                productName: "",
                productQuantity: null,
                productRate: null,
                productTotal: 0
            }
        ]);
    }
    const handleProductName = (e, index) => {
        const updatedProducts = [...products];
        updatedProducts[index].productName = e.target.value;
        setProducts(updatedProducts);
    }
    const handleProductQuantity = (e, index) => {
        const updatedProducts = [...products];
        updatedProducts[index].productQuantity = e.target.value;
        updatedProducts[index].productTotal = e.target.value * updatedProducts[index].productRate;
        setProducts(updatedProducts);
    }

    const handleProductRate = (e, index) => {
        const updatedProducts = [...products];
        updatedProducts[index].productRate = e.target.value;
        updatedProducts[index].productTotal = e.target.value * updatedProducts[index].productQuantity;
        setProducts(updatedProducts);
    }

    const handleProductDelete = (index) => {

        const updatedProducts = products.filter((_, i) => i !== index); // filter out that index 
        setProducts(updatedProducts);
    };

    const validateProductName = () => {
        if (products.some(product => !product.productName || product.productName.trim().length === 0)) {
            setErrorProductName("Product Name is required");
            return true;
        }
        setErrorProductName("");
        return false;
    }
    const validateProductQuantity = () => {
        let regex = /^[0-9]+$/;
        if (products.some(product => !product.productQuantity || !regex.test(product.productQuantity))) {
            setErrorProductQuantity("Product Quantity must be in numbers");
            return true;
        }
        setErrorProductQuantity("");
        return false;

    }
    const validateProductRate = () => {
        let regex = /^[0-9]+$/;
        if (products.some(product => !product.productRate || !regex.test(product.productRate))) {
            setErrorProductRate("Product Rate must be in numbers");
            return true;
        }
        setErrorProductRate("");
        return false;

    }

    const handleNext = () => {
        if (loading) {
            return
        }

        if (validateProductName() || validateProductQuantity() || validateProductRate()) {
            return;
        }

        setLoading(true);

        axios.post(import.meta.env.VITE_APP_BACKEND_URL_FOR_PRODUCTS, productObject, { headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem("jwtToken") } })
            .then(response => {
                // listProducts();
                console.log(response);
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
                                <input type="text" onChange={(e) => handleProductName(e, index)} onBlur={validateProductName} value={products[index].productName} className='h-10 w-3/12 pl-2.5 border-slate-400 border-solid border-2 rounded' name="productName" placeholder='Product Name' />
                                <p className='text-red-600'>{errorProductName}</p>
                                <input type="text" onChange={(e) => handleProductQuantity(e, index)} onBlur={validateProductQuantity} value={products[index].productQuantity !== null ? products[index].productQuantity : ""} className='h-10 w-3/12 pl-2.5 border-slate-400 border-solid border-2 rounded' name="productQuantity" placeholder='Product Quantity' />
                                <p className='text-red-600'>{errorProductQuantity}</p>
                                <input type="text" onChange={(e) => handleProductRate(e, index)} onBlur={validateProductRate} value={products[index].productRate !== null ? products[index].productRate : ""} className='h-10 w-3/12 pl-2.5 border-slate-400 border-solid border-2 rounded' name="productRate" placeholder='Product Rate' />
                                <p className='text-red-600'>{errorProductRate}</p>
                                <span className='text-lg'>Total - {products[index].productTotal}</span>
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