import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-black bg-opacity-30 backdrop-blur-lg border-b border-white border-opacity-10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Dumbbell className="w-8 h-8 text-purple-400" />
            <span className="text-white font-bold text-xl">Fitness AI Coach</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition">
                  Dashboard
                </Link>
                <Link to="/quests" className="text-gray-300 hover:text-white transition">
                  Quests
                </Link>
                <Link to="/profile" className="text-gray-300 hover:text-white transition">
                  Profile
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="text-purple-400 hover:text-purple-300 transition font-semibold">
                    Admin
                  </Link>
                )}
                <div className="flex items-center space-x-4">
                  <div className="text-white text-sm">
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-gray-400 text-xs">
                      {user.isPremium ? '👑 Premium' : 'Free'}
                    </div>
                  </div>
                  <Button onClick={handleLogout} variant="outline" size="sm">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white transition">
                  Login
                </Link>
                <Link to="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-black bg-opacity-90 backdrop-blur-lg">
          <div className="px-4 py-6 space-y-4">
            {user ? (
              <>
                <Link to="/dashboard" className="block text-gray-300 hover:text-white transition">
                  Dashboard
                </Link>
                <Link to="/quests" className="block text-gray-300 hover:text-white transition">
                  Quests
                </Link>
                <Link to="/profile" className="block text-gray-300 hover:text-white transition">
                  Profile
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="block text-purple-400 hover:text-purple-300 transition">
                    Admin Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="w-full text-left text-gray-300 hover:text-white transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-300 hover:text-white transition">
                  Login
                </Link>
                <Link to="/register">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;