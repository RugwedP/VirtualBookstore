import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./Checkout.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "./Navbar";

function Checkout() {
  const location = useLocation();
  // let bookId = location.state?.id;
  const { id } = useParams();

  const [isItemDeleted, setIsItemDeleted] = useState(false);
  const [username, setUserName] = useState(localStorage.getItem("fullName"));
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [phoneNum, setPhoneNum] = useState("");

  const [pincode, setPincode] = useState("");

  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [districtState, setDistrictState] = useState({});
  const [totalPrice, setTotalPrice] = useState(0); // New state for total price
  const [book, setBook] = useState({});
  // const previousLocation = useRef(location);
  const [isContinueBtnClik, setIsContinueBtnClick] = useState(false);
  const navigate = useNavigate();

  const handleChangeClick = () => {
    console.log("Inside the change button click bookId" + id);
    console.log("Inside the change button click id" + id);

    navigate(`/profile`, { state: { prevPath: "/checkout" } });
  };

  useEffect(() => {
    
    if (!localStorage.getItem("orderId")) {
      addToOrderSummary();
      
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("orderId") != null) {
      console.log("location in chekout",location);
      getBookData();
    }
  }, [localStorage.getItem("orderId")]);

  useEffect(() => {
    fetchPhoneNum();
  }, [email]);

  useEffect(() => {
    fetchPincode();
  }, []);

  useEffect(() => {
    if (pincode) {
      fetchPincodeDetails(pincode);
    }
  }, [pincode]);

  useEffect(() => {
    if (book && book.price && book.quantity) {
      setTotalPrice(book.price * book.quantity);
    }
  }, [book]);

  const fetchPincode = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/user/pincode/${localStorage.getItem(
          "email"
        )}`
      );
      setPincode(response.data.pinCode);
      // setAddress(response.data.address);
    } catch (error) {
      console.error("Error fetching pincode", error);
    }
  };

  const fetchPhoneNum = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/user/phone/${localStorage.getItem("email")}`
      );
      if (response.status === 200) {
        const userData = response.data;
        console.log("My USer data is ",userData);
        setAddress(userData.address);
        setEmail(userData.email);
        setPhoneNum(userData.phoneNum);
      } else {
        console.log("Phone number not found");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const addToOrderSummary = async () => {
    try {
      console.log("Book ID" + id);

      const response = await axios.post(
        `http://localhost:8080/api/user/addOrderSummary/${localStorage.getItem(
          "email"
        )}/${id}`
      );

      localStorage.setItem("orderId", response.data.oId);
      console.log("order id is", response.data.oId);
    } catch (error) {}
  };

  const getBookData = async () => {
    try {
      console.log("Book ID" + id);

      const response = await axios.get(
        `http://localhost:8080/api/user/getOrderSummaryBook/${localStorage.getItem(
          "email"
        )}/${localStorage.getItem("orderId")}`
      );

      setBook(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  

  const fetchPincodeDetails = async (pincode) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/cart/pincode/${pincode}`
      );
      if (response.data[0].Status === "Success") {
        const { District, State } = response.data[0].PostOffice[0];
        setDistrictState({ district: District, state: State });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
    } catch (error) {
      console.error("Error fetching pincode details", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleQuantityChange = async (id, quantity) => {
    console.log(book.quantity);

    console.log("quantity is " + quantity);
    const updatedQuantity = Math.max(1, quantity);
    const newTotalPrice = book.price * updatedQuantity;
    setBook((prevBook) => ({ ...prevBook, quantity: updatedQuantity }));
    setTotalPrice(newTotalPrice);
    try {
      console.log("Updated Q" + updatedQuantity);

      await axios.put(
        `http://localhost:8080/api/user/orderSummary/updateProductQuanatiy/${updatedQuantity}/${localStorage.getItem(
          "email"
        )}/${id}/${newTotalPrice}`
      );
      console.log(newTotalPrice);

      console.log("Book updated");
    } catch (error) {
      console.error("Error updating quantity", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update quantity!",
      });
    }
  };

  const removeItem = async () => {
    try {
      console.log("inside removeorderSummary");
      await axios.delete(
        `http://localhost:8080/api/user/removeOrderSummary/${localStorage.getItem(
          "email"
        )}/${localStorage.getItem("orderId")}`
      );
      console.log("Book removed from Order Summary.");
      localStorage.removeItem("orderId");
      Swal.fire({
        icon: "success",
        title: "Item removed Successfully!",
        showConfirmButton: false,
        timer: 2200,
      });
      setIsItemDeleted(true);
    } catch (error) {
      console.error("Error occurred", error);
    }
  };

  const placeOrder = async ()=>{

    Swal.fire({
      icon: "success",
      title: "Book Placed Successfully!",
      showConfirmButton: false,
      timer: 2200,
    }).then(async()=>{
     
          const response = await axios.post(`http://localhost:8080/api/user/placeOrder/${localStorage.getItem("email")}/${localStorage.getItem("orderId")}`)

          console.log(response.data);
          navigate("/orders")
          
      
    });

    

  }

  return (
    <>
      {isLoading ? (
        <div className="custom-loader">
          <div className="loader-circle"></div>
        </div>
      ) : (
        <>
          <div id="addressContainer">
            <div className="address">
              <p>
                <h5 id="loginTitle">Login</h5>
                <b
                  className="namePin"
                  id="myUsername"
                >{` ${localStorage.getItem("fullName")}`}</b>
                +91 {phoneNum}
              </p>
            </div>
            {/* <Link to="/profile">
              <button className="changeButton">Change</button>
            </Link> */}

            <button
              className="changeButton"
              onClick={() => {
                handleChangeClick();
              }}
            >
              Change
            </button>
          </div>

          <div id="addressContainer2">
            <div className="address">
              <p>
                <h5 id="loginTitle">Delivery Address</h5>
                <b
                  className="namePin"
                  id="myUsername"
                >{` ${localStorage.getItem("fullName")}`}</b>
              </p>
              <p className="userAddress">
                <p>
                  {address}, {districtState.district} District ,{" "}
                  {districtState.state} - {pincode}{" "}
                </p>
              </p>
            </div>

            <button
              className="changeButton"
              onClick={() => {
                handleChangeClick();
              }}
            >
              Change
            </button>
          </div>

          {isContinueBtnClik ? (
            <>
              <div id="addressContainer5">
                <div className="address">
                  <p>
                    <h5 id="loginTitle">Order Summary</h5>
                    <b className="namePin" id="myUsername">
                      1 Item
                    </b>
                  </p>
                </div>
                <Link to="/checkout">
                  <button
                    className="changeButton"
                    onClick={() => setIsContinueBtnClick(false)}
                  >
                    Change
                  </button>
                </Link>
              </div>
              <div className="summaryContainer">
                <div id="mycart-summary">
                 
                  <h3>Total: ₹ {totalPrice.toFixed(2)}</h3>
                  <button
                    id="myCheckout-button"
                    onClick={()=>placeOrder()}
                  >
                    Place Order
                  </button>
                </div>
              </div>

              <div id="addressContainer6">
                <div className="address">
                  <p>
                  
                    Order confirmation message will be send to{" "}
                  <b> {localStorage.getItem("email")}</b> 
                  </p>
                </div>
               

                
              </div>
            </>
          ) : (
            <div>
              <div id="addressContainer3">
                <div id="orderSumContainer">
                  <div id="orderSummany">
                    <h5>Order Summary</h5>
                  </div>
                </div>
              </div>

              {!isItemDeleted ? (
                <div id="addressContainer4">
                  <div id="cart-container">
                    <div id="cart-items">
                      <div id="cart-item">
                        <img
                          src={`http://localhost:8080/api/book${book.imageUrl}`}
                          alt={book.bookName}
                          className="cart-item-image"
                        />
                        <div id="cart-item-details">
                          <h4>{book.bookName}</h4>
                          <p>Price: ₹{book.price}</p>
                          <div id="cart-item-quantity">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  book.oId,
                                  book.quantity - 1
                                )
                              }
                            >
                              -
                            </button>
                            <input
                              type="number"
                              value={book.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  book.oId,
                                  parseInt(e.target.value)
                                )
                              }
                              min="1"
                            />
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  book.oId,
                                  book.quantity + 1
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                          <button
                            className="remove-button"
                            onClick={() => removeItem()}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="cart-summary">
                      <h3>Total: ₹ {totalPrice.toFixed(2)}</h3>
                      <button
                        className="checkout-button"
                        onClick={() => setIsContinueBtnClick(true)}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <p id="noOrderSummaryFound">Your checkout has no data</p>
                </>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Checkout;
