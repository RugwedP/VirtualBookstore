import React, { useState } from "react";
import "./UserDetails.css";
import axios from "axios"
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import UserLogin from "./UserLogin";

export default function UserDetails() {
   const navigate = useNavigate()

    const [userName,setFullName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [confirmPassword,setConfirmPassword] = useState("")
    const [address,setAddress] = useState("")
    const [pinCode,setPincode] = useState("")
    const[phoneNum,setPhoneNum] = useState("")
    const [errorMessage,setErrorMessgae] = useState("")
    const [flag,setFlag] =useState(false) 
    const [loading, setLoading] = useState(false); // Loader state

    function togglePasswordVisibility(inputId, iconId) {
        
        const input = document.getElementById(inputId);
        const icon = document.getElementById(iconId);

        if (input.type === "password") {
            input.type = "text";
            icon.classList.remove("bi-eye-slash");
            icon.classList.add("bi-eye");
        } else {
            input.type = "password";
            icon.classList.remove("bi-eye");
            icon.classList.add("bi-eye-slash");
        }
    }

    const validateUser = async (e) => {
        e.preventDefault()

        if (loading) return;
        setLoading(true)
        console.log("inside the validateUser");
        
        
        if(password!==confirmPassword)
        {
           setFlag(false)
            setErrorMessgae("Password Not Match!")
            setLoading(false); // Stop loading on error
        }  
        
        else
        {
          
           await saveUser()
           setLoading(false)
            
        }
        async function saveUser() {
            try {
                const response = await axios.post("http://localhost:8080/api/user/addUser", {
                    userName: userName,
                    email: email,
                    password: password,
                    confirmPassword: confirmPassword,
                    phoneNum: phoneNum,
                    address: address,
                    pinCode: pinCode,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
        
                // Handle successful signup
                if (response.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Signup Successful!",
                        showConfirmButton: false,
                        timer: 2200
                    });
                    setFullName("");
                    setAddress("");
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                    setPincode("");
                    setPhoneNum("");
                    setFlag(true);
                    setErrorMessgae("Signup Successful");
                }
            } catch (error) {
                // Check for the 406 error status to show Swal alert
                if (error.response && error.response.status === 406) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Email id already present!",
                    });
                } else {
                    console.error("An unexpected error occurred:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "An unexpected error occurred. Please try again.",
                    });
                }
            } finally {
                setLoading(false); // Ensure loading is stopped after request completes
            }
        }
        
        
        
        setTimeout( ()=>{
            setErrorMessgae("")

        },3000 )
    }

    
    

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    {/* Logo or Brand */}
                    <Link to="/" className="navbar-brand">
                        BookStore
                    </Link>
                </div>
            </nav>
            
                <div className="signup-container">
                    {/* <h2 className="heading">Bookstore</h2> */}
                    <form onSubmit={validateUser}>
                        <div className="mb-3 input-group">
                            <span className="input-group-text">
                                <i className="bi bi-person-fill"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Full Name"
                                value={userName}
                                onChange={(e)=> setFullName(e.target.value)}
                                required
                            />
                        </div>

                        
                       
                        <div className="mb-3 input-group">
                            <span className="input-group-text">
                                <i className="bi bi-envelope-fill"></i>
                            </span>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                required
                                
                            />
                        </div>
                        
                        <div className="mb-3 input-group">
                            <span className="input-group-text">
                                <i className="bi bi-lock-fill"></i>
                            </span>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                id="password"
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                                required
                                
                            />
                            <span
                                className="input-group-text"
                                onClick={() =>
                                    togglePasswordVisibility("password", "togglePasswordIcon")
                                }
                            >
                                <i className="bi bi-eye-slash" id="togglePasswordIcon"></i>
                            </span>
                        </div>
                      
                        <div className="mb-3 input-group">
                            <span className="input-group-text">
                                <i className="bi bi-lock-fill"></i>
                            </span>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Confirm Password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e)=>setConfirmPassword(e.target.value)}
                                required
                                
                            />
                           
                            <span
                                className="input-group-text"
                                onClick={() =>
                                    togglePasswordVisibility(
                                        "confirmPassword",
                                        "toggleConfirmPasswordIcon"
                                    )
                                }
                            >
                                <i
                                    className="bi bi-eye-slash"
                                    id="toggleConfirmPasswordIcon"
                                ></i>
                            </span>
                        </div>

                        <div className="mb-3 input-group">
                            <span className="input-group-text">
                            <i class="bi bi-telephone-fill"></i>
                            </span>
                            <input
                                type="tel"  // "tel" type helps with mobile input, though "number" can work too
                                className="form-control"
                                placeholder="Phone Number"
                                maxLength="10"  // Limits input to 10 characters
                                value={phoneNum}
                                onChange={(e) => {
                                    // Allow only numbers and limit to 10 digits
                                    const input = e.target.value;
                                    if (/^\d{0,10}$/.test(input)) {
                                        setPhoneNum(input);
                                    }
                                }}
                                required
                            />
                        </div>
                       
                        <div className="mb-3 input-group">
                            <span className="input-group-text">
                                <i className="bi bi-house-door-fill"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Address"
                                value={address}
                                onChange={(e)=>setAddress(e.target.value)}
                                required
                                
                            />
                        </div>
                       
                        <div className="mb-3 input-group">
                            <span className="input-group-text">
                                <i className="bi bi-geo-alt-fill"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Pincode"
                                value={pinCode}
                                onChange={(e) => {
                                    const input = e.target.value;
                                    if (/^\d{0,6}$/.test(input)) setPincode(input);
                                }}
                                required
                                
                            />
                        </div>
                        <span className="" ></span>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                            "Sign Up"
                        )}
                    </button>
                        {flag?( <div ></div>):
                            (errorMessage  &&  <div className="alert alert-danger mt-3">{errorMessage}</div>)
                        }
                       
                    </form>
                    <p className="login-link" onClick={(e) => {
                        e.preventDefault();
                        navigate('/loginUser');
                    }}>
                        Already have an account? <Link to={UserLogin}>Login</Link>
                    </p>
                </div>
            
        </>
    );
}
