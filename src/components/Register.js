import React, { useState, useEffect } from 'react';
import { auth, database, storage } from '../firebase/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && selectedFile) {
        handleFileUpload(user.uid);
      }
    });

    return () => unsubscribe();
  }, [selectedFile]);

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true); // Show loading icon when registration starts
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (selectedFile) {
          handleFileUpload(user.uid);
        } else {
          saveUserData(user.uid, fullName, email, phoneNumber, password, '');
        }
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false); // Hide loading on error
      });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = (userId) => {
    const profilePicRef = storageRef(storage, `profilePictures/${userId}`);

    uploadBytes(profilePicRef, selectedFile)
      .then(() => getDownloadURL(profilePicRef))
      .then((url) => {
        setProfilePicUrl(url);
        saveUserData(userId, fullName, email, phoneNumber, password, url);
      })
      .catch((error) => {
        console.error('Error uploading profile picture:', error);
        saveUserData(userId, fullName, email, phoneNumber, password, ''); // Save user data without profile pic URL
      });
  };

  const saveUserData = (userId, fullName, email, phoneNumber, password, profilePicUrl) => {
    set(ref(database, 'users/' + userId), {
      fullName: fullName,
      email: email,
      phoneNumber: phoneNumber,
      password: password,
      profilePicture: profilePicUrl
    })
      .then(() => {
        setLoading(false); // Hide loading on success
        alert('Berhasil mendaftar!');
        navigate('/');
      })
      .catch((error) => {
        console.error('Error saving user data:', error);
        setError('Gagal menyimpan data pengguna.');
        setLoading(false); // Hide loading on error
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={{ position: 'relative' }}>
      {loading && (
        <div className="loading-container">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/pusatbayar-innoview.appspot.com/o/InnoView-loading-icon.png?alt=media&token=8544f63b-cf61-46c9-b23a-03300e939813"
            alt="Loading..."
            className="loading-icon"
          />
        </div>
      )}
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nama Lengkap"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          type="text"
          placeholder="No Telpon (WhatsApp)"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            onClick={togglePasswordVisibility}
            style={{
              position: 'absolute',
              right: '30px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer'
            }}
          >
            {showPassword ? '🙉' : '🙈'}
          </span>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <p>Upload PhotoProfile</p>
        <button type="submit">Register</button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
};

export default Register;
