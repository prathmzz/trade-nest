import React, { useState } from "react";
import { Form, Button, Accordion } from "react-bootstrap";
import './Sidebar.css'; // Ensure you have this CSS file for styling
import axios from "axios"; // Import Axios

const Sidebar = ({ setProducts }) => {
  const categories = [
    "Online Courses",
    "E-books",
    "Cycles",
    "Home Appliances",
    "Books",
    "Sports and Fitness",
    "Furniture",
    "Personal Items",
    "Stationary",
    "Electronics and Accessories",
    "Hostel and PG Supplies",
    "Study Materials",
    "Others"
  ];

  const [filters, setFilters] = useState({
    category: [],
    priceRange: "",
  });

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFilters((prevFilters) => {
        const newFilters = {
          ...prevFilters,
          category: [...prevFilters.category, value],
        };
        console.log('Updated Category Filters:', newFilters); // Log updated filters
        return newFilters;
      });
    } else {
      setFilters((prevFilters) => {
        const newFilters = {
          ...prevFilters,
          category: prevFilters.category.filter((item) => item !== value),
        };
        console.log('Updated Category Filters:', newFilters); // Log updated filters
        return newFilters;
      });
    }
  };
  
  const handlePriceChange = (e) => {
    const { value } = e.target;  // Get the selected price range value
    setFilters((prevFilters) => {
      const newFilters = {
        ...prevFilters,
        [name]: Number(value),
      };
      console.log('Updated Price Range Filter:', newFilters); // Log updated filters
      return newFilters;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Applied Filters:", filters);
    
    const postFilters = filters.category.length || filters.priceRange ? filters : {}; // Send empty if no filters
    console.log("Post Filters:", postFilters); // Log the filters being sent
    
    try {
      const response = await axios.post('http://localhost:5000/api/home/get-product', postFilters);
      console.log('Filtered products:', response.data); 
      setProducts(response.data.products); // Update products based on filtered data
    } catch (error) {
      console.error('Error filtering products:', error); 
      alert('Error applying filters. Please try again.'); // Notify user on error
    }
  };

  return (
    <div className="sidebar">
      <Form onSubmit={handleSubmit}>

        {/* Category Filter */}
        <Accordion defaultActiveKey="0" className="mt-3 custom-accordian">
          <Accordion.Item eventKey="0">
            <Accordion.Header className="custom-accordian" >Categories</Accordion.Header>
            <Accordion.Body className="custom-accordian">
              {categories.map((category, index) => (
                <div key={index}>
                  <Form.Check
                  className="custom-accordian"
                    type="checkbox"
                    label={category}
                    value={category}
                    onChange={handleCategoryChange}
                  />
                  <div className="filter-divider"></div> {/* Horizontal line */}
                </div>
              ))}
            </Accordion.Body>
          </Accordion.Item>

          {/* Price Range Filter */}
          <Accordion.Item eventKey="1">
            <Accordion.Header>Price Range</Accordion.Header>
            <Accordion.Body>
            <div>
                <Form.Label>Min Price: Rs. 0{filters.minPrice}</Form.Label>
                <Form.Range
                  name="minPrice"
                  min="0"
                  max={filters.maxPrice} // Max price can be adjusted as needed
                  value={filters.minPrice}
                  onChange={handlePriceChange}
                />
              </div>
              <div>
                <Form.Label>Max Price: Rs.1000{filters.maxPrice}</Form.Label>
                <Form.Range
                  name="maxPrice"
                  min={filters.minPrice} // Min price can’t go below current min
                  max="10000" // You can set this dynamically based on your product data
                  value={filters.maxPrice}
                  onChange={handlePriceChange}
                />
              </div>
            </Accordion.Body>
          </Accordion.Item>

        </Accordion>

        {/* Apply Button */}
        <Button className="mt-3" type="submit">
          Apply Filters
        </Button>
      </Form>
    </div>
  );
};

export default Sidebar;
