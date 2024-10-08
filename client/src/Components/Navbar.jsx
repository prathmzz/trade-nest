import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import './Navbar.css';

const NavBar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      navigate(`/search?name=${searchQuery}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>
          <Link to="/" className="brand-link">
            TradeNest
          </Link>
        </h2>
      </div>

      {user && (
        <div className="welcome-text-container">
          <span className="welcome-text">Welcome {user?.name}</span>
        </div>
      )}

      {user && (
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      )}

<div className="nav-links">
  {user && (
    <DropdownButton
      id="dropdown-basic-button"
      title="Products"
      variant="secondary" // Change to secondary
      className="nav-button"
    >
      <Dropdown.Item as={Link} to="/addproduct">
        Add Product
      </Dropdown.Item>
      <Dropdown.Item as={Link} to="/viewlistings">
        View Listings
      </Dropdown.Item>
    </DropdownButton>
  )}
  {user ? (
    <Link onClick={() => logoutUser()} to="/login" className="nav-button logout-button">
      Logout
    </Link>
  ) : (
    <div className="auth-links">
      <Link to="/login" className="nav-button">
        Login
      </Link>
      <Link to="/register" className="nav-button">
        Register
      </Link>
    </div>
  )}
</div>

    </nav>
  );
};

export default NavBar;
