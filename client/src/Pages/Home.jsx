import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./HomePage.css";
import ViewProduct from "../Components/ViewProduct"; // Ensure correct casing and extension
import ProductCard from "../Components/ProductCard"; // Ensure correct casing and extension
import { AuthContext } from "../context/AuthContext";

function HomePage() {
  const [products, setProducts] = useState([]);
  const { user, logoutUser } = useContext(AuthContext);
  const [selectedProduct, setSelectedProduct] = useState(null); // State for selected product
  const location = useLocation();

  const fetchProducts = (query = "") => {
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
        console.log(err);
        alert("Server error");
      });
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search).toString();
    fetchProducts(query ? `?${query}` : "");
  }, [location]);

  const handleViewProduct = (product) => {
    setSelectedProduct(product); // Set the clicked product
  };

  const closeProductView = () => {
    setSelectedProduct(null); // Clear the selected product to close the view
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

      {/* Show ProductViewCard if a product is selected */}
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
