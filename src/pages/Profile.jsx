

import React, { useState } from 'react';
import { Camera, Mail, User as UserIcon, Crown, Lock, Shield, Trash2 } from 'lucide-react';
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
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const notify = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const { data } = await api.put('/user/profile', { name, email });
      setUser(data);
      notify('Profile updated');
    } catch (e) {
      notify(e.response?.data?.message || 'Update failed', 'error');
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
      await api.put('/user/password', { currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      notify('Password updated');
    } catch (e) {
      notify(e.response?.data?.message || 'Password update failed', 'error');
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-10">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-white mb-8">Profile Settings</h1>

        {message && (
          <div className={`mb-6 p-4 rounded ${
            message.type === 'error'
              ? 'bg-red-500/20 text-red-300'
              : 'bg-green-500/20 text-green-300'
          }`}>
            {message.text}
          </div>
        )}

        {/* TABS */}
        <div className="flex gap-3 mb-8">
          {['general','email','password','security'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg ${
                activeTab === tab
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* GENERAL */}
        {activeTab === 'general' && (
          <Card>
            <CardHeader><CardTitle>General</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input value={name} onChange={e => setName(e.target.value)} />
              <Input value={email} onChange={e => setEmail(e.target.value)} />
              <Button onClick={saveProfile} disabled={loading}>Save</Button>
            </CardContent>
          </Card>
        )}

        {/* PASSWORD */}
        {activeTab === 'password' && (
          <Card>
            <CardHeader><CardTitle>Password</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input type="password" placeholder="Current password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
              <Input type="password" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              <Input type="password" placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              <Button onClick={updatePassword} disabled={loading}>Update Password</Button>
            </CardContent>
          </Card>
        )}

        {/* SECURITY */}
        {activeTab === 'security' && (
          <Card>
            <CardHeader><CardTitle>Danger Zone</CardTitle></CardHeader>
            <CardContent>
              {deleteConfirm ? (
                <div className="space-y-4">
                  <p className="text-red-300">This action is irreversible.</p>
                  <Button className="bg-red-600" onClick={deleteAccount} disabled={loading}>
                    Confirm Delete
                  </Button>
                  <Button variant="outline" onClick={() => setDeleteConfirm(false)}>Cancel</Button>
                </div>
              ) : (
                <Button className="bg-red-600" onClick={() => setDeleteConfirm(true)}>
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
