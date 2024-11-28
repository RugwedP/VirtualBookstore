import Homepage from './Homepage'

// import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BookDetails from "./BookDetails";
import UserDetails from './UserDetails';
import UserLogin from './UserLogin';
import { useState } from 'react';

import Navbar from './Navbar';
import Cart from './Cart';
import Profile from './Profile';
import Checkout from './Checkout';
import PlacedOrder from './PlacedOrder';
import CheckouCart from './CheckouCart';
// import Addbook from "./Addbook";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Moved login state here
  const [username, setUsername] = useState(null);        // Moved username here
  return (
    <>

      <Router>
      <Navbar isLoggedIn={isLoggedIn} username={username} showSearchAndLogin={false} />

        <Routes>
          <Route path="/" element={<Homepage />} />
          
          
        
          <Route path="/book/:id"  element={<BookDetails/>} />

          <Route path="/signUp"  element={<UserDetails/>} />

          {/* <Route path='/loginUser' element={<UserLogin/>}/> */}

          <Route path='/loginUser' element={<UserLogin setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />} />

          <Route path='/cart' element={<Cart/>}></Route>
          <Route path='/profile' element={<Profile/>}></Route>
          <Route path='/profile/:id' element={<Profile />}></Route>
          <Route path="/checkout" element={<Checkout/>}></Route>
          <Route path="/checkout/:id" element={<Checkout/>}></Route>
          <Route path='/orders' element={<PlacedOrder/>}></Route>

          <Route path='/checkoutCart' element={<CheckouCart/>}></Route>

        </Routes>

      </Router>
    </>
  );
}

export default App;
