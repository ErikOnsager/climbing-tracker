import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user ? user : null);
    });
    return () => unsubscribe();
  }, []);

  const signOutUser = () => {
    signOut(auth).catch((error) => console.error('Error signing out: ', error));
  };

  return (
    <div>
      {user === null ? (
        <div className="login-container">
          <h2>Welcome to ClimbAnywhere!</h2>
          <div id="button-container">
            <button className="login-button" onClick={() => navigate('/login')}>Login</button>
            <p>or</p>
            <button className="signup-button" onClick={() => navigate('/signup')}>Sign Up</button>
          </div>
          <img src={require('./Climbing.png')} alt="Climbing" className="climbing-image" />
        </div>
      ) : (
        <div>
          <div className="login-container">
            <p>Welcome {user.email}. <br /></p>
            <div id="button-container">
            <p><button onClick={() => navigate('/locations')}>View Climbing Locations</button></p>
              <button onClick={signOutUser}>Sign out</button>
            </div>
            <img src={require('./Climbing.png')} alt="Climbing" className="climbing-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;