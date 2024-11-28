import React from "react";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BookDetails.css";
import Swal from "sweetalert2";


export default function BookDetails() {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [isBookPresent, setIsBookPresent] = useState(true);

  const [book, setBook] = useState(null); // book initially null
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("inside useeffect");

    const getBook = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/book/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setBook(response.data.book);
        console.log("response is",response.data);
      } catch (error) {
        console.error("Failed to fetch book details", error);
      }
    };
    getBook();
    // console.log(book.description);
  }, [id]);

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`); // Navigate to the new book details page
    setIsSearchActive(false); // Hide search results
  };

  function provideSwalMessage()
  {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't delete this book!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then( async (result) => {
      if (result.isConfirmed) {
        try {
        await deleteBook()
          Swal.fire({
            title: "Deleted!",
            text: "Your Book has been deleted.",
            icon: "success"
          });
          navigate('/home')
        } catch (error) {
          
          Swal.fire({
            title: "Error!",
            text: "There was an error Deleting the book.",
            icon: "error"
          });
        }
       
      }
     
    });
  }

  const deleteBook = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/book/deleteBook/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
    
    
      
    } catch (error) {
      
      console.log(error);
    }

  };
 


  // console.log(book.imagePath);
  
  return (
    <>
      <Navbar
        setSearchResult={setSearchResult}
        setIsSearchActive={setIsSearchActive}
        isBookNotFound={setIsBookPresent}
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
          </div>
        ) : (
          <h3 className="noSerachFound">No books found for your search.</h3>
        )
      ) : (
        <>
            <div className="mycontainer3">
          {book ? (
            <div className="book-details">
            <img src={`http://localhost:8080/api/book${book.imageUrl}`} alt={book.name} />
            {console.log("image is "+book.imagePath)}
            
              <div className="book-details-info">
                <h3 className="bookname">{book.name}</h3>
                <p>
                  <strong>Author:</strong> {book.author}
                </p>
                <p>
                  <strong>Price:</strong> ₹ {book.price}
                </p>
                <p>
                  <strong>Available Books:</strong> {book.numberOfBooks}
                </p>
                <p>
                 {book.description}
                </p>
                <div className="buttons" id="myButtonsUD">
                    <button type="button"  className="btn btn-danger" id="deleteButton" onClick={()=> provideSwalMessage() }>Delete</button>
                    <button type="button" className="btn btn-warning"id="updateButton" onClick={()=>navigate(`/updateBook/${book.id}`)}>Update</button>
                </div>
              </div>
            </div>
           
          ) : (
            <h2>Loading book details...</h2>
          )}
         </div>
        </>
      )}
    </>
  );
}
