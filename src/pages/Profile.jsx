import React, { useState } from 'react';
import {
  Camera,
  Mail,
  User as UserIcon,
  Crown,
  Lock,
  Shield,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import api from '../utils/api';

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [confirmDelete, setConfirmDelete] = useState(false);

  const notify = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

 
  const saveProfile = async () => {
    setLoading(true);
    try {
      const { data } = await api.put('/user/profile', { name, email });
      setUser(data);
      notify('Profile updated successfully');
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

 
  const updatePassword = async () => {
    if (newPassword !== confirmPassword) {
      notify('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      await api.put('/user/password', {
        currentPassword,
        newPassword
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      notify('Password updated successfully');
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to update password', 'error');
    } finally {
      setLoading(false);
    }
  };

 
  const deleteAccount = async () => {
    setLoading(true);
    try {
      await api.delete('/user');
      logout();
    } catch {
      notify('Failed to delete account', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <div className="max-w-6xl mx-auto px-6 py-12">

        <h1 className="text-4xl font-bold text-white mb-8">Profile Settings</h1>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'error'
                ? 'bg-red-500/20 text-red-300 border border-red-400'
                : 'bg-green-500/20 text-green-300 border border-green-400'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* TABS */}
        <div className="flex gap-3 mb-10">
          {['general', 'email', 'password', 'security'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg capitalize transition ${
                activeTab === tab
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* GENERAL */}
        {activeTab === 'general' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                General Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Full name"
              />
              <Input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
              />
              <Button onClick={saveProfile} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* EMAIL */}
        {activeTab === 'email' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="New email address"
              />
              <Button onClick={saveProfile} disabled={loading}>
                {loading ? 'Updating...' : 'Update Email'}
              </Button>
              <div className="p-4 bg-yellow-500/20 border border-yellow-400 rounded-lg text-yellow-300 text-sm">
                ⚠️ Changing your email will update your login email immediately.
              </div>
            </CardContent>
          </Card>
        )}

        {/* PASSWORD */}
        {activeTab === 'password' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
              />
              <Input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
              <Button onClick={updatePassword} disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* SECURITY */}
        {activeTab === 'security' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <Shield className="w-5 h-5" />
                Security & Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {confirmDelete ? (
                <>
                  <p className="text-red-300">
                    This action is permanent and cannot be undone.
                  </p>
                  <Button
                    className="bg-red-600 hover:bg-red-700"
                    onClick={deleteAccount}
                    disabled={loading}
                  >
                    {loading ? 'Deleting...' : 'Confirm Delete Account'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setConfirmDelete(false)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
