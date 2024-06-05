import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Locations from './components/Locations';
import Location from './components/Location';
import ProfileEdit from './components/ProfileEdit';
import MapView from './components/MapView';
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/locations/:id" element={<Location />} />
          <Route path="/profile" element={<ProfileEdit />} />
          <Route path="/map" element={<MapView />} />
        </Routes>
      </div>
      <BottomNav />
    </Router>
  );
}

export default App;
