// Showcase.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // Ensure this path is correct
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase/firebase'; // Adjust import as needed
import './Showcase.css'; // Import the CSS file

const Showcase = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser(); // Use the custom hook here
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const productsRef = ref(database, 'products');
    const unsubscribe = onValue(productsRef, snapshot => {
      const productsData = snapshot.val();
      console.log('Products data:', productsData); // Debugging: Check if data is fetched
      if (productsData) {
        const productsList = [];
        for (let id in productsData) {
          for (let subId in productsData[id]) {
            productsList.push(productsData[id][subId]);
          }
        }
        setProducts(productsList);
      } else {
        console.log('No products data found.');
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching products:', error); // Handle errors
      setError('Failed to load products. Please check your permissions.');
      setLoading(false); // Stop loading on error
    });

    // Cleanup function
    return () => unsubscribe(); 

  }, [user, navigate]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="showcase">
      <h1>Product Showcase</h1>
      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div key={index} className="product-card">
              <img src={product.productImageUrl} alt={product.productName} />
              <h2>{product.productName}</h2>
              <p>{product.productDescription}</p>
              <p>Price: {product.productPrice}</p>
              <div className="profile">
                <img src={product.profilePicture} alt={product.fullName} />
                <p>{product.fullName}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

export default Showcase;
