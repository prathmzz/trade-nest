import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // Import heart icons
import "./ProductCard.css";

const ProductCard = ({ user, item, handleViewProduct }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (user && user.favorites && user.favorites.includes(item._id)) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  }, [user, item]);

  const toggleFavorite = async (e) => {
    e.stopPropagation(); // Prevent triggering handleViewProduct
    try {
      const response = await fetch(`http://localhost:5000/api/users/favourites/${user._id}/favorites`, {
        method: isFavorite ? "DELETE" : "POST",
        body: JSON.stringify({ productId: item._id }), // Corrected from product._id to item._id
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setIsFavorite(!isFavorite);
      } else {
        const errorData = await response.json();
        console.error("Failed to toggle favorite:", errorData.message);
        alert("Failed to toggle favorite. Please try again.");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="product-card" onClick={() => handleViewProduct(item)}>
      <img
        src={`http://localhost:5000/${item.image}`}
        alt={item.name}
        className="product-image"
      />
      <p className="product-description">{item.description}</p>
      <p className="product-price">Price: ₹{item.price}</p>
      <div className="like-button" onClick={toggleFavorite} style={{ cursor: "pointer" }}>
        {isFavorite ? <FaHeart color="red" /> : <FaRegHeart />}
      </div>
      
    </div>
  );
};

export default ProductCard;
