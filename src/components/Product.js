import React, { useState, useContext } from 'react';
import { getDatabase, ref as databaseRef, set, push } from 'firebase/database';
import { storage } from '../firebase/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { UserContext } from '../context/UserContext';
import './Product.css';

const Product = () => {
  const { user, fullName, profilePicUrl } = useContext(UserContext); // Destructure fullName and profilePicUrl
  const [productName, setProductName] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setProductImage(e.target.files[0]);
    }
  };

  const formatPrice = (price) => {
    return price.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handlePriceBlur = () => {
    setProductPrice(formatPrice(productPrice));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Anda harus login untuk membuat produk');
      return;
    }

    setUploading(true);

    let productImageUrl = '';
    if (productImage) {
      const imageRef = storageRef(storage, `products/${user.uid}/${productImage.name}`);
      await uploadBytes(imageRef, productImage);
      productImageUrl = await getDownloadURL(imageRef);
    }

    const database = getDatabase();
    const productRef = databaseRef(database, `products/${user.uid}`);
    const newProductRef = push(productRef);

    const productData = {
      productId: newProductRef.key,
      productName,
      productImageUrl,
      productDescription,
      productPrice,
      userId: user.uid,
      fullName: fullName || 'Anonymous',
      profilePicture: profilePicUrl || '',
      timestamp: Date.now() // Add timestamp here
    };

    await set(newProductRef, productData);

    setProductName('');
    setProductImage(null);
    setProductDescription('');
    setProductPrice('');
    setUploading(false);

    alert('Produk berhasil disimpan!');
  };

  return (
    <div className="produk-unix2024-container">
      <h2>Buat Produk</h2>
      <form onSubmit={handleSubmit} className="produk-unix2024-form">
        <div>
          <label>Nama Produk/Layanan</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Upload Gambar Produk</label>
          <input type="file" onChange={handleFileChange} />
        </div>

        <div>
          <label>Deskripsi</label>
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Harga</label>
          <input
            type="text"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            onBlur={handlePriceBlur}
            required
          />
        </div>

        <button type="submit" className="produk-unix2024-submit-btn" disabled={uploading}>
          {uploading ? 'Menyimpan...' : 'Simpan Produk'}
        </button>
      </form>
    </div>
  );
};

export default Product;
