import React, { useState } from 'react';
import { Camera, Mail, User as UserIcon, Trophy, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import api from '../utils/api';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data } = await api.put('/user/profile', { name });
      setUser({ ...user, name: data.name });
      setEditing(false);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Profile</h1>
          <p className="text-gray-300">Manage your account settings</p>
        </div>

        {/* Profile Card */}
        <Card className="mb-8">
          <CardContent className="pt-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full object-cover" />
                  ) : (
                    user?.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <button className="absolute bottom-0 right-0 bg-purple-500 p-2 rounded-full hover:bg-purple-600 transition">
                  <Camera className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                {editing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                    />
                    <div className="flex space-x-2">
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                      <h2 className="text-3xl font-bold text-white">{user?.name}</h2>
                      {user?.isPremium && (
                        <Crown className="w-6 h-6 text-yellow-400" />
                      )}
                    </div>
                    <p className="text-gray-400 mb-4">{user?.email}</p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                      <span className="px-3 py-1 bg-purple-500 bg-opacity-20 border border-purple-400 border-opacity-50 rounded-full text-purple-300 text-sm">
                        Level {user?.level || 1}
                      </span>
                      <span className="px-3 py-1 bg-blue-500 bg-opacity-20 border border-blue-400 border-opacity-50 rounded-full text-blue-300 text-sm">
                        {user?.xp || 0} XP
                      </span>
                      <span className="px-3 py-1 bg-yellow-500 bg-opacity-20 border border-yellow-400 border-opacity-50 rounded-full text-yellow-300 text-sm">
                        {user?.coins || 0} Coins
                      </span>
                    </div>
                    <Button onClick={() => setEditing(true)}>Edit Profile</Button>
                  </>
                )}
                {message && (
                  <p className={`mt-4 text-sm ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                    {message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Completed Quests</p>
                  <p className="text-3xl font-bold text-white">{user?.completedQuests?.length || 0}</p>
                </div>
                <Trophy className="w-10 h-10 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Account Type</p>
                  <p className="text-2xl font-bold text-white">
                    {user?.isPremium ? 'Premium 👑' : 'Free'}
                  </p>
                </div>
                <UserIcon className="w-10 h-10 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Member Since</p>
                  <p className="text-xl font-bold text-white">
                    {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <Mail className="w-10 h-10 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Premium Upgrade */}
        {!user?.isPremium && (
          <Card className="bg-gradient-to-r from-yellow-600 to-orange-600">
            <CardContent className="py-8">
              <div className="text-center">
                <Crown className="w-16 h-16 text-yellow-200 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-white mb-2">Upgrade to Premium</h3>
                <p className="text-yellow-100 mb-6">
                  Unlock AI coaching, premium quests, and exclusive rewards
                </p>
                <Button className="bg-white text-orange-600 hover:bg-gray-100">
                  Upgrade Now - $9.99/month
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Settings */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white bg-opacity-5 rounded-lg">
                <div>
                  <p className="text-white font-semibold">Email Notifications</p>
                  <p className="text-gray-400 text-sm">Receive quest reminders and updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white bg-opacity-5 rounded-lg">
                <div>
                  <p className="text-white font-semibold">Push Notifications</p>
                  <p className="text-gray-400 text-sm">Get notified about new quests</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="pt-4 border-t border-white border-opacity-10">
                <Button variant="outline" className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white">
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;