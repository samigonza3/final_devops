import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';

const Dispatches = () => {
  const [deliveries, setDeliveries] = useState([]);

  // Función para obtener la lista de entregas desde la API
  const fetchDeliveries = () => {
    fetch('http://localhost:9030/deliveries') // Cambia la URL según la ubicación de tu API
      .then((response) => response.json())
      .then((data) => setDeliveries(data))
      .catch((error) => console.error('Error fetching deliveries:', error));
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  return (
    <div className='mt-4 mb-4'>
      <h1>Lista de Entregas</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Dirección de Entrega</th>
            <th>Fecha de Entrega</th>
            <th>Estado de Entrega</th>
            <th>ID de Orden</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((delivery) => (
            <tr key={delivery.delivery_id}>
              <td>{delivery.delivery_id}</td>
              <td>{delivery.delivery_address}</td>
              <td>{new Date(delivery.delivery_date).toLocaleString()}</td>
              <td>{delivery.delivery_status}</td>
              <td>{delivery.order_id}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Dispatches;
