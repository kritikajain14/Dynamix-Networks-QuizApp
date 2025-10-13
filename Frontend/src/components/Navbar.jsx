import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // You might want to decode the token to get user email
      // For now, we'll use a simple approach
      const userData = localStorage.getItem('userData');
      if (userData) {
        setUserEmail(JSON.parse(userData).email);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUserEmail('');
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 font-bold text-xl">Q</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            QuizWhiz
          </span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <div className="hidden md:flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                <span className="text-sm">👋 Hello, {userEmail || 'User'}</span>
              </div>
              
              <Link 
                to="/quiz" 
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-full font-semibold transition-colors shadow-lg"
              >
                Take Quiz
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full font-semibold transition-colors backdrop-blur-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full font-semibold transition-colors backdrop-blur-sm"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;