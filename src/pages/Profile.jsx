import React, { useState } from 'react';
import { Camera, Mail, User as UserIcon, Trophy, Crown, Lock, Shield, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import api from '../utils/api';

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  
  const [name, setName] = useState(user?.name || '');
  const [editingName, setEditingName] = useState(false);

 
  const [email, setEmail] = useState(user?.email || '');
  const [emailPassword, setEmailPassword] = useState('');
  const [editingEmail, setEditingEmail] = useState(false);

  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

 
  const handleUpdateName = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.put('/user/profile', { name });
      setUser({ ...user, name: data.name });
      setEditingName(false);
      showMessage('success', 'Name updated successfully!');
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to update name');
    } finally {
      setLoading(false);
    }
  };

  
  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put('/user/email', { email, password: emailPassword });
      setUser({ ...user, email });
      setEditingEmail(false);
      setEmailPassword('');
      showMessage('success', 'Email updated successfully!');
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to update email');
    } finally {
      setLoading(false);
    }
  };

 
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showMessage('error', 'Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await api.put('/user/password', { currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showMessage('success', 'Password updated successfully!');
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    
    if (!file.type.startsWith('image/')) {
      showMessage('error', 'Please upload an image file');
      return;
    }

    
    if (file.size > 5 * 1024 * 1024) {
      showMessage('error', 'Image must be less than 5MB');
      return;
    }

    setUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const { data } = await api.put('/user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setUser({ ...user, avatar: data.avatar });
      showMessage('success', 'Avatar updated successfully!');
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to update avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  
  const handleDeleteAccount = async () => {
    if (!deletePassword && user?.provider === 'local') {
      showMessage('error', 'Please enter your password');
      return;
    }

    setLoading(true);

    try {
      await api.delete('/user/account', { data: { password: deletePassword } });
      showMessage('success', 'Account deleted successfully');
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-gray-300">Manage your account settings and preferences</p>
        </div>

        {}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-500 bg-opacity-20 border border-green-500 text-green-300' 
              : 'bg-red-500 bg-opacity-20 border border-red-500 text-red-300'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('general')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      activeTab === 'general'
                        ? 'bg-purple-500 text-white'
                        : 'text-gray-300 hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    <UserIcon className="w-4 h-4 inline mr-2" />
                    General
                  </button>
                  <button
                    onClick={() => setActiveTab('email')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      activeTab === 'email'
                        ? 'bg-purple-500 text-white'
                        : 'text-gray-300 hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </button>
                  {user?.provider === 'local' && (
                    <button
                      onClick={() => setActiveTab('password')}
                      className={`w-full text-left px-4 py-2 rounded-lg transition ${
                        activeTab === 'password'
                          ? 'bg-purple-500 text-white'
                          : 'text-gray-300 hover:bg-white hover:bg-opacity-10'
                      }`}
                    >
                      <Lock className="w-4 h-4 inline mr-2" />
                      Password
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      activeTab === 'security'
                        ? 'bg-purple-500 text-white'
                        : 'text-gray-300 hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    <Shield className="w-4 h-4 inline mr-2" />
                    Security
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {}
          <div className="lg:col-span-3">
            {}
            {activeTab === 'general' && (
              <Card>
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {}
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                          {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            user?.name?.charAt(0).toUpperCase()
                          )}
                        </div>
                        <label className="absolute bottom-0 right-0 bg-purple-500 p-2 rounded-full hover:bg-purple-600 transition cursor-pointer">
                          <Camera className="w-4 h-4 text-white" />
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            disabled={uploadingAvatar}
                          />
                        </label>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">{user?.name}</h3>
                        <p className="text-gray-400 text-sm">{user?.email}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          {user?.isPremium && (
                            <span className="px-2 py-1 bg-yellow-400 bg-opacity-20 border border-yellow-400 border-opacity-50 rounded-full text-yellow-400 text-xs flex items-center">
                              <Crown className="w-3 h-3 mr-1" />
                              Premium
                            </span>
                          )}
                          <span className="px-2 py-1 bg-purple-500 bg-opacity-20 border border-purple-400 border-opacity-50 rounded-full text-purple-300 text-xs">
                            Level {user?.level || 1}
                          </span>
                        </div>
                      </div>
                    </div>

                    {}
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Full Name</label>
                      {editingName ? (
                        <form onSubmit={handleUpdateName} className="flex space-x-2">
                          <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            required
                          />
                          <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save'}
                          </Button>
                          <Button type="button" variant="outline" onClick={() => {
                            setEditingName(false);
                            setName(user?.name || '');
                          }}>
                            Cancel
                          </Button>
                        </form>
                      ) : (
                        <div className="flex items-center justify-between p-4 bg-white bg-opacity-5 rounded-lg">
                          <span className="text-white">{user?.name}</span>
                          <Button size="sm" onClick={() => setEditingName(true)}>
                            Edit
                          </Button>
                        </div>
                      )}
                    </div>

                    {}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-white bg-opacity-5 rounded-lg text-center">
                        <div className="text-2xl font-bold text-white">{user?.xp || 0}</div>
                        <div className="text-gray-400 text-sm">Total XP</div>
                      </div>
                      <div className="p-4 bg-white bg-opacity-5 rounded-lg text-center">
                        <div className="text-2xl font-bold text-white">{user?.coins || 0}</div>
                        <div className="text-gray-400 text-sm">Coins</div>
                      </div>
                      <div className="p-4 bg-white bg-opacity-5 rounded-lg text-center">
                        <div className="text-2xl font-bold text-white">{user?.completedQuests?.length || 0}</div>
                        <div className="text-gray-400 text-sm">Completed</div>
                      </div>
                    </div>

                    {}
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Account Type</label>
                      <div className="p-4 bg-white bg-opacity-5 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-semibold">
                              {user?.isPremium ? 'Premium Account' : 'Free Account'}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {user?.isPremium 
                                ? `Expires: ${new Date(user.premiumExpiresAt).toLocaleDateString()}`
                                : 'Upgrade to unlock premium features'
                              }
                            </p>
                          </div>
                          {!user?.isPremium && (
                            <Button>Upgrade</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {}
            {activeTab === 'email' && (
              <Card>
                <CardHeader>
                  <CardTitle>Email Address</CardTitle>
                </CardHeader>
                <CardContent>
                  {user?.provider === 'google' ? (
                    <div className="p-4 bg-blue-500 bg-opacity-20 border border-blue-400 rounded-lg">
                      <p className="text-blue-300">
                        Your email is managed by Google. You cannot change it here.
                      </p>
                    </div>
                  ) : editingEmail ? (
                    <form onSubmit={handleUpdateEmail} className="space-y-4">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">New Email</label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter new email"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">Confirm Password</label>
                        <Input
                          type="password"
                          value={emailPassword}
                          onChange={(e) => setEmailPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button type="submit" disabled={loading}>
                          {loading ? 'Updating...' : 'Update Email'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => {
                          setEditingEmail(false);
                          setEmail(user?.email || '');
                          setEmailPassword('');
                        }}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white bg-opacity-5 rounded-lg">
                        <div>
                          <p className="text-white font-semibold">Current Email</p>
                          <p className="text-gray-400">{user?.email}</p>
                        </div>
                        <Button onClick={() => setEditingEmail(true)}>
                          Change Email
                        </Button>
                      </div>
                      <div className="p-4 bg-yellow-500 bg-opacity-20 border border-yellow-400 rounded-lg">
                        <p className="text-yellow-300 text-sm">
                          ⚠️ Changing your email will require password verification for security.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {}
            {activeTab === 'password' && user?.provider === 'local' && (
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Current Password</label>
                      <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">New Password</label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                      />
                      <p className="text-gray-400 text-xs mt-1">Must be at least 6 characters</p>
                    </div>
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Confirm New Password</label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                      />
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {}
            {activeTab === 'security' && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {}
                    <div className="p-4 bg-white bg-opacity-5 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Account Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Login Method:</span>
                          <span className="text-white">{user?.provider === 'google' ? 'Google OAuth' : 'Email & Password'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Member Since:</span>
                          <span className="text-white">{new Date(user?.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Role:</span>
                          <span className="text-white capitalize">{user?.role}</span>
                        </div>
                      </div>
                    </div>

                    {}
                    <div className="border border-red-500 border-opacity-30 rounded-lg p-6">
                      <h4 className="text-red-400 font-semibold mb-2 flex items-center">
                        <Trash2 className="w-5 h-5 mr-2" />
                        Danger Zone
                      </h4>
                      <p className="text-gray-400 text-sm mb-4">
                        Once you delete your account, there is no going back. This action is permanent.
                      </p>
                      
                      {showDeleteConfirm ? (
                        <div className="space-y-4">
                          {user?.provider === 'local' && (
                            <div>
                              <label className="block text-white text-sm font-medium mb-2">
                                Enter your password to confirm
                              </label>
                              <Input
                                type="password"
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                                placeholder="Enter your password"
                              />
                            </div>
                          )}
                          <div className="p-4 bg-red-500 bg-opacity-20 border border-red-400 rounded-lg">
                            <p className="text-red-300 text-sm font-semibold">
                              ⚠️ This will permanently delete your account and all associated data:
                            </p>
                            <ul className="text-red-300 text-sm mt-2 space-y-1 list-disc list-inside">
                              <li>All your progress and completed quests</li>
                              <li>Your XP, level, and coins</li>
                              <li>Profile information and avatar</li>
                            </ul>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={handleDeleteAccount}
                              disabled={loading}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              {loading ? 'Deleting...' : 'Yes, Delete My Account'}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowDeleteConfirm(false);
                                setDeletePassword('');
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete Account
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;