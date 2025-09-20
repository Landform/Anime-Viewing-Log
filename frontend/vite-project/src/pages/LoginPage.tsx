import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import the hook for navigation

const LoginPage = () => {
  // State variables to store the values from the input fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Get the navigate function from React Router
  const navigate = useNavigate();

  // This function will be called when the user submits the form
  const handleSubmit = async (event: React.FormEvent) => {
    // Prevent the default browser behavior of reloading the page
    event.preventDefault();

    try {
      // Send a POST request to our Django backend's login endpoint
      const response = await axios.post('/api/auth/login/', {
        username: username,
        password: password,
      });

      // If the request is successful, this code will run
      console.log('Login successful:', response.data);

      // *** THIS IS THE NEW PART ***
      // Instead of an alert, we now programmatically navigate to the dashboard page.
      navigate('/dashboard');

    } catch (error) {
      // If the server returns an error, this code will run
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  // The JSX for the form remains the same
  return (
    <div className="page-container">
      <div className="login-card">
        <h2>Enter Your Login Details</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

          <a href="#" className="forgot-password-link">
            Forgot Password?
          </a>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;