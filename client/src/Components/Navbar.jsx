import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import './Navbar.css';
import './Sidebar.css'; // Import sidebar CSS for consistent styling
import Sidebar from './Sidebar'; // Import the Sidebar component

const NavBar = ({ setProducts, allProducts }) => {
  const { user, logoutUser } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false); // State for sidebar visibility
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchQuery(value);
    
    // Filter products based on the search query
    if (value.trim() === "") {
      setProducts(allProducts); // Reset to all products if query is empty
    } else {
      const filtered = allProducts.filter((product) =>
        product.title.toLowerCase().includes(value.toLowerCase())
      );
      setProducts(filtered);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      navigate(`/search?name=${searchQuery}`);
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible); // Toggle the sidebar visibility
  };

  return (
    <>
      <nav className="navbar">
        {/* Hamburger Button */}
        <button className="hamburger-btn" onClick={toggleSidebar}>
          &#9776; {/* Unicode for hamburger icon */}
        </button>

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
              onChange={handleSearchChange}
              onKeyDown={handleSearch}
            />
          </div>
        )}

        <div className="nav-links">
          {user && (
            <DropdownButton
              id="dropdown-basic-button"
              title="Products"
               // Change to secondary
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

      {/* Sidebar Component */}
      {sidebarVisible && (
        <div className="sidebar-overlay" onClick={toggleSidebar}>
          <div className="sidebar-container" onClick={(e) => e.stopPropagation()}>
            <Sidebar />
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
