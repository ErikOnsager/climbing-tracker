import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { getDocs, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase';
import './ProfileEdit.css';

const ProfileEdit = () => {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [newPhoto, setNewPhoto] = useState(null);
  const [averageGrade, setAverageGrade] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setDisplayName(user.displayName || '');
        setPhotoURL(user.photoURL || '');
        fetchAverageGrade();
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchAverageGrade = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'locations'));
      const grades = querySnapshot.docs
        .map(doc => doc.data().grade)
        .filter(grade => grade.startsWith('V'))
        .map(grade => parseInt(grade.slice(1)));

      if (grades.length > 0) {
        const avgGrade = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
        setAverageGrade(avgGrade.toFixed(2));
      } else {
        setAverageGrade(null);
      }
    } catch (error) {
      console.error("Error fetching grades: ", error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (user) {
      let updatedPhotoURL = photoURL;
      if (newPhoto) {
        const photoRef = ref(storage, `profilePhotos/${user.uid}`);
        await uploadBytes(photoRef, newPhoto);
        updatedPhotoURL = await getDownloadURL(photoRef);
        setPhotoURL(updatedPhotoURL);
      }
      updateProfile(user, { displayName, photoURL: updatedPhotoURL })
        .then(() => {
          console.log('Profile updated successfully');
        })
        .catch((error) => {
          console.error('Error updating profile: ', error);
        });
    }
  };

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setNewPhoto(e.target.files[0]);
    }
  };

  return (
    <div className="profile-edit">
      <h2>Profile</h2>
      <form onSubmit={handleUpdateProfile}>
        <h3>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </h3>
        <div className="profile-photo">
          <img src={photoURL || '/default-profile.png'} alt="Profile" />
          <input type="file" onChange={handlePhotoChange} />
        </div>
      </form>
      {averageGrade !== null && (
        <div>
          <h5>Average V-Grade of Climbs: V{averageGrade}</h5>
        </div>
      )}
    </div>
  );
};

export default ProfileEdit;
