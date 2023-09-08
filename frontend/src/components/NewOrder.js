import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';

function CreateOrder() {
  const [formData, setFormData] = useState({
    client_id: '',
    status: '',
    order_id: '', // Add order_id field
    order_date: '', // Add order_date field
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Generate order_id and order_date here
    const order_id = generateOrderId(); // You can create a function to generate a unique order ID
    const order_date = new Date().toISOString(); // Get the current date and time as ISO string

    // Update formData with the generated values
    setFormData({
      ...formData,
      order_id,
      order_date,
    });

    // Send the updated formData to the server
    fetch('http://localhost:9030/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response of the order creation here
        console.log(data);
      })
      .catch((error) => {
        console.error('Error al crear la orden:', error);
      });
  };

  // Function to generate a unique order ID
  const generateOrderId = () => {
    // You can implement your logic to generate a unique order ID here
    // For simplicity, let's use a timestamp-based ID
    return Date.now().toString();
  };

  return (
    <Container>
      <div className="mt-4 mb-4">
        <h2>Crear Nueva Orden</h2>
      </div>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group controlId="client_id">
              <Form.Label>Client ID</Form.Label>
              <Form.Control
                type="text"
                name="client_id"
                value={formData.client_id}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Control
                type="text"
                name="status"
                value={formData.order_status}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Display the generated order_id and order_date */}
        <p>Order ID: {formData.order_id}</p>
        <p>Order Date: {formData.order_date}</p>

        <div className="mt-3">
          <Button variant="primary" type="submit">
            Crear Orden
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default CreateOrder;