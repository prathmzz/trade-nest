import React, { useEffect, useState } from 'react';
import './ViewListings.css'; // Import the CSS file

const ViewListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userEmail, setUserEmail] = useState("");
    const [deletingId, setDeletingId] = useState(null); // Track the listing currently being deleted

    // Get user email from local storage
    const getUserEmail = () => {
        const userToken = localStorage.getItem('User');
        if (userToken) {
            const parsedUserEmail = JSON.parse(userToken);
            setUserEmail(parsedUserEmail.email);
        } else {
            console.log('No token found');
        }
    };

    useEffect(() => {
        getUserEmail();
    }, []);

    useEffect(() => {
        if (userEmail) {
            console.log('User Email after setting:', userEmail);
            fetchListings(userEmail);
        } else {
            setLoading(false);
        }
    }, [userEmail]);

    // Fetch listings from the backend
    const fetchListings = async (email) => {
        try {
            const response = await fetch(`http://localhost:5000/get-listings?email=${email}`);
            if (!response.ok) {
                throw new Error('Failed to fetch listings: ' + response.statusText);
            }
            const data = await response.json();

            // Construct the full image URL for each listing
            const updatedListings = data.listings.map(listing => ({
                ...listing,
                image: `http://localhost:5000/${listing.image}` // Ensure correct path to image
            }));

            setListings(updatedListings);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Delete a listing
    const handleDelete = async (listingId) => {
        if (window.confirm("Are you sure you want to delete this listing?")) {
            setDeletingId(listingId); // Set the listing ID being deleted
            try {
                // Trim the listingId to ensure no extra whitespace
                const trimmedId = listingId.trim();
    
                const response = await fetch(`http://localhost:5000/delete-listing/${trimmedId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Failed to delete listing: ' + response.statusText);
                }
    
                // Remove the deleted listing from the state
                setListings(prevListings => prevListings.filter(listing => listing._id !== trimmedId));
                alert("Listing deleted successfully!"); // Notify the user of success
            } catch (err) {
                console.error("Delete error:", err);
                setError(err.message);
                alert("Error deleting listing: " + err.message); // Notify the user of error
            } finally {
                setDeletingId(null); // Reset deleting ID
            }
        }
    };
    

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="view-listings">
            <h1>View Listings</h1>
            {userEmail ? (
                <p className="user-email">User Email: {userEmail}</p>
            ) : (
                <p>User Email is not available.</p>
            )}
            {listings.length > 0 ? (
                <div className="listing-container">
                    {listings.map((listing) => (
                        <div key={listing._id} className="listing-card">
                            <div className="listing-description">{listing.description}</div>
                            <img 
                                src={listing.image}
                                alt={listing.description} 
                                className="listing-image" 
                            />
                            <p>Price: ₹{listing.price}</p>
                            <p>Added on: {new Date(listing.createdAt).toLocaleDateString()}</p>
                            <button 
                                onClick={() => handleDelete(listing._id)}
                                style={{
                                    backgroundColor: 'red',  // Red background for delete button
                                    color: 'white',          // White text color
                                    border: 'none',          // No border
                                    padding: '10px',         // Padding
                                    cursor: 'pointer',       // Pointer cursor on hover
                                    borderRadius: '5px',     // Rounded corners
                                    fontSize: '16px',        // Font size
                                    marginTop: '10px',       // Margin at the top
                                    opacity: listing._id === deletingId ? 0.5 : 1, // Dim button if deleting
                                }}
                                disabled={listing._id === deletingId} // Disable button while deleting
                            >
                                {listing._id === deletingId ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No listings found for your account.</p>
            )}
        </div>
    );
};

export default ViewListings;
