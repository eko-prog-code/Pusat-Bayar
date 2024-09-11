import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { storage } from '../firebase/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref as databaseRef, get, set } from 'firebase/database'; // Import set from firebase/database
import './Akun.css';
import Product from './Product';      // Import Product component
import EmailBlast from './EmailBlast'; // Import EmailBlast component

const Akun = () => {
  const { userId } = useParams();
  const { user, setProfilePicUrl } = useContext(UserContext);
  const [userData, setUserData] = useState({});
  const [profilePicUrl, setProfilePicUrlState] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('profile'); // Default section is 'profile'

  // State for managing payment info
  const [isPaymentFormVisible, setIsPaymentFormVisible] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');

  useEffect(() => {
    const database = getDatabase();
    if (userId) {
      // Fetch user data
      const userRef = databaseRef(database, `users/${userId}`);
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setUserData(data);
            setPaymentInfo(data.paymentInfo || ''); // Set paymentInfo from user data
          } else {
            setError('User data not found');
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          setError('Failed to fetch user data');
        });

      // Fetch profile picture
      const fetchProfilePic = async () => {
        try {
          const profilePicRef = storageRef(storage, `profilePictures/${userId}`);
          try {
            const url = await getDownloadURL(profilePicRef);
            setProfilePicUrlState(url);
          } catch (urlError) {
            setProfilePicUrlState('');
          }
        } catch (error) {
          console.error('Failed to fetch profile picture:', error);
        }
      };

      fetchProfilePic();
    }
  }, [userId]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile && user) {
      const profilePicRef = storageRef(storage, `profilePictures/${userId}`);
      uploadBytes(profilePicRef, selectedFile)
        .then(() => getDownloadURL(profilePicRef))
        .then((url) => {
          setProfilePicUrlState(url);
          if (user.uid === userId) {
            setProfilePicUrl(url);
          }
          alert('Foto profil berhasil diunggah!');
        })
        .catch((error) => {
          console.error(error);
          alert('Gagal mengunggah foto profil.');
        });
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  // Handle Payment Info Submission
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (paymentDetails) {
      setPaymentInfo(paymentDetails);
      setIsPaymentFormVisible(false);
      
      // Save payment info to Firebase Realtime Database
      const database = getDatabase();
      const paymentRef = databaseRef(database, `users/${userId}/paymentInfo`);
      set(paymentRef, paymentDetails)
        .then(() => {
          alert('Info pembayaran berhasil disimpan!');
        })
        .catch((error) => {
          console.error('Failed to save payment info:', error);
          alert('Gagal menyimpan info pembayaran.');
        });
    }
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
          <li><a href="#product" onClick={() => handleSectionChange('product')}>Product</a></li>
          <li><a href="#email-blast" onClick={() => handleSectionChange('email-blast')}>Email Blast</a></li>
        </ul>
      </div>

      {/* Konten utama */}
      <div className={`main-content ${isSidebarOpen ? 'with-sidebar' : ''}`}>
        {activeSection === 'profile' && (
          <div id="profile" className="profile-container">
            <div className="profile-header">
              <h2>Hai {userData.name || 'User'}</h2>
            </div>
            <div className="profile-info">
              <div className="profile-picture-container">
                {profilePicUrl ? (
                  <img
                    src={profilePicUrl}
                    alt="Profile"
                    className="profile-picture"
                  />
                ) : (
                  <div className="profile-picture-placeholder">Foto Profil</div>
                )}
              </div>
              {user && user.uid === userId && (
                <div>
                  <input type="file" onChange={handleFileChange} />
                  <button onClick={handleUpload}>Unggah Foto Profil</button>
                </div>
              )}
              <div className="profile-details">
                <h3>Data Pengguna:</h3>
                <p><strong>Nama:</strong> {userData.name}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Nomor Telepon:</strong> {userData.phoneNumber}</p>
                {paymentInfo && <p><strong>Info Pembayaran:</strong> {paymentInfo}</p>}
              </div>

              {!isPaymentFormVisible && (
                <button onClick={() => setIsPaymentFormVisible(true)}>
                  {paymentInfo ? 'Ubah Info Payment' : 'Info Payment'}
                </button>
              )}

              {isPaymentFormVisible && (
                <form onSubmit={handlePaymentSubmit} className="unix-929-payment-form-container">
                  <input
                    type="text"
                    placeholder="Nama/Bank/No.Rekening"
                    value={paymentDetails}
                    onChange={(e) => setPaymentDetails(e.target.value)}
                  />
                  <button type="submit">Submit</button>
                </form>
              )}
            </div>
          </div>
        )}

        {activeSection === 'product' && (
          <div id="product">
            <Product />
          </div>
        )}

        {activeSection === 'email-blast' && (
          <div id="email-blast">
            <EmailBlast />
          </div>
        )}
      </div>
    </div>
  );
};

export default Akun;
