import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreateProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    availability: '',
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
    fetch('http://localhost:9030/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        toast.success('¡Producto creado con éxito!', { autoClose: 3000 }); // Muestra un mensaje de éxito durante 3 segundos
      })
      .catch((error) => {
        console.error('Error al crear el producto:', error);
      });
  };

  return (
    <Container>
      <div className="mt-4 mb-4">
        <h2>Crear Nuevo Producto</h2>
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Nombre del Producto</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="description">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="price">
          <Form.Label>Precio</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="availability">
          <Form.Label>Disponibilidad</Form.Label>
          <Form.Control
            type="text"
            name="availability"
            value={formData.availability}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <div className="mt-3">
          <Button variant="primary" type="submit">
            Crear Producto
          </Button>
        </div>
      </Form>
      <ToastContainer />
    </Container>
  );
}

export default CreateProduct;
