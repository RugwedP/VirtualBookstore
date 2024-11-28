import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Swal from "sweetalert2";
import "./BookDetails.css";
import '@fortawesome/fontawesome-free/css/all.css';

export default function BookDetails() {
  const [book, setBook] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [isBookPresent, setIsBookPresent] = useState(true);
  const [isLogIn, setIsLogIn] = useState(!!localStorage.getItem("username"));

  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch book details on component load
  useEffect(() => {
    setBook(null)
    const getBook = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/${id}`);
        setBook(response.data.book);
      } catch (error) {
        console.error("Failed to fetch book details", error);
      }
    };
    getBook();
  }, [id]);

  // Function to handle "Add to Cart" button click
  const addToCart = async () => {
    try {



      await axios.post(`http://localhost:8080/api/cart/${book.id}/${localStorage.getItem("email")}`);
      Swal.fire({
        title: "Added to Cart!",
        text: `${book.name} has been added to your cart.`,
        icon: "success",
      }).then(() => {
        navigate("/cart");  // Redirect to cart page after adding
      });
    } catch (error) {
      console.log(error);
      
      // Swal.fire({
      //   title: "Error!",
      //   text: "There was an error adding the book to the cart.",
      //   icon: "error",
      // });
      navigate("/loginUser")
    }
  };

  // Function to handle "Buy Now" button click
  const handleBuyNow = () => {
    if(isLogIn)
    {

      navigate(`/checkout/${id}`); // Adjust this path to your checkout component
    }
    else
    {
      navigate("/loginUser")
    }
  };

  useEffect( ()=>{
    if(localStorage.getItem("orderId"))
      {

        removeFromOrderSummary()
      }
  },[localStorage.getItem("orderId")] )
 
  const removeFromOrderSummary = async () => {
    try {
      console.log("inside removeorderSummary");
      await axios.delete(`http://localhost:8080/api/user/removeOrderSummary/${localStorage.getItem("email")}/${localStorage.getItem("orderId")}`);
      console.log("Book removed from Order Summary.");
      localStorage.removeItem("orderId")
    } catch (error) {
      console.error("Failed to remove book from Order Summary:", error);
    }
  };

  const handleBookClick = (bookId) => {
    setIsSearchActive(false);  // Close search view
    navigate(`/book/${bookId}`);
  };
  

  return (
    <>
      <Navbar
        setSearchResult={setSearchResult}
        setIsSearchActive={setIsSearchActive}
        isBookNotFound={setIsBookPresent}
        showSearchAndLogin={true}
        isLogIn={setIsLogIn}
      />

      {isSearchActive ? (
        isBookPresent ? (
          <div className="mainContainer">
            <div className="search-results-container">
              <h3 className="searchResult">Search Results</h3>
              <div className="books-grid">
                {searchResult.map((book) => (
                  <div
                    className="book-card"
                    key={book.id}
                    onClick={() => handleBookClick(book.id)}
                  >
                    <img src={`http://localhost:8080/api/book${book.imageUrl}`} alt={book.name} />
                    <h3>{book.name}</h3>
                    <p><strong>Author:</strong> {book.author}</p>
                    <p><strong>Price:</strong> ₹ {book.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <h3 className="noSerachFound">No books found for your search.</h3>
        )
      ) : (
        <div className="mycontainer3">
          {book ? (
            <div className="book-details">
              <img src={`http://localhost:8080/api/book${book.imageUrl}`} alt={book.name} />
              <div className="book-details-info">
                <h3 className="bookname">{book.name}</h3>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Price:</strong> ₹ {book.price}</p>
                <p>{book.description}</p>
                <div className="buttons" id="myButtonsUD">
                  <button
                    type="button"
                    className="btn"
                    id="addtocart"
                    onClick={addToCart}
                  >
                    <i className="fa-solid fa-cart-shopping" id="shopIcon"></i>
                    ADD TO CART
                  </button>
                  <button
                    type="button"
                    className="btn"
                    id="buynow"
                    onClick={handleBuyNow}
                  >
                    <i className="fa-solid fa-bolt" id="buyIcon"></i>
                    BUY NOW
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <h2>Loading book details...</h2>
          )}
        </div>
      )}
    </>
  );
}
