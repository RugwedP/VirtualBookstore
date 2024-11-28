import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./Cart.css";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [districtState, setDistrictState] = useState({});
  const [pincode, setPincode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCartItemPresent, setIsCartItemPresent] = useState(false);
  const [address, setAddress] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [isContinueBtnClik, setIsContinueBtnClick] = useState(false);
  const[cartLength,setCartLength] = useState(0)

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchPincode();
  }, []);
  useEffect(() => {
    fetchPhoneNum();
  }, [email]);

  useEffect(() => {
    if (pincode) {
      fetchPincodeDetails(pincode);
      console.log(location);
    }
  }, [pincode]);

  useEffect(() => {
    fetchCartItems();
  }, [localStorage.getItem("email")]);

  const fetchPhoneNum = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/user/phone/${localStorage.getItem("email")}`
      );
      if (response.status === 200) {
        const userData = response.data;
        console.log("My USer data is ", userData);
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

  const fetchCartItems = async () => {
    try {
      console.log("Inside the fetch cart item");

      const response = await axios.get(
        `http://localhost:8080/api/cart/${localStorage.getItem("email")}`
      );
      console.log("My carts are" + response);
      // setCartLength(response.data.body.length);

      setCartItems(response.data.body);
      setIsCartItemPresent(response.data.body.length > 0);
    } catch (error) {
      console.error("Error fetching cart items", error);
    }
  };

  const fetchCartLength = async () => {
    try {
      console.log("Inside the fetch cart item");
      setIsContinueBtnClick(true)
      const response = await axios.get(
        `http://localhost:8080/api/cart/${localStorage.getItem("email")}`
      );

      setCartLength(response.data.body.length);

      
    } catch (error) {
      console.error("Error fetching cart items", error);
    }
  };

  const fetchPincode = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/user/pincode/${localStorage.getItem(
          "email"
        )}`
      );
      setPincode(response.data.pinCode);
      setAddress(response.data.address);
    } catch (error) {
      console.error("Error fetching pincode", error);
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

  const handleChangeClick = () => {
    navigate(`/profile`);
  };

  const placeOrder = async ()=>{

    Swal.fire({
      icon: "success",
      title: "Book Placed Successfully!",
      showConfirmButton: false,
      timer: 2200,
    }).then(async()=>{
     
          const response = await axios.post(`http://localhost:8080/api/user/placeCartBooks/${localStorage.getItem("email")}`)

          console.log(response.data);
          navigate("/orders")
          
      
    });

    

  }

  const totalPrice =
    Array.isArray(cartItems) && cartItems.length > 0
      ? cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
      : 0;

  const handleQuantityChange = async (id, quantity) => {
    const updatedQuantity = Math.max(1, quantity);
    const cartItem = cartItems.find((item) => item.id === id);

    if (!cartItem) return;

    try {
      await axios.post(
        `http://localhost:8080/api/cart/quantity/${updatedQuantity}/${localStorage.getItem(
          "email"
        )}/${id}`
      );
      setCartItems((items) =>
        items.map((item) =>
          item.id === id ? { ...item, quantity: updatedQuantity } : item
        )
      );
      console.log("ID is" + id);
    } catch (error) {
      console.error("Error updating quantity", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update quantity!",
      });
    }
  };

  const removeItem = async (id) => {
    try {
      await axios.post(
        `http://localhost:8080/api/cart/remove/${localStorage.getItem(
          "email"
        )}/${id}`
      );
      Swal.fire({
        icon: "success",
        title: "Item removed Successfully!",
        showConfirmButton: false,
        timer: 2200,
      });
      setCartItems((prevItems) => {
        const updatedItems = prevItems.filter((item) => item.id !== id);
        setIsCartItemPresent(updatedItems.length > 0);
        return updatedItems;
      });
    } catch (error) {
      console.error("Error occurred", error);
    }
  };

  const handleClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <>
  {isLoading ? (
    <div className="custom-loader">
      <div className="loader-circle"></div>
    </div>
  ) : (
    <>
      {isCartItemPresent ? (
        <>
          <div id="addressContainer">
            <div className="address">
              <h5 id="loginTitle">Login</h5>
              <p>
                <b
                  className="namePin"
                  id="myUsername"
                >{` ${localStorage.getItem("fullName")}`}</b>
                +91 {phoneNum}
              </p>
            </div>
            <button
              className="changeButton"
              onClick={handleChangeClick}
            >
              Change
            </button>
          </div>

          <div id="addressContainer2">
            <div className="address">
              <h5 id="loginTitle">Delivery Address</h5>
              <p>
                <b className="namePin" id="myUsername">
                  {localStorage.getItem("fullName")}
                </b>
              </p>
              <p className="userAddress">
                {`${address}, ${districtState.district} District, ${districtState.state} - ${pincode}`}
              </p>
            </div>
            <button
              className="changeButton"
              onClick={handleChangeClick}
            >
              Change
            </button>
          </div>

          {isContinueBtnClik ? (
            <>
              <div id="addressContainer5">
                <div className="address">
                  <h5 id="loginTitle">Order Summary</h5>
                  <p>
                    <b className="namePin" id="myUsername">
                      {cartLength} Item
                    </b>
                  </p>
                </div>
                <Link to="/cart">
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
                    onClick={placeOrder}
                  >
                    Place Order
                  </button>
                </div>
              </div>

              <div id="addressContainer6">
                <div className="address">
                  <p>
                    Order confirmation message will be sent to{" "}
                    <b>{localStorage.getItem("email")}</b>
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="cart-container">
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img
                      src={`http://localhost:8080/api/book${item.bookImageUrl}`}
                      alt={item.bookTitle}
                      className="cart-item-image"
                      onClick={() => handleClick(item.bookId)}
                    />
                    <div className="cart-item-details">
                      <h4>{item.bookTitle}</h4>
                      <p>Price: ₹{item.price}</p>
                      <div className="cart-item-quantity">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.id,
                              parseInt(e.target.value, 10)
                            )
                          }
                          min="1"
                        />
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="remove-button"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-summary">
                <h3>Total: ₹ {totalPrice.toFixed(2)}</h3>
                <button
                  className="checkout-button"
                  onClick={() => fetchCartLength()}
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div id="notCategoryFound">
          <div>
            <img
              src="https://static.vecteezy.com/system/resources/previews/005/006/007/non_2x/no-item-in-the-shopping-cart-click-to-go-shopping-now-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
              alt="Empty Cart"
              id="cartImage"
            />
            <p id="cartNotFound">Your cart is empty!</p>
            <button
              onClick={() => navigate("/")}
              className="shop-now-button"
            >
              Shop Now
            </button>
          </div>
        </div>
      )}
    </>
  )}
</>

  );
}

export default Cart;
