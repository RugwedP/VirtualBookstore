import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HistoryCategory.css";

function HistoryCategory({handleClick}) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/user/category/2",
          // {
          //   headers: {
          //     Authorization: `Bearer ${localStorage.getItem("token")}`,
          //   },
          // }
        );
        setBooks(response.data);
        console.log("response data", response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <>
     
        <div className="History-container">
          <h3>History </h3>
          <div className="books-grid">
            {books.slice(0,4).map((book) => (
              <div className="book-card" key={book.id}
                  onClick={()=> handleClick(book.id)}
              >
                <div>
                <img src={`http://localhost:8080/api/book${book.imageUrl}`} alt={book.name}/>
                </div>
                <h3>{book.name}</h3>
                <p>
                  <strong>Author:</strong> {book.author}
                </p>
                <p>
                  <strong>Price:</strong> ₹ {book.price}
                </p>
              </div>
            ))}
          </div>
        </div>


       
    </>
    
  );
}

export default HistoryCategory;
