import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./HomePage.css";
import ViewProduct from "../Components/ViewProduct"; 
import ProductCard from "../Components/ProductCard"; 
import { AuthContext } from "../context/AuthContext";

function HomePage() {
  const [products, setProducts] = useState([]);
  const { user, logoutUser } = useContext(AuthContext);
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const location = useLocation();

  const fetchProducts = async (query = "") => {
    const url = query
      ? `http://localhost:5000/search-product${query}`
      : "http://localhost:5000/get-product";
    try {
      const res = await axios.get(url, {
        params: { email: user.email } // Include the user's email in the request
      });
      console.log(res.data.products, "fetched products");
      if (res.data.products) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch products on component mount
  }, [location, user.email]); // Add user.email to the dependency array to refetch on email change

  const handleViewProduct = (product) => {
    setSelectedProduct(product); 
  };

  const closeProductView = () => {
    setSelectedProduct(null); 
  };

  return (
    <div className="homepage">
      <div className={`product-container ${selectedProduct ? "blurred" : ""}`}>
        {products && products.length > 0 ? (
          products.map((item) => (
            <ProductCard
              key={item._id}
              item={item}
              user={user}
              handleViewProduct={handleViewProduct}
            />
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>

      {selectedProduct && (
        <div className="blur-background" onClick={closeProductView}>
          <div className="product-view-container" onClick={(e) => e.stopPropagation()}>
            <ViewProduct product={selectedProduct} onClose={closeProductView} />
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
