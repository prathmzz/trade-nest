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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  const fetchProducts = (query = "") => {
    setLoading(true); // Start loading
    setError(null); // Reset error state
    const url = query
      ? `http://localhost:5000/search-product${query}`
      : "http://localhost:5000/get-product";
    
    axios
      .get(url)
      .then((res) => {
        console.log(res.data.products, "fetched products");
        if (res.data.products) {
          setProducts(res.data.products);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Server error"); // Update error state
      })
      .finally(() => {
        setLoading(false); // Stop loading
      });
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search).toString();
    fetchProducts(query ? `?${query}` : "");

    return () => {
      // Cleanup can go here if necessary
    };
  }, [location]);

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
  };

  const closeProductView = () => {
    setSelectedProduct(null);
  };  

  return (
    <div className="homepage">
      <div className={`product-container ${selectedProduct ? "blurred" : ""}`}>
        {loading ? (
          <p>Loading...</p>
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
          <div
            className="product-view-container"
            onClick={(e) => e.stopPropagation()}
          >
            <ViewProduct
              product={selectedProduct}
              onClose={closeProductView}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
