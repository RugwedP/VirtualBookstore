import React, { useState, useEffect } from "react";
import "./Navbar.css"; // For custom styling
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

function Navbar({ setSearchResult, setIsSearchActive, isBookNotFound }) {
  const [menuOpen, setMenuOpen] = useState(false); // Controls sidebar visibility
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState();

  const toggleMenu = () => setMenuOpen(!menuOpen); // Toggle sidebar visibility

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't to logout!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (localStorage.getItem("token")) {
          const response = await axios.delete(
            "http://localhost:8080/api/user/deleteAdminUsername"
          );
          console.log(response);
        }

        Swal.fire({
          title: "Logout Successful!",
          icon: "success",
        });

        localStorage.removeItem("token");
        navigate("/");
      }
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log(searchText);

    try {
      const response = await axios.get(
        `http://localhost:8080/api/book/books/search?keyword=${searchText}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.length > 0) {
        setSearchResult(response.data);
        setIsSearchActive(true);
        isBookNotFound(true);
      } else {
        console.log("No books found for your search");
        isBookNotFound(false);
        setIsSearchActive(true);
      }
    } catch (error) {
      console.log("An error occurred", error);
    }
  };

  // Close sidebar when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && !e.target.closest(".sidebar") && !e.target.closest(".hamburger")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/home" className="navbar-brand">
            BookStore
          </Link>

          {/* Search Form */}
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              placeholder="Search for books"
              className="search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>

          {/* Toggle Button */}
          <button className="hamburger" id="hamburger" onClick={toggleMenu}>
            <i className="bi bi-list"></i>
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        {/* Close Button inside Sidebar */}
        <button className="sidebar-close" onClick={() => setMenuOpen(false)}>
          <i className="bi bi-x"></i>
        </button>
        <ul>
          <li onClick={() => navigate("/addbook")}>
            <i className="bi bi-journal-plus"></i> Add Book
          </li>
          <li onClick={() => navigate("/orders")}>
            <i className="bi bi-bag-check"></i> Orders
          </li>
          <li onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i> Logout
          </li>
        </ul>
      </div>
    </>
  );
}

export default Navbar;
