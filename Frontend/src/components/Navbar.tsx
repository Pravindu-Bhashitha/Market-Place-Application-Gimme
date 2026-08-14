import { Container, Nav, Navbar as BsNavbar, NavLink } from "react-bootstrap";
import { Link } from 'react-router-dom';

const AppNavbar = () => {
    return (
        <BsNavbar bg="dark" variant="dark" expand="md" className="mb-4">
            <Container>
                <BsNavbar.Brand as={Link} to="/">
                    Market Place
                </BsNavbar.Brand>
                <BsNavbar.Toggle aria-controls="main-navbar" />
                <BsNavbar.Collapse id="main-navbar">
                    <Nav className="ms-auto">
                        <Nav.Link as={NavLink} to="/" end>
                            Listings
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/create-listing">
                            Create Listing
                        </Nav.Link>
                    </Nav>
                </BsNavbar.Collapse>
            </Container>
        </BsNavbar>
    )
}

export default AppNavbar;