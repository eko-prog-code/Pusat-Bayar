import React, { useContext, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { storage } from '../firebase/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref as databaseRef, get, set } from 'firebase/database';
import './Akun.css';
import MyProduk from './MyProduk'; // Import MyProduk component
import Product from './Product'; // Assuming you have a Product component
import EmailBlast from './EmailBlast';

const Akun = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, setProfilePicUrl } = useContext(UserContext);
  const [userData, setUserData] = useState({});
  const [profilePicUrl, setProfilePicUrlState] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [isPaymentFormVisible, setIsPaymentFormVisible] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');

  // Ref for file input
  const fileInputRef = useRef(null);

  // Fetch user data and profile picture on component mount
  useEffect(() => {
    const database = getDatabase();
    const userRef = databaseRef(database, `users/${userId}`);
    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserData(data);
          setPaymentInfo(data.paymentInfo || ''); // Set paymentInfo if exists
        } else {
          setError('Data pengguna tidak ditemukan');
        }
      })
      .catch((error) => {
        console.error('Error mengambil data pengguna:', error);
        setError('Gagal mengambil data pengguna');
      });

    // Fetch profile picture
    const fetchProfilePic = async () => {
      try {
        if (user && user.uid === userId) {
          const profilePicRef = storageRef(storage, `profilePictures/${userId}`);
          const url = await getDownloadURL(profilePicRef);
          setProfilePicUrlState(url);
        } else {
          setProfilePicUrlState('/path/to/default/profile-pic.png'); // Placeholder if no file
        }
      } catch (error) {
        if (error.code === 'storage/object-not-found') {
          setProfilePicUrlState('/path/to/default/profile-pic.png'); // Placeholder if no file
        } else {
          console.error('Error fetching profile picture:', error);
        }
      }
    };

    fetchProfilePic();
  }, [userId, user]);

  // Redirect if fullName exists
  useEffect(() => {
    if (userData.fullName) {
      navigate(`/akun/${userData.fullName}`);
    }
  }, [userData.fullName, navigate]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = (file) => {
    if (file && user) {
      const profilePicRef = storageRef(storage, `profilePictures/${user.uid}`); // Use user.uid

      uploadBytes(profilePicRef, file)
        .then(() => getDownloadURL(profilePicRef))
        .then((url) => {
          setProfilePicUrlState(url);

          const database = getDatabase();
          const userRef = databaseRef(database, `users/${user.uid}/profilePicture`);
          set(userRef, url)
            .then(() => {
              alert('Foto profil berhasil diunggah!');
            })
            .catch((error) => {
              console.error('Gagal memperbarui URL foto profil:', error);
            });

          setProfilePicUrl(url);
        })
        .catch((error) => {
          console.error(error);
          alert('Gagal mengunggah foto profil.');
        });
    } else {
      console.error("Pengguna belum login atau file tidak ada.");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (paymentDetails) {
      setPaymentInfo(paymentDetails);
      setIsPaymentFormVisible(false);

      const database = getDatabase();
      const paymentRef = databaseRef(database, `users/${user.uid}/paymentInfo`);

      set(paymentRef, paymentDetails)
        .then(() => {
          alert('Info pembayaran berhasil disimpan!');
        })
        .catch((error) => {
          console.error('Gagal menyimpan info pembayaran:', error);
          alert('Gagal menyimpan info pembayaran.');
        });
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="akun-dashboard">
      {/* Hamburger menu for mobile */}
      <div className="hamburger-menu" onClick={toggleSidebar}>
        ☰
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isSidebarOpen ? '<<' : '>>'}
        </button>
        <h2>Menu</h2>
        <ul>
          <li><a href="#profile" onClick={() => handleSectionChange('profile')}>Profil</a></li>
          <li><a href="#make-product" onClick={() => handleSectionChange('make-product')}>Buat Produk</a></li>
          <li><a href="#my-products" onClick={() => handleSectionChange('my-products')}>Produk Saya</a></li>
          <li><a href="#email-blast" onClick={() => handleSectionChange('email-blast')}>Email Blast</a></li>
        </ul>
      </div>

      {/* Main content */}
      <div className={`main-content ${isSidebarOpen ? 'with-sidebar' : ''}`}>
        {activeSection === 'profile' && (
          <div id="profile" className="profile-container">
            <div className="profile-header">
              <h2>Hai {userData.fullName || 'Pengguna'}</h2>
            </div>
            <div className="profile-info">
              <div className="profile-picture-container" onClick={handleProfilePictureClick}>
                {profilePicUrl ? (
                  <img
                    src={profilePicUrl}
                    alt="Profile"
                    className="profile-picture-akun"
                  />
                ) : (
                  <div className="profile-picture-placeholder">Foto Profil</div>
                )}
              </div>
              {user && (
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              )}
              <div className="profile-details">
                <p><strong>Nama:</strong> {userData.fullName}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Nomor Telepon:</strong> {userData.phoneNumber}</p>
                {paymentInfo && <p><strong>Info Pembayaran:</strong> {paymentInfo}</p>}
              </div>

              {user && !isPaymentFormVisible && (
                <button onClick={() => setIsPaymentFormVisible(true)}>
                  {paymentInfo ? 'Ubah Info Pembayaran' : 'Tambah Info Pembayaran'}
                </button>
              )}

              {user && isPaymentFormVisible && (
                <form onSubmit={handlePaymentSubmit} className="payment-form-container">
                  <input
                    type="text"
                    placeholder="Nama/Bank/No.Rekening"
                    value={paymentDetails}
                    onChange={(e) => setPaymentDetails(e.target.value)}
                  />
                  <button type="submit">Simpan</button>
                  <button type="button" onClick={() => setIsPaymentFormVisible(false)}>Batal</button>
                </form>
              )}
            </div>
          </div>
        )}

        {activeSection === 'make-product' && (
          <div id="make-product">
            <Product />
          </div>
        )}

        {activeSection === 'my-products' && (
          <div id="my-products">
            <MyProduk />
          </div>
        )}

        {activeSection === 'email-blast' && <EmailBlast />}
      </div>
    </div>
  );
};

export default Akun;
