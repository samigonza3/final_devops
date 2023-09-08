import React, { useEffect, useState } from 'react';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const fetchData = () => {
    fetch("http://localhost:9030/orders")
      .then(response => response.json())
      .then(data => setOrders(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditOrder = (orderId) => {
    fetch(`http://localhost:9030/orders/${orderId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      date: 'nueva_fecha',
    }),
  })
    .then(response => {
      if (response.status === 200) {
      } else {
        console.error('Error:', response.status);
      }
    })
    .catch(error => {
        console.error('Error:', error);
    });
  };

  const handleDisableOrder = (orderId) => {
    fetch(`http://localhost:9030/orders/${orderId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.status === 200) {
        } else {
        }
      })
      .catch(error => {
      });
  };

  return (
    <div className="container mt-4">
      <h1>Lista de Órdenes</h1>
      <table className="table table-bordered table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Fecha de la Orden</th>
            <th>ID de la Orden</th>
            <th>ID del Cliente</th>
            <th>Estado de la Orden</th>
            <th>Acciones</th> {/* Nueva columna para acciones */}
          </tr>
        </thead>
        <tbody>
          {orders.map((item, index) => (
            <tr key={index}>
              <td>{item.Order_date}</td>
              <td>{item.Order_id}</td>
              <td>{item.client_id}</td>
              <td>{item.order_status}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleEditOrder(item.Order_id)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger ml-2"
                  onClick={() => handleDisableOrder(item.Order_id)}
                >
                  Inactivar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;