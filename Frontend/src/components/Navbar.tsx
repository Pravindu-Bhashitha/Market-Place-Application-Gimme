import { Container, Nav, Navbar as BsNavbar, NavLink, Button } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

const AppNavbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        logout();
        navigate("/");
    }
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
                    <Nav className="ms-auto align-items-center">
                        {user ? (
                            <>
                                <span className="text-light me-3">{user.email}</span>
                                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Log In</Nav.Link>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </BsNavbar.Collapse>
            </Container>
        </BsNavbar>
    )
}

export default AppNavbar;