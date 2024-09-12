import React, { useState } from 'react';
import { auth, database } from '../firebase/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); // Updated from 'name' to 'fullName'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleRegister = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        saveUserData(user.uid, fullName, email, phoneNumber, password);
        alert('Berhasil mendaftar!'); // Show success message
        navigate('/'); // Redirect to /akun
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const saveUserData = (userId, fullName, email, phoneNumber, password) => {
    set(ref(database, 'users/' + userId), {
      fullName: fullName, // Updated field to 'fullName'
      email: email,
      phoneNumber: phoneNumber,
      password: password // Saving the password (plaintext) - not recommended for production
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nama Lengkap"
          value={fullName} // Updated from 'name' to 'fullName'
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
        <button type="submit">Register</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Register;
