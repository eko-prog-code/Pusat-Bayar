import React, { useState } from 'react';
import { auth } from '../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true); // Show loading icon when login starts
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Logged in:', user);
        const fullName = user.displayName;
        console.log('Nama Lengkap:', fullName);

        setShowPopup(true);
        setTimeout(() => {
          setLoading(false); // Hide loading after successful login
          navigate('/');
        }, 2000);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false); // Hide loading on error
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.loginContainer} style={{ position: 'relative' }}>
      {loading && (
        <div className="loading-container">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/pusatbayar-innoview.appspot.com/o/InnoView-loading-icon.png?alt=media&token=8544f63b-cf61-46c9-b23a-03300e939813"
            alt="Loading..."
            className="loading-icon"
          />
        </div>
      )}
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.inputField}
        />
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.inputField}
          />
          <span
            onClick={togglePasswordVisibility}
            style={{
              position: 'absolute',
              right: '30px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
            }}
          >
            {showPassword ? '🙉' : '🙈'}
          </span>
        </div>
        <button type="submit">Login</button>
      </form>

      {error && <p>{error}</p>}

      {showPopup && (
        <div className={styles.popup}>
          <p>Login successful! Redirecting...</p>
        </div>
      )}
    </div>
  );
};

export default Login;
