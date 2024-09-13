import React, { useState, useEffect } from 'react';
import { getDatabase, ref as databaseRef, get, remove } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import './MyProduk.css'; // Ensure to create and style this CSS file

const MyProduk = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const auth = getAuth();
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  useEffect(() => {
    if (!userId) {
      console.error('User is not authenticated.');
      setError('User is not authenticated.');
      return;
    }

    const database = getDatabase();
    const productsRef = databaseRef(database, `products/${userId}`);

    get(productsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const productsData = snapshot.val();
          const productsArray = Object.keys(productsData).map((productId) => ({
            ...productsData[productId],
            productId,
          }));
          productsArray.sort((a, b) => b.timestamp - a.timestamp);
          setProducts(productsArray);
        } else {
          setProducts([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setError(error.message);
      });
  }, [userId]);

  const handleDelete = (productId) => {
    const database = getDatabase();
    const productRef = databaseRef(database, `products/${userId}/${productId}`);

    remove(productRef)
      .then(() => {
        setProducts(products.filter((product) => product.productId !== productId));
        alert('Produk berhasil dihapus!');
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
        alert('Gagal menghapus produk.');
      });
  };

  return (
    <div className="my-produk-container">
      <h3>Produk Anda:</h3>
      {error && <p className="error-message">Error: {error}</p>}
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
