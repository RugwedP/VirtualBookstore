import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import HistoryCategory from "./HistoryCategory";
import ScienceCategory from "./ScienceCategory";
import HorrorCategory from "./HorrorCategory";
import './Homepage.css'
import KidsCategory from "./KidsCategory";
function Homepage({}) {
  const location = useLocation()
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const[isBookPresent,setIsBookPresent] = useState(true)
  const [message, setMessage] = useState(localStorage.getItem("deleteMessage") || "");


  const navigate = useNavigate()
  
  const handleClick = (bookId)=>{
    console.log("inside handleClick");
    
      navigate(`/book/${bookId}`)
  }

  // if (message) {
  //   setTimeout(() => {
  //     setMessage("");
  //   }, 3000);
  // }

  useEffect( ()=>{
    if(message)
      {
          setTimeout( ()=>{
              setMessage("")
              localStorage.removeItem("deleteMessage")
          },3000 )
      } 
  },[message] )
 
 
  

  return (
    <>
      <Navbar setSearchResult={setSearchResult} setIsSearchActive={setIsSearchActive} isBookNotFound={setIsBookPresent} />
      <Navbar setSearchResult={setSearchResult} setIsSearchActive={setIsSearchActive} isBookNotFound={setIsBookPresent} />
      {message && (
        <div className="deleteMessage">
          {message}
        </div>
      )}
        
      {isBookPresent ? (
        isSearchActive ? (
          <div className="myDiv">
            <div className="search-results-container">
              <div className="searchResult">
                <h3>Search Results</h3>
              </div>
              <div className="books-grid">
                {searchResult.map((book) => (
                  <div className="book-card" key={book.id}
                      onClick={()=>handleClick(book.id)}
                  >
                    <div>
                    <img src={`http://localhost:8080/api/book${book.imageUrl}`} className="myImage" alt={book.name}/>
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
          <>
            {/* Show category books when search is not active */}
            <HistoryCategory handleClick={handleClick} />
            <ScienceCategory handleClick={handleClick} />
            <HorrorCategory  handleClick={handleClick}/>
            <KidsCategory handleClick={handleClick}/>
          </>
        )
      ) : (
        <div className="no-books-message">
          <h3>No books found for your search.</h3>
        </div>
      )}
    </>
  );
}

export default Homepage;
