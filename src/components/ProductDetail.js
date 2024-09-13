import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { database } from '../firebase/firebase';
import './ProductDetail.css';

const ProductDetail = () => {
  const { slug, productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const userId = "Tr4alEKv4aVdzMjzMwME8MzHtsD3"; // Replace with dynamic user ID if needed
        const productsRef = ref(database, `products/${userId}`);
        const snapshot = await get(productsRef);
        
        if (snapshot.exists()) {
          const productsData = snapshot.val();
          let foundProduct = null;

          for (let id in productsData) {
            if (productsData[id].productId === productId && generateSlug(productsData[id].fullName) === slug) {
              foundProduct = productsData[id];
              break;
            }
          }

          setProduct(foundProduct);
        } else {
          setProduct(null);
          console.log(`No product found at this path: ${productId}`);
        }
      } catch (err) {
        setError(err.message);
        console.error(`Error fetching product with ID: ${productId}`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, slug]);

  const generateSlug = (text) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>No product found.</div>;

  return (
    <div className="product-detail">
      <h1>{product.productName}</h1>
      <p>{product.productDescription}</p>
      <p>Price: ${product.productPrice}</p>
      <img src={product.productImageUrl} alt={product.productName} />
      {/* Add other product details here */}
    </div>
  );
};

export default ProductDetail;
