import React, { useEffect, useState } from 'react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedPrice, setEditedPrice] = useState('');
  const [editedAvailability, setEditedAvailability] = useState('');

  const fetchData = () => {
    fetch("http://localhost:9030/products")
      .then(response => {
        return response.json();
      })
      .then(data => {
        setProducts(data);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (product) => {
    console.log('Editing Product:', product);
    setEditingProduct(product.product_id);
    setEditedName(product.product_name);
    setEditedDescription(product.product_description);
    setEditedPrice(product.product_price);
    setEditedAvailability(product.availability);
  };

  const handleDelete = async (product) => {
    if (!product || !product.id) {
      console.error('Product to delete is not valid.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:9030/products/${product.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Product deleted successfully, refresh the product list
        fetchData();
      } else {
        // Handle error response from the server
        console.error('Failed to delete product:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.id) {
      console.error('Editing product is not valid.');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:9030/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedName,
          description: editedDescription,
          price: editedPrice,
          availability: editedAvailability,
        }),
      });
  
      if (response.ok) {
        // Product updated successfully, update the frontend state and reset editingProduct
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === editingProduct.id ? { ...product, product_name: editedName, product_description: editedDescription, product_price: editedPrice, availability: editedAvailability } : product
          )
        );
        setEditingProduct(null);
        setEditedName('');
        setEditedDescription('');
        setEditedPrice('');
        setEditedAvailability('');
      } else {
        // Handle error response from the server
        console.error('Failed to update product:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <div className="container mt-4">
      <h1>Lista de Productos</h1>
      <table className="table table-bordered table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Nombre del Producto</th>
            <th>Precio</th>
            <th>Descripción del Producto</th>
            <th>Disponibilidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item, index) => (
            <tr key={index}>
              <td>{item.product_name}</td>
              <td>${item.product_price}</td>
              <td>{item.product_description}</td>
              <td>{item.availability}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingProduct && (
        <div>
          <h2>Editar Producto</h2>
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="Product Name"
            />
            <input
              type="text"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="Description"
            />
            <input
              type="number"
              value={editedPrice}
              onChange={(e) => setEditedPrice(e.target.value)}
              placeholder="Price"
            />
            <input
              type="number"
              value={editedAvailability}
              onChange={(e) => setEditedAvailability(e.target.value)}
              placeholder="Availability"
            />
            <button type="submit">Save Changes</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Products;
