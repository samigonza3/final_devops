import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editedClient, setEditedClient] = useState({
    client_name: '',
    client_email: '',
    client_address: '',
  });
// Función para obtener la lista de clientes desde la API
const fetchClients = () => {
    fetch('http://localhost:9030/clients')
      .then(response => response.json())
      .then(data => setClients(data))
      .catch(error => console.error('Error fetching clients:', error));
  };
  
  useEffect(() => {
    fetchClients();
  }, []);

  const handleEditClick = (client) => {
    setSelectedClient(client);
    setEditedClient({
      client_name: client.client_name,
      client_email: client.client_email,
      client_address: client.client_address,
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (client) => {
    setSelectedClient(client);
    setShowDeleteModal(true);
  };

  const handleEditSave = () => {
    // Verifica que haya un cliente seleccionado y que al menos uno de los campos se haya modificado
    if (selectedClient && Object.keys(editedClient).some((key) => editedClient[key] !== selectedClient[key])) {
      // Crea un objeto con los campos modificados
      const updatedData = {};
      Object.keys(editedClient).forEach((key) => {
        if (editedClient[key] !== selectedClient[key]) {
          updatedData[key] = editedClient[key];
        }
      });
  
      // Hacer una solicitud PUT al endpoint correspondiente
      fetch(`http://localhost:9030/clients/${selectedClient.client_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })
        .then((response) => {
          if (response.status === 200) {
            // Actualización exitosa
            setShowEditModal(false); // Cierra el modal de edición
            fetchClients(); // Actualiza la lista después de la edición
          } else {
            // La actualización falló, maneja el error
            response.json().then((data) => {
              console.error('Error updating client:', data.error);
            });
          }
        })
        .catch((error) => {
          console.error('Error updating client:', error);
        });
    }
  };
  
  const handleDeleteConfirm = () => {
    // Verifica que haya un cliente seleccionado
    if (selectedClient) {
      // Hacer una solicitud DELETE al endpoint correspondiente
      fetch(`http://localhost:9030/clients/${selectedClient.client_id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.status === 200) {
            // Eliminación exitosa
            setShowDeleteModal(false); // Cierra el modal de eliminación
            fetchClients(); // Actualiza la lista después de la eliminación
          } else {
            // La eliminación falló, maneja el error
            response.json().then((data) => {
              console.error('Error deleting client:', data.error);
            });
          }
        })
        .catch((error) => {
          console.error('Error deleting client:', error);
        });
    }
  };

  return (
    <div className='mt-4 mb-4'>
      <h1>Lista de Clientes</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.client_id}>
              <td>{client.client_id}</td>
              <td>{client.client_name}</td>
              <td>{client.client_email}</td>
              <td>{client.client_address}</td>
              <td>
                <Button variant='info' onClick={() => handleEditClick(client)}>
                  Editar
                </Button>
                <Button
                  variant='danger'
                  className='ml-2'
                  onClick={() => handleDeleteClick(client)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal de edición */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type='text'
                value={editedClient.client_name}
                onChange={(e) =>
                  setEditedClient({
                    ...editedClient,
                    client_name: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='text'
                value={editedClient.client_email}
                onChange={(e) =>
                  setEditedClient({
                    ...editedClient,
                    client_email: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type='text'
                value={editedClient.client_address}
                onChange={(e) =>
                  setEditedClient({
                    ...editedClient,
                    client_address: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant='primary' onClick={handleEditSave}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que quieres eliminar al cliente "{selectedClient?.client_name}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant='danger' onClick={handleDeleteConfirm}>
            Confirmar Eliminación
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Clients;
