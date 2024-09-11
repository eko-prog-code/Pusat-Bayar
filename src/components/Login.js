import React, { useState } from 'react';
import { auth } from '../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false); // State to control the visibility of the popup
  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Logged in:', userCredential.user);
        setShowPopup(true); // Show the popup on successful login
        setTimeout(() => {
          navigate('/'); // Navigate to the home page after a delay
        }, 2000); // Adjust the delay as needed
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.loginContainer}>
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
              cursor: 'pointer'
            }}
          >
            {showPassword ? '🙉' : '🙈'}
          </span>
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}

      {/* Display popup on successful login */}
      {showPopup && (
        <div className={styles.popup}>
          <p>Login successful! Redirecting...</p>
        </div>
      )}
    </div>
  );
};

export default Login;