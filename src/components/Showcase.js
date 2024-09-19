import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase/firebase';
import './Showcase.css';

const Showcase = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for search
  const [isSearchVisible, setIsSearchVisible] = useState(false); // Toggle search bar visibility

  useEffect(() => {
    const productsRef = ref(database, 'products');
    const unsubscribe = onValue(
      productsRef,
      (snapshot) => {
        const productsData = snapshot.val();
        if (productsData) {
          const productsList = Object.keys(productsData)
            .map((key) => {
              const productEntries = productsData[key];
              return Object.values(productEntries);
            })
            .flat();

          const validProducts = productsList.filter(
            (product) =>
              product.productName && product.productId && product.productPrice
          );

          setProducts(validProducts.length > 0 ? validProducts : []);
        } else {
          setProducts([]);
        }
        setLoading(false); // Turn off loading state once data is fetched
      },
      (error) => {
        setError(error.message);
        setLoading(false); // Turn off loading even on error
      }
    );

    return () => unsubscribe();
  }, []);

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Tampilkan animasi loading langsung di sini
  if (loading) return (
    <div className="loading-container">
      <img 
        src="https://firebasestorage.googleapis.com/v0/b/pusatbayar-innoview.appspot.com/o/InnoView-loading-icon.png?alt=media&token=8544f63b-cf61-46c9-b23a-03300e939813" 
        alt="Loading..." 
        className="loading-icon" // Tambahkan class untuk animasi
      />
      <p className="loading-text">Sedang load data, sabar ya kak...</p>
    </div>
  );

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="showcase">
      <div className="search-container">
        <button
          className="search-button"
          onClick={() => setIsSearchVisible(!isSearchVisible)}
        >
          🔍
        </button>

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
              <span className="profile-name">
                {product.fullName || 'Anonymous'}
              </span>
              <img
                className="photo-akun-shocase24"
                src={product.profilePicture || 'default-profile-url.jpg'}
                alt={product.fullName || 'User'}
                style={{
                  width: '24%',
                  height: 'auto',
                  borderRadius: '50%',
                  border: '2px solid white',
                  boxShadow: '0 0 5px blue',
                  marginTop: '4px',
                }}
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
