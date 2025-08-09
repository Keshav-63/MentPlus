import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// Changed the import from useAuth to useAuthStore
import { useAuthStore } from '../store/authStore'; 
import { Menu, X, User, LogOut, MessageCircle  } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // Changed the hook from useAuth() to useAuthStore()
  const { user, logout } = useAuthStore(); 

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Messages', path: '/chat' },
    { name: 'Contact Us', path: '/contact' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glass shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <span className="text-navy-900 font-bold text-xl">M</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:block">MentorHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-yellow-400 ${
                  location.pathname === link.path ? 'text-yellow-400' : 'text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors"
                >
                  <User size={20} />
                  <span className="text-sm font-medium">{user.name || user.email}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 glass rounded-lg shadow-lg py-2">
                    <Link
                      to={user.role === 'student' ? '/student-dashboard' : '/mentor-dashboard'}
                      className="block px-4 py-2 text-sm text-white hover:bg-yellow-400/10 hover:text-yellow-400 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-white hover:bg-red-500/10 hover:text-red-400 transition-colors flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-white hover:text-yellow-400 transition-colors text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-yellow-400 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden glass mt-2 rounded-lg shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    location.pathname === link.path
                      ? 'text-yellow-400 bg-yellow-400/10'
                      : 'text-white hover:text-yellow-400 hover:bg-yellow-400/10'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              {user ? (
                <div className="border-t border-white/10 pt-3 mt-3">
                  <Link
                    to={user.role === 'student' ? '/student-dashboard' : '/mentor-dashboard'}
                    className="block px-3 py-2 text-base font-medium text-white hover:text-yellow-400 hover:bg-yellow-400/10 rounded-md transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-base font-medium text-white hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-white/10 pt-3 mt-3 space-y-2">
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium text-white hover:text-yellow-400 hover:bg-yellow-400/10 rounded-md transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 text-base font-medium bg-gradient-gold text-navy-900 rounded-md hover:scale-105 transition-transform"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;