import React, { useState } from 'react';
import { Stack, Form, Button, Container, Card, Row, Col } from 'react-bootstrap'; // Import Bootstrap components
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import axios from 'axios';

function AddProduct() {
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    category: '',
  });

  const [image, setImage] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleApi = () => {
    const url = 'http://localhost:5000/add-product';

    // Use FormData if you're uploading images
    const formData = new FormData();
    formData.append('title', newProduct.title);
    formData.append('description', newProduct.description);
    formData.append('price', newProduct.price);
    formData.append('location', newProduct.location);
    formData.append('category', newProduct.category);
    formData.append('image', image);

    axios.post(url, formData) // Send formData
      .then((res) => {
        console.log(res); 
        navigate('/'); // Redirect after successful submission
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleApi(); // Call handleApi to send data to the server
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title>Add New Product</Card.Title>
          <Form onSubmit={handleSubmit}>

            {/* Product Title */}
            <Form.Group className="mb-3" controlId="productTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newProduct.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Product Description */}
            <Form.Group className="mb-3" controlId="productDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={newProduct.description}
                rows={3}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Price and Category side by side */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="productPrice">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="productCategory">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    as="select"
                    name="category"
                    value={newProduct.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="online courses">Online Courses</option>
                    <option value="e-books">E-Books</option>
                    <option value="cycles">Cycles</option>
                    <option value="home appliances">Home Appliances</option>
                    <option value="books">Books</option>
                    <option value="sports and fitness">Sports and Fitness</option>
                    <option value="furniture">Furniture</option>
                    <option value="personal items">Personal Items</option>
                    <option value="stationery">Stationery</option>
                    <option value="electronics and accessories">Electronics and Accessories</option>
                    <option value="hostel and PG supplies">Hostel and PG Supplies</option>
                    <option value="study materials">Study Materials</option>
                    <option value="others">Others</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            {/* Location and Upload Image side by side */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="productLocation">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={newProduct.location}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="productImage">
                  <Form.Label>Upload Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button variant="primary" type="submit">
              Add Product
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AddProduct;
