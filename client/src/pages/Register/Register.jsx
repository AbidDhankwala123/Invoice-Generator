import React, { useState } from 'react'
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import { LuEye, LuEyeOff } from "react-icons/lu"

// border-cyan-600 border-solid border-4

const Register = () => {
    let navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [errorName, setErrorName] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');

    const registerUserObject = {
        name,
        email,
        password
    }
    const validateName = () => {
        let regex = new RegExp("^[a-zA-Z\\s]*$");
        if(!name){
            setErrorName("Name field is required");
            return true;
        }
        else if (regex.test(name) === false || name.trim().length === 0) {
            setErrorName("Name must be in characters");
            return true;
        }
        setErrorName("");
        return false;
    }

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorEmail("Please enter a valid email address");
            return true;
        }
        setErrorEmail("");
        return false;
    };

    const validatePassword = () => {
        let regex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
        if (regex.test(password) === false) {
            setErrorPassword("Password must contain atleast 1 uppercase,1 lowercase,1 special symbol and 1 numeric and minimum 8 characters long");
            return true;
        }
        setErrorPassword("");
        return false;

    }
    const handleSubmit = e => {
        e.preventDefault();
        if (loading) {
            return
        }
        if (validateName() || validateEmail() || validatePassword()) {
            return;
        }
        setLoading(true);

        axios.post(`${import.meta.env.VITE_APP_BACKEND_URL_FOR_AUTH}register`, registerUserObject, { headers: { "Content-Type": "application/json" } })
            .then(response => {
                toast.success(response.data.message, {
                    position: "top-center",
                    autoClose: 2000
                })
                setTimeout(() => {
                    navigate("/login");
                }, 1300);
                localStorage.setItem("jwttoken", response.data.jwtToken);
                localStorage.setItem("name", response.data.recruiterName);

            })
            .catch(error => {
                console.log(error);
                toast.error(error.response.data.message, {
                    position: "top-center",
                    autoClose: 2000
                });
                setLoading(false);
            })

    }
    return (
        <div className='h-screen flex justify-center items-center'>
            <div className="bg-white drop-shadow-2xl h-4/5 w-3/5 rounded-md">
                <h1 className='text-3xl font-bold text-center py-6'>Create an account</h1>
                
                <form className=' relative left-1/4' onSubmit={handleSubmit}>
                    <div >
                        <input type="text" name="name" placeholder='Name' value={name} onChange={e => setName(e.target.value)} onBlur={validateName} className='w-3/6 h-10 text-black pl-2.5 border-slate-400 border-solid border-2 rounded' />
                        <p className='text-red-600'>{errorName}</p>
                    </div><br />
                    <div>
                        <input type="email" name="email" placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} onBlur={validateEmail} className='w-3/6 h-10 text-black pl-2.5 border-slate-400 border-solid border-2 rounded' />
                        <p className='text-red-600'>{errorEmail}</p>
                    </div><br />
                    <div>
                        <input type={showPassword ? "text" : "password"} name="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} onBlur={validatePassword} className='w-3/6 h-10 text-black pl-2.5 border-slate-400 border-solid border-2 rounded' />{/*later change type to password*/}
                        {showPassword ? <LuEyeOff onClick={() => setShowPassword(false)} className='inline relative right-8' /> : <LuEye className='inline relative right-8' onClick={() => setShowPassword(true)} />}
                        <p className='text-red-600 w-3/6'>{errorPassword}</p>
                    </div><br />
                    <button className='rounded-md ml-16 cursor-pointer text-xl text-white bg-red-500 border-none h-1/3 w-1/3 py-1'>{loading ? "Please Wait..." : "Create Account"}</button>
                </form><br />

                <div className='text-center'>
                    <span className=''>Already have an account?</span> <Link to="/login" className='font-medium cursor-pointer underline'>Sign In</Link>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Register
