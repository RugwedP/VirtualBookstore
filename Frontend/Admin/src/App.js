import Homepage from "./Homepage";
import Myadminlogin from "./Myadminlogin";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Privateroute from "./Privateroute";
import BookDetails from "./BookDetails";
import Addbook from "./Addbook";
import UpdateBook from "./UpdateBook"
import UserOrders from "./UserOrders";
function App() {
  return (
    <>

      <Router>

        <Routes>
          <Route path="/" element={<Myadminlogin />} />
          <Route path="/home" element={
            <Privateroute>
              <Homepage />
            </Privateroute>
          } />

          <Route path="/book/:id"  element={<BookDetails/>} />
          <Route path="/addbook" element={<Addbook/>} />
          <Route path="/updateBook/:id" element={<UpdateBook></UpdateBook>} />
          
          <Route path="/orders" element={<UserOrders/>}></Route>

        </Routes>

      </Router>
    </>
  );
}

export default App;
