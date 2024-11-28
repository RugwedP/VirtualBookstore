import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Addboook.css";
import './UpdateBook.css';
import Swal from 'sweetalert2'  
import Navbar from "./Navbar";
function UpdateBook() {
  const [bookName, setBookName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [price, setPrice] = useState("");
  const [numberOfBooks, setNumberOfBooks] = useState(0);
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [isBookPresent, setIsBookPresent] = useState(true);
  const[categories,setCategories] = useState([])

  useEffect( ()=>{
    fetchCategories()
  },[] )

  const fetchCategories = async ()=>{
    try {
      const response = await axios.get("http://localhost:8080/api/book/getCategory")
      setCategories(response.data)
      console.log("categories are",response.data);
      

    } catch (error) {
      
    }
  }

  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch the book details on component mount
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/book/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const bookData = response.data.book;
        let category = response.data.category;
        console.log("response is",response.data);
        
        setBookName(bookData.name);
        setAuthorName(bookData.author);
        setPrice(bookData.price);
        setNumberOfBooks(bookData.numberOfBooks);
        setCategoryName(response.data.category);
        setDescription(bookData.description);
        setImage(bookData.imageUrl); // You may need to handle the image separately
      } catch (error) {
        console.error("Failed to fetch book details", error);
      }
    };

    fetchBookDetails();
  }, [id]);
  console.log(id);
  
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const updatedBook = {
      name: bookName,
      author: authorName,
      price: price,
      numberOfBooks:numberOfBooks,
      category: categoryName,
      description: description,
    };

    console.log(typeof updatedBook.numberOfBooks);
    
    formData.append(
      "book",
      new Blob([JSON.stringify(updatedBook)], { type: "application/json" })
    );

    if (image) {
      formData.append("image", image);
    }
    Swal.fire({
      title: "Are you sure?",
      text: "You won't to update this book!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await proideSwlMessage(); // Call the function here after confirmation
          Swal.fire({
            title: "Updated!",
            text: "Your Book has been Updated.",
            icon: "success"
          });
          navigate(`/book/${id}`);
        } catch (error) {
          console.error("Failed to update book", error);
          Swal.fire({
            title: "Error!",
            text: "There was an error updating the book.",
            icon: "error"
          });
        }
      }
    });
    
    async function proideSwlMessage()
    {
      try {
        const response = await axios.patch(
          `http://localhost:8080/api/book/updateBook/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
  
        
      } catch (error) {
          console.log(error);
          
       
      }
  
    }
   
  };

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`); // Navigate to the new book details page
    setIsSearchActive(false); // Hide search results
  };

  return (
    <>
    
    <Navbar 
    setSearchResult={setSearchResult}
    setIsSearchActive={setIsSearchActive}
    isBookNotFound={setIsBookPresent}
    ></Navbar>

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
      ):(<div className="container" id="addBookContainer2" >
        <h3 id="heading">Update Book</h3>
        <form onSubmit={handleSubmit}>
  <div className="form-group">
    <label htmlFor="title" className="form-label">Book Name:</label>
    <input
      type="text"
      className="form-control"
      value={bookName}
      onChange={(e) => setBookName(e.target.value)}
      id="title"
      name="title"
      placeholder="Enter Book Name"
      required
    />
  </div>

  <div className="form-group">
    <label htmlFor="author" className="form-label">Author:</label>
    <input
      type="text"
      className="form-control"
      id="author"
      value={authorName}
      onChange={(e) => setAuthorName(e.target.value)}
      name="author"
      placeholder="Enter Author Name"
      required
    />
  </div>

  <div className="form-group">
    <label htmlFor="quantity" className="form-label">Number of Books:</label>
    <input
      type="number"
      className="form-control"
      value={numberOfBooks}
      onChange={(e) => setNumberOfBooks(e.target.value)}
      id="numberOfBooks"
      name="numberOfBooks"
      placeholder="Enter Quantity"
      required
    />
  </div>

  <div className="form-group">
    <label htmlFor="price" className="form-label">Price:</label>
    <input
      type="number"
      className="form-control"
      value={price}
      onChange={(e) => setPrice(e.target.value)}
      id="price"
      name="price"
      placeholder="Enter Price"
      required
    />
  </div>

  {/* <div className="form-group">
    <label htmlFor="category" className="form-label">Category:</label>
    <input
      type="text"
      className="form-control"
      id="category"
      value={categoryName}
      onChange={(e) => setCategoryName(e.target.value)}
      name="category"
      placeholder="Enter Category"
      required
    />
  </div> */}

<div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            className="form-control"
            id="category"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          >
            <option value="" disabled>Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>


  <div className="form-group">
    <label htmlFor="description" className="form-label">Description:</label>
    <textarea
      id="description"
      className="form-control"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Enter Description"
      required
    />
  </div>

  <div className="form-group">
    <label htmlFor="image" className="form-label">Upload Image:</label>
    <input
      type="file"
      id="image"
      className="form-control w-100"
      accept="image/*"
      onChange={handleImageChange}
    />
    {image && typeof image === "string" && (
      <img src={`http://localhost:8080/api/book${image}`} alt={bookName} style={{ marginTop: "10px", width: "150px" }} />
    )}
  </div>

  <div className="myButtons">
    <button type="submit" className="btn btn-primary" id="addButton">
      Update Book
    </button>
    <button
      type="button"
      className="btn btn-secondary"
      id="homeButton"
      onClick={() => navigate(`/book/${id}`)}
    >
      Book Details
    </button>
  </div>
</form>
      </div>
      )}
    
    </>
  );
}

export default UpdateBook;
