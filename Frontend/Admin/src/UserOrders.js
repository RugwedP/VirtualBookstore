import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UserOrders.css";
import Navbar from "./Navbar";
import Swal from "sweetalert2";

function UserOrders() {
  const [orderItems, setOrderItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const[adminName,setAdminName] = useState("")
  const[date,setDate]= useState("")
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {

      const currentAdmin = await axios.get("http://localhost:8080/api/admin/getCurrentAdminUsername")

      setAdminName(currentAdmin.data[0].username);
      

      const response = await axios.get("http://localhost:8080/api/user/userPlacedOrders");
      console.log("the response is",response.data);
      
      const updatedOrders = response.data.map((order) => ({
        ...order,
        confirmationStatus: order.orderConfirmOrReject?.isOrderConfirm === 1
          ? "confirmed"
          : order.orderConfirmOrReject?.isOrderConfirm === 0
          ? "rejected"
          : null,
        adminUsername: order.orderConfirmOrReject?.adminUsername || null,
      }));
      console.log("updated orders",updatedOrders);
      
      setOrderItems(updatedOrders);
    } catch (error) {
      console.error("Error fetching user orders", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleConfirm = async (id) => {
    console.log("Id is",id);
    
    Swal.fire({
      icon: "info",
      title: "Confirm Order!",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Call API to confirm the order
         const response= await axios.post(
            `http://localhost:8080/api/admin/isOrderConfirmOrRejectByAdmin/${id}/1/${adminName}`
          );
          
          console.log("my response",response);
          
          const updatedDate = response.data.date || null;
          
          await axios.put(
            `http://localhost:8080/api/user/updateOrderStatus/${id}/1`
          );
  
          Swal.fire({
            icon: "success",
            title: "Order Confirmed!",
          });
  
          // Update the local state
          setOrderItems((prevOrders) =>
            prevOrders.map((order) =>
              order.placedOrderId === id
                ? { ...order, confirmationStatus: "confirmed" ,
                  adminUsername: adminName,
                 orderConfirmOrReject:{
                  ...order.orderConfirmOrReject,
                  date:updatedDate
                 },
                }
                : order
            )
          );
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Failed to Confirm Order!",
            text: error.message,
          });
        }
      }
    });
  };

  const handleReject = async (id) => {
    Swal.fire({
      icon: "info",
      title: "Reject Order!",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Call API to reject the order

       
        const response=  await axios.post(
            `http://localhost:8080/api/admin/isOrderConfirmOrRejectByAdmin/${id}/0/${adminName}`
          );
  
          const updatedDate = response.data.date || null;
          await axios.put(
            `http://localhost:8080/api/user/updateOrderStatus/${id}/2`
          );
  
          Swal.fire({
            icon: "success",
            title: "Order Rejected!",
          });
  
          // Update the local state
          setOrderItems((prevOrders) =>
            prevOrders.map((order) =>
              order.placedOrderId === id
                ? { ...order, confirmationStatus: "rejected",
                  adminUsername: adminName,
                  orderConfirmOrReject: {
                    ...order.orderConfirmOrReject,
                    date: updatedDate,
                  },
                 }
                : order
            )
          );
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Failed to Reject Order!",
            text: error.message,
          });
        }
      }
    });
  };
  

  const handleClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <>
      <Navbar />
      {isLoading ? (
        <div className="custom-loader">
          <div className="loader-circle"></div>
        </div>
      ) : (
        <div className="cart-container">
          <h4 id="userOrderTitle">User Orders</h4>
          <div className="cart-items">
          {orderItems.map((item) => (
  <div key={item.id} className="cart-item">
    <img
      src={`http://localhost:8080/api/book${item.imageUrl}`}
      alt={item.bookTitle}
      className="cart-item-image"
      onClick={() => handleClick(item.bookId)}
    />
    <div className="cart-item-details">
      <h4>{item.bookName}</h4>
      <p>Price: ₹{item.price}</p>
      <p>Quantity: {item.quantity}</p>
      <p>Address: {item.user.address}</p>
      <p>Pincode: {item.user.pinCode}</p>
      <p>Total Price: ₹{item.totalPrice}</p>
      <p>Ordered Date:{item.date}</p>
      {item.confirmationStatus === "confirmed" ? (
        <span className="status-confirm">
          Order Confirmed By Admin: <b className="adminName">{item.adminUsername}</b><br></br>
          Confirm Date : <b>{item.orderConfirmOrReject.date}</b>
        </span>
      ) : item.confirmationStatus === "rejected" ? (
        <span className="status-reject">
          Order Rejected By Admin: <b className="adminName">{item.adminUsername}</b><br></br>
          Rejected Date : <b>{item.orderConfirmOrReject.date}</b>
        </span>
      ) : (
        <div className="order-actions">
          <button
            className="confirm-button"
            onClick={() => handleConfirm(item.placedOrderId)}
          >
            Confirm
          </button>
          <button
            className="reject-button"
            onClick={() => handleReject(item.placedOrderId)}
          >
            Reject
          </button>
        </div>
      )}
    </div>
  </div>
))}

          </div>
        </div>
      )}
    </>
  );
}

export default UserOrders;
