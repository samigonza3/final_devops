import './App.css';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link,
} from 'react-router-dom';

import Home from './components/Home';
import Products from './components/Products';
import Orders from './components/Orders';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import NewOrder from './components/NewOrder';
import NewProduct from './components/NewProduct';
import Clients from './components/Clients';
import Delivery from './components/Delivery';
import NewClient from './components/NewClient';


function App() {
  return (
    <Router>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/home">Tienda CI/CD</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/home">Principal</Nav.Link>
              <Nav.Link href="/products">Productos</Nav.Link>
              <Nav.Link href="/orders">Ordenes</Nav.Link>
              <NavDropdown title="Operaciones" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/crear_orden">Crear Orden</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/crear_producto">Crear Producto</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/newclient">Crear Cliente</NavDropdown.Item>
                <NavDropdown.Divider /> {/* Línea divisoria */}
                <NavDropdown.Item as={Link} to="/clients">Clientes</NavDropdown.Item> {/* Nueva opción "Clientes" */}
                <NavDropdown.Item as={Link} to="/delivery">Despachos</NavDropdown.Item> {/* Nueva opción "Despachos" */}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Routes>
        <Route exact path="/home" element={<Home />} />
        <Route path="/login" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/crear_orden" element={<NewOrder />} />
        <Route path="/crear_producto" element={<NewProduct />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/newclient" element={<NewClient />} />

      </Routes>
    </Router>
  );
}

export default App;