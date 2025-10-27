import { useState, useEffect } from 'react';
import axios from 'axios'; // Reverted
import { useAuth } from '../context/AuthProvider.tsx';

const UserProfilePage = () => {
  const { user } = useAuth();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      const fetchProfile = async () => {
        try {
          const response = await axios.get('/api/auth/profile/'); // Reverted
          setEmail(response.data.email);
        } catch (error) {
          console.error("Failed to fetch profile", error);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleProfileUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    setError('');
    try {
      await axios.put('/api/auth/profile/', { username, email }); // Reverted
      setMessage('Profile updated successfully!');
    } catch (error) {
      setError('Failed to update profile.');
      console.error(error);
    }
  };

  return (
    <div className="page-content">
      <h1 className="page-title">My Profile</h1>
      
      <div className="profile-card">
        <h3>Profile Information</h3>
        <form onSubmit={handleProfileUpdate} className="profile-form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="profile-save-button">Save Changes</button>
        </form>
      </div>

      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
    </div>
  );
};

export default UserProfilePage;