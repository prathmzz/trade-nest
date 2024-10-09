import React, { useState } from "react";
import { Form, Button, Accordion } from "react-bootstrap";
import './Sidebar.css'; // Ensure you have this CSS file for styling

const Sidebar = () => {
  const [filters, setFilters] = useState({
    category: [],
    priceRange: "",
    brand: [],
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

  const handleBrandChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        brand: [...prevFilters.brand, value],
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        brand: prevFilters.brand.filter((item) => item !== value),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Applied Filters:", filters);
    // You can now use filters to fetch filtered products
  };

  return (
    <div className="sidebar">
     
      <Form onSubmit={handleSubmit}>
        
        {/* <Form.Group controlId="searchBar">
          <Form.Label>Search</Form.Label>
          <Form.Control type="text" placeholder="Search for products" />
        </Form.Group> */}

        {/* Category Filter */}
        <Accordion defaultActiveKey="0" className="mt-3">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Categories</Accordion.Header>
            <Accordion.Body>    
              <Form.Check
                type="checkbox"
                label="Electronics"
                value="Electronics"
                onChange={handleCategoryChange}
              />
              <Form.Check
                type="checkbox"
                label="Clothing"
                value="Clothing"
                onChange={handleCategoryChange}
              />
              <Form.Check
                type="checkbox"
                label="Books"
                value="Books"
                onChange={handleCategoryChange}
              />
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
              <Form.Check
                type="radio"
                name="priceRange"
                label="$50 - $100"
                value="$50-$100"
                onChange={handlePriceChange}
              />
              <Form.Check
                type="radio"
                name="priceRange"
                label="$100 - $200"
                value="$100-$200"
                onChange={handlePriceChange}
              />
            </Accordion.Body>
          </Accordion.Item>

          {/* Brand Filter */}
          <Accordion.Item eventKey="2">
            <Accordion.Header>Brands</Accordion.Header>
            <Accordion.Body>
              <Form.Check
                type="checkbox"
                label="Apple"
                value="Apple"
                onChange={handleBrandChange}
              />
              <Form.Check
                type="checkbox"
                label="Samsung"
                value="Samsung"
                onChange={handleBrandChange}
              />
              <Form.Check
                type="checkbox"
                label="Sony"
                value="Sony"
                onChange={handleBrandChange}
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
