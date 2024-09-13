import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase/firebase'; // pastikan path ini sesuai dengan konfigurasi firebase Anda
import './ProductDetail.css';

const ProductDetail = () => {
  const { slug, productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const productsRef = ref(database, 'products');
    const unsubscribe = onValue(
      productsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const productsData = snapshot.val();

          let foundProduct = null;

          for (const userId in productsData) {
            const userProducts = productsData[userId];
            for (const key in userProducts) {
              const product = userProducts[key];
              if (product.productId === productId && product.productSlug === slug) {
                foundProduct = product;
                break;
              }
            }
          }

          setProduct(foundProduct || null);
        } else {
          setProduct(null);
        }
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [productId, slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Domain copied to clipboard!');
  };

  const handleCopyAccountNumber = () => {
    navigator.clipboard.writeText('1730007993125');
    alert('Nomor rekening berhasil disalin!');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>No product found.</div>;

  return (
    <div className="product-detail unix-424">
      <div className="profile unix-424-profile">
        <img
          className="profile-image-detail unix-424-profile-image"
          src={product.profilePicture || 'default-profile-url.jpg'}
          alt="Profile"
        />
        <span className="full-name unix-424-full-name">{product.fullName}</span>
      </div>
      <h1>{product.productName}</h1>
      <p>{product.productDescription}</p>
      <p>Price: Rp{product.productPrice}</p>
      <img
        src={product.productImageUrl || 'https://via.placeholder.com/150'}
        alt={product.productName}
      />
      <button className="share-button unix-424-share-button" onClick={handleShare}>
        Share 📤
      </button>

      {/* Divider */}
      <hr style={{ borderTop: '3px solid blue', margin: '20px 0' }} />

      {/* Transfer Information */}
      <div className="transfer-info">
        <p><strong>Pembelian transfer ke:</strong></p>
        <p>Nama: Eko Setiaji</p>
        <p>Bank: Mandiri</p>
        <p>No.Rekening Bank: 1730007993125</p>
        <p>PT. InnoView Indo Tech: MedicTech, Pusat Bayar, E-Book Store, Sell Your Songs, dll</p>
        <button className="copy-button" onClick={handleCopyAccountNumber}>
          📋 Salin Nomor Rekening Bank
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
