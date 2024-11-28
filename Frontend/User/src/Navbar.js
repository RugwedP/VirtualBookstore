
// export default Navbar;
import React, { useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar({
  setSearchResult,
  setIsSearchActive,
  isBookNotFound,
  showSearchAndLogin,
  isLogIn,
  setOid
}) {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const[username,setUsername] = useState(localStorage.getItem("username"))
 

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        `http://localhost:8080/api/user/books/search?keyword=${searchText}`
      );

      if (response.data.length > 0) {
        setSearchResult(response.data);
        setIsSearchActive(true);
        isBookNotFound(true);
      } else {
        isBookNotFound(false);
        setIsSearchActive(true);
      }
    } catch (error) {
      console.log("the error is"+error);
      
      console.log("The error occurred");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("fullName");
    localStorage.removeItem("email");

    setUsername(null); 
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  return (
    <nav className="navbar" id="navbar">
      <div className="navbar-container" id="navbar-container">
        <Link to="/" className="navbar-brand" id="navbar-brand">
          BookStore
        </Link>

        {showSearchAndLogin && (
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

            {!username ? (
              <button
                className="logout-button"
                id="loginButton"
                onClick={() => navigate("/loginUser")}
              >
                Login
              </button>
            ): (
              <div className="user-container">
                <div
                  className="user-with-icon"
                  onClick={toggleDropdown}
                  onMouseEnter={() => setDropdownVisible(true)}
                  onMouseLeave={() => setDropdownVisible(false)}
                >
                 

                  <i className="bi bi-person-circle" id="personIcon"></i>
                  <span>{localStorage.getItem("username")}</span>
               

                  {isDropdownVisible && (
                    <div className="dropdown-menu">

                      <Link to="/profile" className="dropdown-item">
                      <i className="bi bi-person" id="mySecondP"></i>My Profile
                      </Link>
                     
                      <Link to="/orders" className="dropdown-item">
                      <i className="bi bi-box-seam"id="myProfile"></i> Orders
                      </Link>
                      <button onClick={handleLogout} className="dropdown-item">
                      <i className="bi bi-box-arrow-right"id="myProfile"></i> Logout
                      </button>
                    </div>
                  )}
                </div>
                <div id="cartBtn">
                  <Link to={"/cart"}>
                    <button >
                      <i
                        className="fa-solid fa-cart-shopping"
                        id="shopIcon"
                      ></i>
                      Cart
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </nav>
  );
}
export default Navbar;