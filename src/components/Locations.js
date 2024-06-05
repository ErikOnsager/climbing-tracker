import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import mapsConfig from './mapsConfig';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({ name: '', grade: '', details: '', photoUrl: '', lat: 0, lng: 0 });
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "locations"));
        setLocations(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching locations: ", error);
      }
    };
    fetchLocations();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setFilePreview(URL.createObjectURL(file));
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setNewLocation({ ...newLocation, lat, lng });
    setMapCenter({ lat, lng });
  };

  const addLocation = async (e) => {
    e.preventDefault();
    if (file) {
      const storageRef = ref(storage, `locations/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        snapshot => {},
        error => {
          console.error("Error uploading file: ", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          try {
            const docRef = await addDoc(collection(db, "locations"), { ...newLocation, photoUrl: downloadURL });
            setLocations([...locations, { id: docRef.id, ...newLocation, photoUrl: downloadURL }]);
            setNewLocation({ name: '', grade: '', details: '', photoUrl: '', lat: 0, lng: 0 });
            setFile(null);
            setFilePreview(null);
          } catch (error) {
            console.error("Error adding location: ", error);
          }
        }
      );
    } else {
      try {
        const docRef = await addDoc(collection(db, "locations"), newLocation);
        setLocations([...locations, { id: docRef.id, ...newLocation }]);
        setNewLocation({ name: '', grade: '', details: '', photoUrl: '', lat: 0, lng: 0 });
      } catch (error) {
        console.error("Error adding location: ", error);
      }
    }
  };

  return (
    <div>
      <h2>Climbing Locations</h2>
      <ul>
        {locations.map(location => (
          <li key={location.id}>
            <Link to={`/locations/${location.id}`}>{location.name} - {location.grade}</Link>
            {location.photoUrl && <img src={location.photoUrl} alt={location.name} style={{ width: '100px' }} />}
          </li>
        ))}
      </ul>
      <form onSubmit={addLocation}>
        <input
          type="text"
          placeholder="Location Name"
          value={newLocation.name}
          onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Difficulty Grade"
          value={newLocation.grade}
          onChange={(e) => setNewLocation({ ...newLocation, grade: e.target.value })}
        />
        <textarea
          placeholder="Details"
          value={newLocation.details}
          onChange={(e) => setNewLocation({ ...newLocation, details: e.target.value })}
        />
        <input type="file" onChange={handleFileChange} />
        {filePreview && <img src={filePreview} alt="Preview" style={{ width: '100px' }} />}
        <LoadScript googleMapsApiKey={mapsConfig.apiKey}>
          <GoogleMap
            center={mapCenter}
            zoom={10}
            mapContainerStyle={{ width: '100%', height: '500px' }}
            onClick={handleMapClick}
          >
            {newLocation.lat !== 0 && newLocation.lng !== 0 && (
              <Marker position={{ lat: newLocation.lat, lng: newLocation.lng }} />
            )}
          </GoogleMap>
        </LoadScript>
        <button type="submit">Add Location</button>
      </form>
    </div>
  );
};

export default Locations;