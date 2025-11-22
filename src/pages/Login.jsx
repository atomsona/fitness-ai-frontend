import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 px-4 py-8">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-lg">
          {error && <div className="bg-red-500 text-white px-4 py-2 rounded">{error}</div>}
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
          <Button onClick={googleLogin} variant="outline" className="w-full mt-2">Continue with Google</Button>
          <p className="text-center text-gray-500 mt-4">
            Don't have an account? <Link to="/register" className="text-purple-500">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
