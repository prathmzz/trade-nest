import React, { useContext, useState } from 'react';
import { Stack, Form, Button, Container, Card, Row, Col, Alert } from 'react-bootstrap'; 
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; 
import './AddProduct.css'; // Importing the CSS file

function AddProduct() {
  const { user } = useContext(AuthContext);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    category: '',
  });

  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleApi = async () => {
    const url = 'http://localhost:5000/add-product';

    const formData = new FormData();
    formData.append('title', newProduct.title);
    formData.append('description', newProduct.description);
    formData.append('price', newProduct.price);
    formData.append('location', newProduct.location);
    formData.append('category', newProduct.category);
    formData.append('image', image);
    formData.append('email', user.email);

    try {
      const res = await axios.post(url, formData);
      console.log(res);
      setSuccess('Product added successfully!');
      setError('');
      navigate('/');
    } catch (err) {
      setError('Error adding product, please try again.');
      setSuccess('');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      setImage(file);
      setError('');
    } else {
      setError('Please upload a valid image file.');
      setImage(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleApi();
  };

  // Function to get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
          .then(response => response.json())
          .then(data => {
            if (data && data.display_name) {
              setNewProduct({ ...newProduct, location: data.display_name });
              setError('');
            }
          })
          .catch(err => {
            console.error(err);
            setError('Unable to retrieve location. Please try again.');
          });
      }, () => {
        setError('Unable to retrieve location. Please allow location access.');
      });
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title>Add New Product</Card.Title>
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
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
                  <Button variant="secondary" onClick={getCurrentLocation} className="mt-2">
                    Add Detect Location
                  </Button>
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
