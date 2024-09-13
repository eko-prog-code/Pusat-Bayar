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
    const productsRef = ref(database, 'products');
    const unsubscribe = onValue(
      productsRef,
      (snapshot) => {
        const productsData = snapshot.val();
        if (productsData) {
          const productsList = Object.keys(productsData).map(key => {
            const productEntries = productsData[key];
            return Object.values(productEntries);
          }).flat();

          const validProducts = productsList.filter(
            (product) => product.productName && product.productId && product.productPrice
          );

          if (validProducts.length > 0) {
            setProducts(validProducts);
          } else {
            setProducts([]);
          }
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="showcase">
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product.productId} className="product-card">
            <img
              src={product.productImageUrl || 'default-image-url.jpg'}
              alt={product.productName}
            />
            <h2>{product.productName}</h2>
            <p>{product.productDescription || 'No description available.'}</p>
            <p>Price: Rp{product.productPrice}</p>

            {/* Divider abu-abu */}
            <hr className="divider" />

            {/* Tambahkan nama dan foto profil */}
            <div className="profile-container">
              <span className="profile-name">{product.fullName || 'Anonymous'}</span>
              <img
                className="photo-akun-shocase24"
                src={product.profilePicture || 'default-profile-url.jpg'}
                alt={product.fullName || 'User'}
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
        {/* Footer */}
        <footer className="footer">
                <div>
                    Hak Cipta PT.InnoView Indo Tech @2024
                </div>
            </footer>
    </div>
  );
};

export default Showcase;
