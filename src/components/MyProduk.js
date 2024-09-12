import React, { useState, useEffect } from 'react';
import { getDatabase, ref as databaseRef, get, remove } from 'firebase/database';
import './MyProduk.css'; // Ensure to create and style this CSS file

const MyProduk = () => {
  const [products, setProducts] = useState([]);
  const userId = 'QJbnHgRVPHg2k1nSEfgcG64Z9N42'; // Replace with actual userId from context or props

  useEffect(() => {
    const database = getDatabase();
    const productsRef = databaseRef(database, `products/${userId}`);

    get(productsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          // Assuming products are stored in an object with unique IDs and each product has a timestamp property
          const productsData = snapshot.val();
          const productsArray = Object.values(productsData);

          // Sort products by timestamp in descending order
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
    const database = getDatabase();
    const productRef = databaseRef(database, `products/${userId}/${productId}`);

    remove(productRef)
      .then(() => {
        setProducts(products.filter(product => product.productId !== productId));
        alert('Product deleted successfully!');
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
        alert('Failed to delete product.');
      });
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
