import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoIcon from './logomain.png';

const MainLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validation checks
  const validateForm = () => {
    let formErrors = {};

    if (!email || !emailRegex.test(email)) {
      formErrors.email = 'A valid email is required';
    }

    if (!password || password.length < 6) {
      formErrors.password = 'Password should be at least 6 characters';
    }

    return formErrors;
  };

  const handleLogin = async () => {
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      try {
        const response = await fetch('https://navizitbackend.onrender.com/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('user', JSON.stringify(data.user));
          alert('Login successful!');
          navigate('/home'); // Redirect to home after login
        } else {
          alert('Invalid email or password');
        }
      } catch (error) {
        console.error('Error during login:', error);
        alert('Login failed!');
      }
    }
  };
  const goToSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-white">
      <div className='flex justify-center items-center w-[700px]'>
          <img src={logoIcon} alt="Logo" className="w-[290px] h-[70px] ml-3 mix-blend-multiply bg-transparent" />
        </div>
      <div className="w-full max-w-md space-y-8 bg-gray-900 p-10 rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-bold text-white">Log in to your account</h2>
        <div className="space-y-4">
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
            onClick={handleLogin}
            className="w-full py-2 mt-6 bg-orange-500 hover:bg-orange-600 rounded-md text-white font-bold"
          >
            Login
          </button>
          <p className="text-center text-sm text-gray-400 mt-4">
            Don’t have an account?{' '}
            <span onClick={goToSignup} className="text-orange-500 cursor-pointer hover:underline">
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainLogin;
