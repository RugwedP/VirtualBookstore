import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./PlacedOrder.css";

function PlacedOrder() {
  const location = useLocation();
  const placedOrderPath = location.pathname;
  const [books, setBooks] = useState([]);
  const [isOrderPresent, setIsOrderPresent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let oID = localStorage.getItem("orderId");
    if (oID) {
      removeFromOrderSummary();
    } else {
      console.log("do nothing");
    }
  }, []);

  useEffect(() => {
    fetchPlacedItem();
  }, []);

  const removeFromOrderSummary = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/api/user/removeOrderSummary/${localStorage.getItem(
          "email"
        )}/${localStorage.getItem("orderId")}`
      );
      localStorage.removeItem("orderId");
    } catch (error) {
      console.error("Failed to remove book from Order Summary:", error);
    }
  };

  const fetchPlacedItem = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/user/getPlacedOrder/${localStorage.getItem(
          "email"
        )}`
      );

      console.log("Placed item", response.data);

      if (response.data.length !== 0) {
        console.log(response.data);

        setIsOrderPresent(true);
      }
      setBooks(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="custom-loader">
          <div className="loader-circle"></div>
        </div>
      ) : isOrderPresent ? (
        <div className="orders-container">
          {books.map((item, index) => (
            <div className="order-card" key={index}>
              <div className="order-content">
                <img
                  src={`http://localhost:8080/api/book${item.imageUrl}`}
                  alt={item.bookName}
                  className="order-image"
                />
                <div className="order-info">
                  <h3>{item.bookName}</h3>
                  <div className="order-price">
                    <p>
                      <strong>Price:</strong> ₹{item.price}
                    </p>
                    <div className="expected-delivery">
                      <p>
                        <strong>Expected Delivery:</strong> 3-5 Days
                      </p>
                    </div>
                    <button className="cancel-button">Cancel</button>
                  </div>
                </div>
              </div>
              <div className="order-bottom">
                <p>
                  <strong>Order Date:</strong> {item.date}
                </p>
              <p>
                <strong>Order Status: </strong>
                {item.orderStatus === 0 && <span className="orderPending">Pending</span>}
                {item.orderStatus === 1 && <span className="orderConfirm">Confirm</span>}
                {item.orderStatus === 2 && <span className="ordeReject">Rejected</span>}
                </p>

                <p>
                  <strong>Total Price:</strong> ₹{item.totalPrice}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="order-not-found">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/man-finding-nothing-in-order-illustration-download-svg-png-gif-file-formats--empty-states-no-yet-person-pack-network-communication-illustrations-3309936.png"
            alt="No Orders Found"
            className="order-not-found-image"
          />
          <p>No orders found</p>
        </div>
      )}
    </>
  );
}

export default PlacedOrder;
