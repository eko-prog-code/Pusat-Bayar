import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { storage } from '../firebase/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref as databaseRef, get, set } from 'firebase/database'; 
import './Akun.css';
import Product from './Product'; 
import EmailBlast from './EmailBlast'; 
import MyProduk from './MyProduk';

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

  // Fetch user data and profile picture on component mount
  useEffect(() => {
    const database = getDatabase();
    const userRef = databaseRef(database, `users/${userId}`);
    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserData(data);
          setPaymentInfo(data.paymentInfo || ''); 
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
          // Pastikan userId sesuai dan pengguna sudah login
          if (user && user.uid === userId) {
            const profilePicRef = storageRef(storage, `profilePictures/${userId}`);
            const url = await getDownloadURL(profilePicRef);
            setProfilePicUrlState(url);
          } else {
            setProfilePicUrlState('/path/to/default/profile-pic.png'); // Placeholder jika tidak ada file
          }
        } catch (error) {
          if (error.code === 'storage/object-not-found') {
            setProfilePicUrlState('/path/to/default/profile-pic.png'); // Placeholder jika tidak ada file
          } else if (error.code === 'storage/unauthorized') {
            // Jika akses ditolak
            console.error('Error: Unauthorized access to storage', error);
          } else {
            console.error('Error fetching profile picture:', error);
          }
        }
      };      

    fetchProfilePic();
  }, [userId]);

  useEffect(() => {
    if (userData.fullName) {
      navigate(`/akun/${userData.fullName}`);
    }
  }, [userData.fullName, navigate]);

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
  
          const database = getDatabase();
          const userRef = databaseRef(database, `users/${userId}/profilePicture`);
          set(userRef, url)
            .then(() => {
              alert('Foto profil berhasil diunggah!');
            })
            .catch((error) => {
              console.error('Gagal memperbarui URL foto profil:', error);
            });
  
          if (user.uid === userId) {
            setProfilePicUrl(url);
          }
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

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (paymentDetails) {
      setPaymentInfo(paymentDetails);
      setIsPaymentFormVisible(false);
      
      const database = getDatabase();
      const paymentRef = databaseRef(database, `users/${userId}/paymentInfo`);
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

  return (
    <div className="akun-dashboard">
      {/* Menu hamburger untuk mobile */}
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
          <li><a href="#product" onClick={() => handleSectionChange('product')}>Buat Produk</a></li>
          <li><a href="#email-blast" onClick={() => handleSectionChange('email-blast')}>Email Blast</a></li>
        </ul>
      </div>

      {/* Konten utama */}
      <div className={`main-content ${isSidebarOpen ? 'with-sidebar' : ''}`}>
        {activeSection === 'profile' && (
          <div id="profile" className="profile-container">
            <div className="profile-header">
              <h2>Hai {userData.fullName || 'Pengguna'}</h2>
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
                <p><strong>Nama:</strong> {userData.fullName}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Nomor Telepon:</strong> {userData.phoneNumber}</p>
                {paymentInfo && <p><strong>Info Pembayaran:</strong> {paymentInfo}</p>}
              </div>

              {!isPaymentFormVisible && (
                <button onClick={() => setIsPaymentFormVisible(true)}>
                  {paymentInfo ? 'Ubah Info Pembayaran' : 'Tambah Info Pembayaran'}
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
                  <button type="submit">Kirim</button>
                </form>
              )}
              <hr className="divider" />
              <MyProduk userId={userId} />
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
