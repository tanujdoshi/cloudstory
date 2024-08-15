import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { defaultLanguages } from "../mini/Languages";
import SearchableDropdown from "../mini/SearchableDropdown";
import { useLanguage } from "../context/LanguageContext";

const Navigation = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [loggedIn, setLoggedIn] = useState(false);
  const [languages, setLanguages] = useState(defaultLanguages);
  const { selectedLanguage, setSelectedLanguage } = useLanguage();

  console.log("selectedLanguageselectedLanguage", selectedLanguage);
  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    navigate("/");
  };

  useEffect(() => {
    if (token) {
      console.log("User us loggedin");
      setLoggedIn(true);
    }
  }, [token]);

  console.log("languages", languages);
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          CloudStory
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            {!loggedIn ? (
              <>
                <Nav.Link as={Link} to="/login" exact>
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" exact>
                  Register
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/upload" exact>
                  Upload Story
                </Nav.Link>
                {languages.length > 0 && (
                  <SearchableDropdown
                    options={languages}
                    onSelect={handleLanguageSelect}
                    selectedLanguage={selectedLanguage}
                  />
                )}
              </>
            )}
          </Nav>
        </Navbar.Collapse>
        {loggedIn && (
          <Navbar.Collapse className="justify-content-end">
            <Button onClick={handleLogout}>Logout</Button>
          </Navbar.Collapse>
        )}
      </Container>
    </Navbar>
  );
};

export default Navigation;
