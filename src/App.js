import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Akun from './components/Akun';
import './App.css';
import { requestForToken, onMessageListener } from './firebase/fcm';
import { Sheet } from 'react-modal-sheet';
import { UserProvider, UserContext } from './context/UserContext';

function App() {
  const [notification, setNotification] = useState({ title: '', body: '' });
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    requestForToken();

    const unsubscribeMessageListener = onMessageListener().then(payload => {
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body,
      });
    }).catch(err => console.log('Failed to set up message listener: ', err));

    return () => unsubscribeMessageListener;
  }, []);

  return (
    <UserProvider>
      <div>
        <nav className="navbar">
          <div className="navbar-brand">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/pusatbayar-innoview.appspot.com/o/pb%20(3).png?alt=media&token=737f0730-d3f9-42e5-ab73-e63604083e2f"
              alt="Solusiku Logo"
              className="navbar-logo"
            />
            <span className="navbar-text">Pusat Bayar</span>
          </div>
          <div className="navbar-menu">
            <button onClick={() => setIsSheetOpen(true)}>Menu</button>
          </div>
        </nav>


        <Sheet
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          snapPoints={[450, 0]}
          initialSnap={0}
        >
          <Sheet.Container>
            <Sheet.Header />
            <Sheet.Content>
              <button className="close-sheet-button" onClick={() => setIsSheetOpen(false)}>X</button>
              <div className="modal-card-container">
                <Link to="/" onClick={() => setIsSheetOpen(false)} className="modal-card">Home</Link>
                <Link to="/login" onClick={() => setIsSheetOpen(false)} className="modal-card">Login</Link>
                <Link to="/register" onClick={() => setIsSheetOpen(false)} className="modal-card">Register</Link>
                <Link
                  to={user ? `/akun/${user.uid}` : '/login'}
                  onClick={() => setIsSheetOpen(false)}
                  className="modal-card"
                >
                  Dashboard
                </Link>
              </div>
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop onClick={() => setIsSheetOpen(false)} />
        </Sheet>

        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/akun/:userId" element={<Akun />} />
          </Routes>
          {notification.title && (
            <div className="notification-popup">
              <h2>{notification.title}</h2>
              <p>{notification.body}</p>
            </div>
          )}
        </div>
      </div>
    </UserProvider>
  );
}

export default App;