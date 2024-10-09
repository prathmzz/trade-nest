import React, { useEffect, useState } from 'react';

const ViewListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userEmail, setUserEmail] = useState("");

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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>View Listings</h1>
            {userEmail ? (
                <p>User Email: {userEmail}</p>
            ) : (
                <p>User Email is not available.</p>
            )}
            {listings.length > 0 ? (
                <ul>
                    {listings.map((listing) => (
                        <li key={listing._id} style={{ marginBottom: '20px' }}>
                            <h2>{listing.description}</h2>
                            <img 
                                src={listing.image} // Use the updated image path directly
                                alt={listing.description} 
                                style={{ maxWidth: '200px', borderRadius: '10px' }} 
                            />
                            <p>Price: ₹{listing.price}</p>
                            <p>Added on: {new Date(listing.createdAt).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No listings found for your account.</p>
            )}
        </div>
    );
};

export default ViewListings;
