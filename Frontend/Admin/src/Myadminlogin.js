import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Myadminlogin.css";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons from react-icons

export default function Myadminlogin() {
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const [errorMessage, setErrorMessgae] = useState("");
    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:8080/login",
                {
                    username: username,
                    password: password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data !== "fail") {
                localStorage.setItem("token", response.data);
                navigate("/home");
            } else {
                setErrorMessgae("Invalid credentials. Please try again.");
            }
        } catch (error) {
            setErrorMessgae("Invalid credentials. Please try again.");
        }
        setTimeout(() => {
            setErrorMessgae("");
        }, 3000);
    };

    return (
        <section className="container-fluid">
            <section className="col-12 col-sm-6 col-md-4">
                <form className="form-container" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <h4 className="text-center font-weight-bold">Admin Login</h4>
                        <label htmlFor="Inputuser1">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="Inputuser1"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setusername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group password-wrapper">
                        <label htmlFor="InputPassword1">Password</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"} // Toggle input type
                                className="form-control"
                                id="InputPassword1"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setpassword(e.target.value)}
                                required
                            />
                            <span
                                className="eye-icon"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                               
                                {showPassword ? <FaEye /> : <FaEyeSlash />}

                            </span>
                        </div>
                    </div>
                    <button type="submit" id="myAdminButton" className="btn btn-primary btn-block">
                        Sign in
                    </button>
                    {errorMessage && (
                        <div className="alert alert-danger mt-3">{errorMessage}</div>
                    )}
                </form>
            </section>
        </section>
    );
}
