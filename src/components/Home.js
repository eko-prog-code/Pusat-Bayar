import React, { useContext } from 'react';
import { getAuth, signOut as firebaseSignOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import jasaImage from '../assets/jasa.webp';
import produkImage from '../assets/produk.webp';
import pelangganImage from '../assets/pelanggan.webp';
import './Home.css';

const Home = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const { userData } = useContext(UserContext);

    const handleLogout = () => {
        firebaseSignOut(auth).then(() => {
            console.log('User signed out');
            navigate('/login'); // Redirect to login after sign out
        }).catch((error) => {
            console.error('Error during sign out:', error);
        });
    };

    return (
        <div>
            <div className="logout-icon-container">
                <img
                    src="https://firebasestorage.googleapis.com/v0/b/solusiku-2024.appspot.com/o/logout-icon.png?alt=media&token=2e8cfd42-e4db-45de-8488-b476086ab583"
                    alt="Logout Icon"
                    className="logout-icon"
                    onClick={handleLogout}
                />
            </div>

            <div className="text-center">
                <h2>Payment Gateway<br />Show your Skill & Produk</h2>
                <p>An easy platform to sell your digital products, class, event, tipping and more. 🔥</p>
                {/* Showcase Button */}
                <button
                    className="showcase-button"
                    onClick={() => navigate('/showcase')}
                >
                    Showcase
                </button>
            </div>

            <div className="image-container">
                <div className="image-item">
                    <img src={jasaImage} alt="Jasa" className="feature-image" />
                    <p className="image-text">Jasa</p>
                </div>
                <div className="image-item">
                    <img src={produkImage} alt="Produk" className="feature-image" />
                    <p className="image-text">Produk</p>
                </div>
                <div className="image-item">
                    <img src={pelangganImage} alt="Pelanggan" className="feature-image" />
                    <p className="image-text">Pelanggan</p>
                </div>
            </div>

            {auth.currentUser && (
                <div className="profile-header text-center">
                    <h4>Hai {userData.fullName || 'User'}</h4>
                    {userData.profilePicture && (
                        <img
                            src={userData.profilePicture}
                            alt="Profile"
                            className="profile-picture"
                        />
                    )}
                    <p>Kelola Dashboard jasa, produk dan pelanggan Anda di Pusat Bayar!</p>
                </div>
            )}
        </div>
    );
};

export default Home;
