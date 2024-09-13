import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase/firebase';
import './Showcase.css';

const Showcase = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search
  const [isSearchVisible, setIsSearchVisible] = useState(false); // Toggle search bar visibility

  useEffect(() => {
    const productsRef = ref(database, 'products');
    const unsubscribe = onValue(
      productsRef,
      (snapshot) => {
        const productsData = snapshot.val();
        if (productsData) {
          const productsList = Object.keys(productsData).map((key) => {
            const productEntries = productsData[key];
            return Object.values(productEntries);
          }).flat();

          const validProducts = productsList.filter(
            (product) => product.productName && product.productId && product.productPrice
          );

          setProducts(validProducts.length > 0 ? validProducts : []);
        } else {
          setProducts([]);
        }
        setLoading(false);
      },
      (error) => {
        setError(error.message);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="showcase">
      <div className="search-container">
        {/* Search Button with 3D effect */}
        <button
          className="search-button"
          onClick={() => setIsSearchVisible(!isSearchVisible)}
        >
          🔍
        </button>

        {/* Search input field */}
        {isSearchVisible && (
          <input
            type="text"
            placeholder="Cari..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        )}
      </div>

      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <div key={product.productId} className="product-card">
            <img
              src={product.productImageUrl || 'default-image-url.jpg'}
              alt={product.productName}
            />
            <h2>{product.productName}</h2>
            <p>{product.productDescription || 'No description available.'}</p>
            <p>Price: Rp{product.productPrice}</p>

            <hr className="divider" />

            <div className="profile-container">
              <span className="profile-name">{product.fullName || 'Anonymous'}</span>
              <img
                className="photo-akun-shocase24"
                src={product.profilePicture || 'default-profile-url.jpg'}
                alt={product.fullName || 'User'}
                style={{ width: '24%', height: 'auto', borderRadius: '50%', border: '2px solid white', boxShadow: '0 0 5px blue', marginTop: '4px' }}
              />
            </div>
            <Link to={`/product/${product.productSlug}/${product.productId}`}>
              <button>View Details</button>
            </Link>
          </div>
        ))
      ) : (
        <p>No valid products available.</p>
      )}

      <footer className="footer">
        <div>Hak Cipta PT.InnoView Indo Tech @2024</div>
      </footer>
    </div>
  );
};

export default Showcase;
