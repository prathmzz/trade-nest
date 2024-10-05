import React, { useState } from 'react';
import { Stack, Form, Button, Container, Card } from 'react-bootstrap'; // Import Bootstrap components
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import axios from 'axios';

function AddProduct() {
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleApi =() => {
    const formData = new FormData();
    formData.append('description',description) 
    formData.append('price',price) 
    formData.append('image',image) 

    const url ='http://localhost:5000/add-product';

    axios.post(url, formData)
    .then((res)=>{
       console.log(res) 
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleApi(); // Call handleApi to send data to the server

    // Redirect to the home page or another page
    navigate('/');
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title>Add New Product</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="productDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                type="text"
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
                // onChange={(e)=>{
                //   console.log(e.target.files)
                // }}
                onChange={handleImageChange}

              />
            </Form.Group>

            {/* <Button onClick={handleApi} variant="primary" type="submit" > */}
            <Button variant="primary" type="submit" >
              Add Product
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AddProduct;
