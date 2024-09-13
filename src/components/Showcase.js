import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase/firebase';
import './Showcase.css';

const Showcase = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const productsRef = ref(database, 'products/Tr4alEKv4aVdzMjzMwME8MzHtsD3');
    const unsubscribe = onValue(productsRef, snapshot => {
      const productsData = snapshot.val();
      if (productsData) {
        const productsList = Object.values(productsData);
        setProducts(productsList);
      } else {
        setProducts([]);
        console.log('No products data found.');
      }
      setLoading(false);
    }, (error) => {
      setError(error.message);
      console.error('Error fetching products:', error);
    });

    return () => unsubscribe();
  }, []);

  const generateSlug = (text) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="showcase">
      {products.map(product => (
        <div key={product.productId} className="product-card">
          <img src={product.productImageUrl} alt={product.productName} />
          <h2>{product.productName}</h2>
          <p>{product.productDescription}</p>
          <p>Price: ${product.productPrice}</p>
          <Link to={`/product/${generateSlug(product.fullName)}/${product.productId}`}>
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Showcase;
