import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider.tsx';
import axios from 'axios';

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout/');
    } catch (error) {
      console.error("Backend logout failed, logging out on frontend anyway.", error);
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-logo">
        <Link to="/dashboard">K</Link>
      </div>

      <nav className="topbar-nav">
        <Link to="/search">Search</Link>
        <Link to="/dashboard">List</Link>
        <Link to="/history">History</Link>
        <Link to="/explore">Explore</Link>
      </nav>

      <div className="topbar-auth">
        {user ? (
          <>
            <Link to="/profile" className="welcome-message-link">
              <span className="welcome-message">Welcome, {user.username}</span>
            </Link>
            <button onClick={handleLogout} className="topbar-logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register">
              <button className="topbar-signup-btn">Sign up</button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Topbar;