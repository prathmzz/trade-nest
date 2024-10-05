import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './HomePage.css';
import ProductViewCard from "../Components/viewProduct";  // Correct import to match the component name

function HomePage() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // State for selected product
  const location = useLocation();

  const fetchProducts = (query = '') => {
    const url = query ? `http://localhost:5000/search-product${query}` : 'http://localhost:5000/get-product';
    axios.get(url)
      .then((res) => {
        console.log(res.data.products, "fetched products");
        if (res.data.products) {
          setProducts(res.data.products);
        }
      })
      .catch((err) => {
        console.log(err);
        alert('Server error');
      });
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search).toString();
    fetchProducts(query ? `?${query}` : '');
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
          products.map((item, index) => (
            <div key={index} className="product-card" onClick={() => handleViewProduct(item)}>
              <img src={`http://localhost:5000/${item.image}`} alt={item.name} className="product-image" />
              <p className="product-description">{item.description}</p>
              <p className="product-price">Price: ₹{item.price}</p>
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>

      {/* Show ProductViewCard if a product is selected */}
      {selectedProduct && (
        <div className="blur-background" onClick={closeProductView}>
          <div className="product-view-container" onClick={(e) => e.stopPropagation()}>
            <ProductViewCard
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