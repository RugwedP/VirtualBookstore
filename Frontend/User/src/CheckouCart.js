// import React, { useState } from 'react'

// function CheckouCart() {

//     const[cartLength,setCartLength] = useState(0)
//     const [isContinueBtnClik, setIsContinueBtnClick] = useState(false);
//     useEffect(() => {
//         fetchCartItems();
//       }, []);
//     const fetchCartItems = async () => {
//         try {
//           console.log("Inside the fetch cart item");
          
//           const response = await axios.get(`http://localhost:8080/api/cart/${localStorage.getItem("email")}`);
//           console.log("My carts are"+response);
//           setCartLength(response.data.body.length);
          
          
       
//         } catch (error) {
//           console.error("Error fetching cart items", error);
//         }
//       };

//     const handleChangeClick = () => {
//         console.log("Inside the change button click bookId" + id);
//         console.log("Inside the change button click id" + id);
    
//         navigate(`/profile`);
//       };

//       useEffect(() => {
//         fetchPhoneNum();
//       }, [email]);

//       const fetchPhoneNum = async () => {
//         try {
//           const response = await axios.get(
//             `http://localhost:8080/api/user/phone/${localStorage.getItem("email")}`
//           );
//           if (response.status === 200) {
//             const userData = response.data;
//             console.log("My USer data is ",userData);
//             setAddress(userData.address);
//             setEmail(userData.email);
//             setPhoneNum(userData.phoneNum);
//           } else {
//             console.log("Phone number not found");
//           }
//         } catch (error) {
//           console.log(error);
//         }
//       };
//   return (
//     <>
//       {isLoading ? (
//         <div className="custom-loader">
//           <div className="loader-circle"></div>
//         </div>
//       ) : (
//         <>
//           <div id="addressContainer">
//             <div className="address">
//               <p>
//                 <h5 id="loginTitle">Login</h5>
//                 <b
//                   className="namePin"
//                   id="myUsername"
//                 >{` ${localStorage.getItem("fullName")}`}</b>
//                 +91 {phoneNum}
//               </p>
//             </div>
//             {/* <Link to="/profile">
//               <button className="changeButton">Change</button>
//             </Link> */}

//             <button
//               className="changeButton"
//               onClick={() => {
//                 handleChangeClick();
//               }}
//             >
//               Change
//             </button>
//           </div>

          

//           {isContinueBtnClik ? (
//             <>
//               <div id="addressContainer5">
//                 <div className="address">
//                   <p>
//                     <h5 id="loginTitle">Order Summary</h5>
//                     <b className="namePin" id="myUsername">
//                       {cartLength} Item
//                     </b>
//                   </p>
//                 </div>
//                 <Link to="/checkout">
//                   <button
//                     className="changeButton"
//                     onClick={() => setIsContinueBtnClick(false)}
//                   >
//                     Change
//                   </button>
//                 </Link>
//               </div>
//               <div className="summaryContainer">
//                 <div id="mycart-summary">
                 
//                   <h3>Total: ₹ {totalPrice.toFixed(2)}</h3>
//                   <button
//                     id="myCheckout-button"
//                     onClick={()=>placeOrder()}
//                   >
//                     Place Order
//                   </button>
//                 </div>
//               </div>

//               <div id="addressContainer6">
//                 <div className="address">
//                   <p>
                  
//                     Order confirmation message will be send to{" "}
//                   <b> {localStorage.getItem("email")}</b> 
//                   </p>
//                 </div>
               

                
//               </div>
//             </>
          
//           )}
//         </>
//       )}
//     </>
//   )
// }

// export default CheckouCart
