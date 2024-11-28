
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Profile.css';
import Swal from 'sweetalert2'
import Navbar from './Navbar';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default function Profile({}) {
    const {id} = useParams()
    
    
    const [userName, setFullName] = useState("");
    const [email, setEmail] = useState(localStorage.getItem("email"));
    const [address, setAddress] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const [pincode, setPincode] = useState("");
    const[isEnable,setIsEnable] = useState(false)
    const [user, setUser] = useState({});
    const location = useLocation()
    const navigate = useNavigate()

    const[isNavigatingToCheckout,setisNavigatingToCheckout] = useState(false)
 
    useEffect(() => {
        fetchUser();
        
        
    }, [email]);
    

   

    const fetchUser = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/user/userDetails/${email}`);
            const userData = response.data;
            setUser(userData);
            setFullName(userData.userName);
            setAddress(userData.address);
            setPhoneNum(userData.phoneNum);
            setPincode(userData.pinCode);
        } catch (error) {
            console.log(error);
        }
    };
    const handleClick = ()=>{
        setIsEnable(true)
    }
    const saveChanges = async()=>{
        try {
            const response = await axios.put(
                `http://localhost:8080/api/user/updateUser/${email}`,
                {
                    userName: userName,
                    email: email,
                    address: address,
                    phoneNum: phoneNum,
                    pinCode: pincode
                    
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            
            console.log(response);
            
            setIsEnable(false); 
           await Swal.fire({
                icon: "success",
                title: "Updated Successfully!",
                showConfirmButton: false,
                timer: 2200
                
            });
            // 1-->kutha jaycha aahe anni         kutha hutas tu
            if(localStorage.getItem("orderId"))
            {

                navigate(`/checkout`,{state:{prevPath:"/profile"}})
            }
            else
            {
                navigate("/profile")
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
        <Navbar showSearchAndLogin={true}/>
        <div className="personal-details">
            <h2>Personal Details</h2>
            <form>
                <label>Full Name</label>
                <div className="input-group mb-3">
                    <span className="input-group-text">
                        <i className="bi bi-person-fill"></i>
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Full Name"
                        value={userName}
                        onChange={(e) => setFullName(e.target.value)}
                        disabled={!isEnable}
                    />
                </div>

                <label>Email Address</label>
                <div className="input-group mb-3">
                    <span className="input-group-text">
                        <i className="bi bi-envelope-fill"></i>
                    </span>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!isEnable}
                    />
                </div>

                <label>Address</label>
                <div className="input-group mb-3">
                    <span className="input-group-text">
                        <i className="bi bi-house-door-fill"></i>
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        disabled={!isEnable}
                    />
                </div>

                <label>Mobile Number</label>
                <div className="input-group mb-3">
                    <span className="input-group-text">
                        <i className="bi bi-telephone-fill"></i>
                    </span>
                    <input
                        type="tel"
                        className="form-control"
                        placeholder="Phone Number"
                        maxLength="10"
                        value={phoneNum}
                        onChange={(e) => {
                            const input = e.target.value;
                            if (/^\d{0,10}$/.test(input)) setPhoneNum(input);
                        }}
                        disabled={!isEnable}
                    />
                </div>

                <label>Pincode</label>
                <div className="input-group mb-3">
                    <span className="input-group-text">
                        <i className="bi bi-geo-alt-fill"></i>
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Pincode"
                        value={pincode}
                        maxLength ="6"
                        onChange={(e) => {
                            const input = e.target.value;
                            if (/^\d{0,6}$/.test(input)) setPincode(input);
                        }}
                        disabled={!isEnable}
                    />
                </div>
                <div className="button-group">
                    {isEnable ? (
                        <button type="button" onClick={saveChanges}  >Save</button>
                    ) : (
                        <button type="button" onClick={handleClick}>Edit</button>
                    )}
                </div>

            </form>
        </div>
        </>
    );
}
