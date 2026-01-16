import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-2">Join Fitness AI</CardTitle>
            <p className="text-gray-400">Start your fitness adventure today</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-white text-sm font-medium mb-2">Name</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Confirm Password</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-white border-opacity-20"></div>
              <span className="px-4 text-gray-400 text-sm">OR</span>
              <div className="flex-1 border-t border-white border-opacity-20"></div>
            </div>

            <Button
              onClick={googleLogin}
              variant="outline"
              className="w-full flex items-center justify-center"
              type="button"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.73 1.22 9.23 3.22l6.9-6.9C35.9 2.32 30.4 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.02 6.22C12.43 13.38 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.14-3.09-.4-4.55H24v9.02h12.95c-.56 2.95-2.2 5.45-4.67 7.14l7.15 5.55c4.18-3.86 6.55-9.54 6.55-16.16z"/>
                <path fill="#FBBC05" d="M10.58 28.44c-.5-1.5-.78-3.1-.78-4.77s.28-3.27.78-4.77l-8.02-6.22C.92 16.11 0 19.97 0 23.67s.92 7.56 2.56 10.99l8.02-6.22z"/>
                <path fill="#34A853" d="M24 48c6.4 0 11.9-2.11 15.87-5.73l-7.15-5.55c-1.98 1.33-4.52 2.11-8.72 2.11-6.26 0-11.57-3.88-13.42-9.34l-8.02 6.22C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </Button>

            <p className="text-center text-gray-400 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
