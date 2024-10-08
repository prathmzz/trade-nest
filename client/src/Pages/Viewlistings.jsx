
import React, { useEffect, useState } from 'react';

const ViewListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userEmail, setUserEmail] = useState("");

    const getUserEmail = () => {
        const userToken = localStorage.getItem('User');
        if (userToken) {
            const parsedUserEmail = JSON.parse(userToken);
            setUserEmail(parsedUserEmail.email);
        }
        console.log('No token found');
        return null;
    };

    useEffect(() => {
        getUserEmail(); // Call this first to set the email
    }, []);

    useEffect(() => {
        if (userEmail) {
            console.log('User Email after setting:', userEmail); // Log the email after setting
            fetchListings(userEmail);
        } else {
            setLoading(false);
        }
    }, [userEmail]); // Trigger the effect when userEmail changes
    

    const fetchListings = async (email) => {
        try {
            const response = await fetch(`http://localhost:5000/get-listings?email=${email}`);
            if (!response.ok) {
                throw new Error('Failed to fetch listings: ' + response.statusText);
            }
            const data = await response.json();
            console.log('Fetched Listings:', data.listings);
            setListings(data.listings);
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
                            <img src={listing.image} alt={listing.description} style={{ maxWidth: '200px' }} />
                            <p>Price: ${listing.price}</p>
                            <p>Added on: {new Date(listing.createdAt).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No listings found for your account.</p>
            )}
        </div>
    );
}

export default ViewListings;
    