import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import './Location.css';

const Location = () => {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [editingGrade, setEditingGrade] = useState(false);
  const [editingDetails, setEditingDetails] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedGrade, setEditedGrade] = useState('');
  const [editedDetails, setEditedDetails] = useState('');

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const docRef = doc(db, "locations", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const locationData = { id: docSnap.id, ...docSnap.data() };
          setLocation(locationData);
          setEditedName(locationData.name);
          setEditedGrade(locationData.grade);
          setEditedDetails(locationData.details);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching location: ", error);
      }
    };

    fetchLocation();
  }, [id]);

  const updateLocationField = async (field, value) => {
    try {
      const locationRef = doc(db, "locations", id);
      await updateDoc(locationRef, { [field]: value });
      setLocation((prevLocation) => ({ ...prevLocation, [field]: value }));
    } catch (error) {
      console.error(`Error updating ${field}: `, error);
    }
  };

  const handleNameBlur = () => {
    setEditingName(false);
    updateLocationField('name', editedName);
  };

  const handleGradeBlur = () => {
    setEditingGrade(false);
    updateLocationField('grade', editedGrade);
  };

  const handleDetailsBlur = () => {
    setEditingDetails(false);
    updateLocationField('details', editedDetails);
  };

  return (
    <div>
      {location ? (
        <div className="location-card">
          {editingName ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleNameBlur}
              autoFocus
            />
          ) : (
            <h2 onDoubleClick={() => setEditingName(true)}>{location.name}</h2>
          )}
          {location.photoUrl && <img src={location.photoUrl} alt={location.name} style={{ width: '100%', height: 'auto' }} />}
          <div className="location-details">
            {editingGrade ? (
              <input
                type="text"
                value={editedGrade}
                onChange={(e) => setEditedGrade(e.target.value)}
                onBlur={handleGradeBlur}
                autoFocus
              />
            ) : (
              <p onDoubleClick={() => setEditingGrade(true)}>Difficulty Grade: {location.grade}</p>
            )}
            {editingDetails ? (
              <textarea
                value={editedDetails}
                onChange={(e) => setEditedDetails(e.target.value)}
                onBlur={handleDetailsBlur}
                autoFocus
              />
            ) : (
              <p onDoubleClick={() => setEditingDetails(true)}>Details: {location.details}</p>
            )}
          </div>
          <LoadScript googleMapsApiKey="AIzaSyAwfWo3yYJ_USsX75w8DTaZd3cYJvf7lqY">
            <GoogleMap
              center={{ lat: location.lat, lng: location.lng }}
              zoom={18}
              mapContainerStyle={{ width: '100%', height: '400px' }}
            >
              <Marker position={{ lat: location.lat, lng: location.lng }} />
            </GoogleMap>
          </LoadScript>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Location;
