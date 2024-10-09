import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./HomePage.css";
import ViewProduct from "../Components/viewProduct"; 
import ProductCard from "../Components/ProductCard"; 
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../Components/Sidebar"; // Import the Sidebar component

function HomePage() {
  const [products, setProducts] = useState([]);
  const { user } = useContext(AuthContext);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  const fetchProducts = async (filters = {}) => {
    setLoading(true); // Start loading
    setError(null); // Reset error state

    try {
      const res = await axios.post("http://localhost:5000/api/home/get-product", filters);
      console.log(res.data.products, "fetched products");
      if (res.data.products) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Server error"); // Update error state
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch all products initially with no filters
  }, [location, user.email]);

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
  };

  const closeProductView = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="homepage">
      {/* Render the Sidebar and pass setProducts to update the product list */}
      <Sidebar setProducts={setProducts} />

      <div className={`product-container ${selectedProduct ? "blurred" : ""}`}>
        {loading ? (
          <p>Loading...</p> // Consider replacing with a spinner
        ) : error ? (
          <p>{error}</p>
        ) : products.length > 0 ? (
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
