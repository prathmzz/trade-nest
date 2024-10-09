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
      setFilters((prevFilters) => ({
        ...prevFilters,
        category: [...prevFilters.category, value],
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        category: prevFilters.category.filter((item) => item !== value),
      }));
    }
  };

  const handlePriceChange = (e) => {
    setFilters({ ...filters, priceRange: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Applied Filters:", filters);
    
    const postFilters = filters.category.length || filters.priceRange ? filters : {}; // Send empty if no filters
    try {
      const response = await axios.post('http://localhost:5000/api/home/get-product', postFilters);
      console.log('Filtered products:', response.data); 
      setProducts(response.data.products); // Update products based on filtered data
    } catch (error) {
      console.error('Error filtering products:', error); 
    }
  };

  return (
    <div className="sidebar">
      <Form onSubmit={handleSubmit}>

        {/* Category Filter */}
        <Accordion defaultActiveKey="0" className="mt-3">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Categories</Accordion.Header>
            <Accordion.Body>
              {categories.map((category, index) => (
                <div key={index}>
                  <Form.Check
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
              <Form.Check
                type="radio"
                name="priceRange"
                label="$0 - $50"
                value="$0-$50"
                onChange={handlePriceChange}
              />
              <div className="filter-divider"></div>
              <Form.Check
                type="radio"
                name="priceRange"
                label="$50 - $100"
                value="$50-$100"
                onChange={handlePriceChange}
              />
              <div className="filter-divider"></div>
              <Form.Check
                type="radio"
                name="priceRange"
                label="$100 - $200"
                value="$100-$200"
                onChange={handlePriceChange}
              />
            </Accordion.Body>
          </Accordion.Item>

        </Accordion>

        {/* Apply Button */}
        <Button className="mt-3" variant="primary" type="submit">
          Apply Filters
        </Button>
      </Form>
    </div>
  );
};

export default Sidebar;
