import React, { useState, useContext } from 'react';
import { Stack, Form, Button, Container, Card, Alert } from 'react-bootstrap'; // Import Bootstrap components
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext to access user data

function AddProduct() {
  const { user } = useContext(AuthContext); // Get user from AuthContext
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState(''); // For error messages
  const [success, setSuccess] = useState(''); // For success messages
  const navigate = useNavigate(); // Initialize useNavigate

  const handleApi = async () => {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('price', price);
    formData.append('image', image);
    formData.append('email', user.email); // Include user's email in FormData

    const url = 'http://localhost:5000/add-product';

    try {
      const res = await axios.post(url, formData);
      console.log(res);
      setSuccess('Product added successfully!'); // Set success message
      setError(''); // Clear any previous error messages
      setDescription(''); // Clear the form
      setPrice('');
      setImage(null);
      setTimeout(() => {
        navigate('/'); // Redirect after 2 seconds
      }, 2000);
    } catch (err) {
      console.log(err);
      setError('Failed to add product. Please try again.'); // Set error message
      setSuccess(''); // Clear any previous success messages
    }
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

          {/* Show success or error messages */}
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="productDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={description}
                rows={3}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="productPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="productImage">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required // Make image upload required
              />
            </Form.Group>

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
