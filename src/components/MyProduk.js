import React, { useState, useEffect } from 'react';
import { getDatabase, ref as databaseRef, get } from 'firebase/database';
import { getAuth } from 'firebase/auth'; // Import Firebase Auth
import './MyProduk.css'; // Ensure to create and style this CSS file

const MyProduk = () => {
  const [products, setProducts] = useState([]);
  const auth = getAuth(); // Get auth instance
  const userId = auth.currentUser ? auth.currentUser.uid : null; // Get current user's ID

  useEffect(() => {
    if (!userId) {
      console.error('User is not authenticated.');
      return;
    }

    const database = getDatabase();
    const productsRef = databaseRef(database, `products/${userId}`);

    console.log(`Fetching products from path: products/${userId}`);
    
    get(productsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const productsData = snapshot.val();
          const productsArray = Object.values(productsData);
          productsArray.sort((a, b) => b.timestamp - a.timestamp);
          setProducts(productsArray);
        } else {
          setProducts([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, [userId]);

  const handleDelete = (productId) => {
    // Handle delete logic here
  };

  return (
    <div className="my-produk-container">
      <h3>Produk Anda:</h3>
      <ul>
        {products.map((product) => (
          <li key={product.productId} className="product-item">
            <button
              className="delete-button"
              onClick={() => handleDelete(product.productId)}
            >
              ❌
            </button>
            <h4>{product.productName}</h4>
            <img src={product.productImageUrl} alt={product.productName} className="product-image" />
            <p>{product.productDescription}</p>
            <p>Harga: {product.productPrice}</p>
            <p>Tanggal Posting: {new Date(product.timestamp).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyProduk;
