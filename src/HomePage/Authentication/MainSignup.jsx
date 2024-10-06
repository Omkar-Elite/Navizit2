import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoIcon from './logomain.png';

const MainSignup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validation checks
  const validateForm = () => {
    let formErrors = {};

    if (!username) {
      formErrors.username = 'Username is required';
    }

    if (!email || !emailRegex.test(email)) {
      formErrors.email = 'A valid email is required';
    }

    if (!password || password.length < 6) {
      formErrors.password = 'Password should be at least 6 characters';
    }

    return formErrors;
  };

  const handleSignup = async () => {
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      try {
        const response = await fetch('https://navizitbackend.onrender.com/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password }),
        });

        if (response.ok) {
          alert('Signup successful!');
          // Pass user details to the verification page
          navigate('/verify', { state: { email, username, password } });
        } else {
          alert('Signup failed!');
        }
      } catch (error) {
        console.error('Error during signup:', error);
        alert('Signup failed!');
      }
    }
  };

  const goToLogin = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-white">
      <div className='flex justify-center items-center w-[700px]'>
          <img src={logoIcon} alt="Logo" className="w-[290px] h-[70px] ml-3 mix-blend-multiply bg-transparent" />
        </div>
      <div className="w-full max-w-md space-y-8 bg-gray-900 p-10 rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-bold text-white">Create an account</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <button
            onClick={handleSignup}
            className="w-full py-2 mt-6 bg-orange-500 hover:bg-orange-600 rounded-md text-white font-bold"
          >
            Sign Up
          </button>
          <p className="text-center text-sm text-gray-400 mt-4">
            Already have an account?{' '}
            <span onClick={goToLogin} className="text-orange-500 cursor-pointer hover:underline">
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainSignup;
