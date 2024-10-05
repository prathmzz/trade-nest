import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home"; // Import Home component
import AddProduct from "./Components/Addproduct";
import "bootstrap/dist/css/bootstrap.min.css"
import { Container }from "react-bootstrap"
import Navbar from "./Components/Navbar";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";


function App() {
  const {user} = useContext(AuthContext)
  return (
    <>
   
    <Navbar/>
    <Container >
      <Routes>
      
        <Route path="/" element={user ? <Home />:<Login/>} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/register" element={user ? <Home/>: <Register/>} />
        <Route path="/login" element={user ? <Home/>: <Login/>} />
        <Route path="*" element={<Navigate to="/" />} />
        
      </Routes>
      </Container>
    </>
  );
}

export default App;