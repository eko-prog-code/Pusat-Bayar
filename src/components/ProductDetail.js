import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase/firebase';
import ReactPlayer from 'react-player';
import Modal from 'react-modal';
import './ProductDetail.css';

const ProductDetail = () => {
  const { slug, productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

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
    alert('Link copied to clipboard!');
  };

  const handleCopyAccountNumber = () => {
    navigator.clipboard.writeText('1730007993125');
    alert('Nomor rekening berhasil disalin!');
  };

  const handleVideoModalOpen = () => {
    setIsVideoModalOpen(true);
  };

  const handleVideoModalClose = () => {
    setIsVideoModalOpen(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/pusatbayar-innoview.appspot.com/o/InnoView-loading-icon.png?alt=media&token=8544f63b-cf61-46c9-b23a-03300e939813"
          alt="Loading..."
          style={{ width: '100px', height: '100px' }}
        />
        <p style={{ color: 'white', marginTop: '10px' }}>Sedang load data, sabar ya kak...</p>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>No product found.</div>;
  }

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

      <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <button className="share-button unix-424-share-button" onClick={handleShare}>
          Share 📤
        </button>
        <button
          className="video-button unix-424-video-button"
          style={{
            marginLeft: '20px',
            backgroundColor: 'blue',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={handleVideoModalOpen}
        >
          🎬 Video Produk
        </button>
      </div>

      <Modal
        isOpen={isVideoModalOpen}
        onRequestClose={handleVideoModalClose}
        contentLabel="Video Produk"
        className="video-modal"
        overlayClassName="video-modal-overlay"
      >
        <div style={{ position: 'relative' }}>
          <button
            onClick={handleVideoModalClose}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              fontSize: '20px',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            ✖️
          </button>
        </div>

        <ReactPlayer
          url={product.productPromoVideoUrl}
          controls
          width="100%"
          height="500px"
        />
      </Modal>

      <hr style={{ borderTop: '3px solid blue', margin: '20px 0' }} />

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
