import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Addboook.css";
import Swal from 'sweetalert2'
function Addbook() {
  const navigate = useNavigate()
  const [bookName, setBookName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [price, setPrice] = useState("");
  const [numberOfBooks, setNumberOfBooks] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const[categories,setCategories] = useState([])
  const [successFlag, setSuccessFlag] = useState(null); // State to track if the operation was successful

  useEffect( ()=>{
    fetchCategories()
  },[] )

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!categoryName)
    {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Category not selected!",
       
      });
    }
    else
    {
      const formData = new FormData();
    // Creating a book object to be sent as a JSON string
    const book = {
      name: bookName,
      author: authorName,
      price: price,
      numberOfBooks: numberOfBooks,
      category: categoryName,
      description: description,
    };
    console.log(book);

    // Append the book JSON object and image to the FormData
    formData.append(
      "book",
      new Blob([JSON.stringify(book)], { type: "application/json" })
    );

    formData.append("image", image); // Append the image file
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    console.log(formData);
    
    try {
      const response = await axios.post(
        "http://localhost:8080/api/book/addBook",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Book added successfully:", response.data);
      console.log(response.status);
      console.log(response.data.statusCodeValue);

      if (response.data.statusCodeValue === 201) {
        setMessage("Book stored successfully");
        setSuccessFlag(true)        
        setBookName("");
        setAuthorName("");
        setCategoryName("");
        setDescription("");
        setPrice("");
        setNumberOfBooks("");
        setImage(null);
      } else if (response.data.statusCodeValue === 404) {
        setSuccessFlag(false)
        setMessage("category not present");
      }
    } catch (error) {
      setMessage("Error adding book. Please try again.");
      setSuccessFlag(false); // Set failure flag in case of error
    }

    setTimeout(() => {
      setMessage("");
      setSuccessFlag(null)
    }, 3000);
    }

    
  };

  const fetchCategories = async ()=>{
    try {
      const response = await axios.get("http://localhost:8080/api/book/getCategory")
      setCategories(response.data)
      console.log("categories are",response.data);
      

    } catch (error) {
      
    }
  }

  return (
    
    <div class="container" id="addBookContainer">
  
    <h1 className="mt-4" id="heading">Add Book</h1>
    <form onSubmit={handleSubmit}>
     
      <div className="form-group">
        <label htmlFor="title">Book Name:</label>
        <input type="text" className="form-control" value={bookName} onChange={(e) => setBookName(e.target.value)} id="title" name="title" placeholder="Enter Book Name" required/>
      </div>

      <div className="form-group">
        <label htmlFor="author">Author:</label>
        <input type="text" className="form-control" id="author"  value={authorName} onChange={(e) => setAuthorName(e.target.value)} name="author" placeholder="Enter Book Author Name" required/>
      </div>

      <div className="form-group">
        <label htmlFor="quantity">Number of Books:</label>
        <input type="number" className="form-control"  value={numberOfBooks}
               onChange={(e) => setNumberOfBooks(e.target.value)} id="quantity" name="quantity" placeholder="Enter Book Quantity" required/>
      </div>

      <div className="form-group">
        <label htmlFor="price">Price:</label>
        <input type="number" className="form-control"  value={price}
               onChange={(e) => setPrice(e.target.value)} id="price" name="price" placeholder="Enter Book Price" required/>
      </div>

      {/* <div className="form-group">
        <label for="publisher">Category:</label>
        <input type="text" className="form-control" id="publisher" value={categoryName}
               onChange={(e) => setCategoryName(e.target.value)} name="publisher" placeholder="Horror | Science| Sport | History | Kids" required/>
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

     


             <div className="mb-3">
             <label htmlFor="description" className="form-label">
              Description:
             </label>
             <textarea
              id="description"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="image" className="form-label">
              Upload Image:
            </label>
            <input
              type="file"
              id="image"
              className="form-control w-100"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>

     
        <div className="myButtons">
      <button type="submit" className="btn btn-primary" id="addButton"> Add Book</button>
      <button type="button" class="btn btn-secondary" onClick={()=>navigate('/home')} id="homeButton">Home</button>
      </div>
      
           {successFlag === true && (
             <div className="alert alert-success mt-3" id="myMessage">
               {message}
             </div>
           )}
           {successFlag === false && (
             <div className="alert alert-danger mt-3" id="myMessage">
               {message}
             </div>
           )}
    </form>
  </div>
  

       
  );
}

export default Addbook;
