import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css';

function NewClient() {
  const [clientData, setClientData] = useState({
    name: '',
    email: '',
    address: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientData({
      ...clientData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:9030/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(clientData)
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Cliente creado con éxito. ID:', responseData.id);
        setClientData({
          name: '',
          email: '',
          address: ''
        });

        // Use toast.success for success notification
        toast.success('Cliente creado con éxito.', {
          position: "top-right",
          autoClose: 3000, // Automatically close after 3 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      } else {
        console.error('Error al crear el cliente:', response.status, response.statusText);

        // Use toast.error for error notification
        toast.error('Error al crear el cliente.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
    } catch (error) {
      console.error('Error de red:', error);

      // Use toast.error for network error notification
      toast.error('Error de red.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  return (
    <Container>
      <div className="mt-4 mb-4">
        <h2>Crear Nuevo Cliente</h2>
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Nombre:</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={clientData.name}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Correo electrónico:</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={clientData.email}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Dirección:</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={clientData.address}
            onChange={handleInputChange}
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

export default NewClient;
