import React, { useEffect, useState } from 'react';
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
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [savingFitness, setSavingFitness] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [cancelingPremium, setCancelingPremium] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [clearingHistory, setClearingHistory] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [fitness, setFitness] = useState({
    age: user?.fitnessProfile?.age || '',
    weight: user?.fitnessProfile?.weight || '',
    height: user?.fitnessProfile?.height || '',
    goal: user?.fitnessProfile?.goal || 'stay_fit',
    activityLevel: user?.fitnessProfile?.activityLevel || 'medium',
    gender: user?.fitnessProfile?.gender || 'unknown',
    equipment: user?.fitnessProfile?.equipment || 'none',
  });
  const [prefs, setPrefs] = useState({
    emailUpdates: user?.notificationPrefs?.emailUpdates ?? true,
    questReminders: user?.notificationPrefs?.questReminders ?? true,
    productNews: user?.notificationPrefs?.productNews ?? false,
    shareProfile: user?.privacyPrefs?.shareProfile ?? false,
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [confirmDelete, setConfirmDelete] = useState(false);

  const notify = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  useEffect(() => {
    if (!user) return;
    setName(user.name || '');
    setEmail(user.email || '');
    setFitness({
      age: user.fitnessProfile?.age || '',
      weight: user.fitnessProfile?.weight || '',
      height: user.fitnessProfile?.height || '',
      goal: user.fitnessProfile?.goal || 'stay_fit',
      activityLevel: user.fitnessProfile?.activityLevel || 'medium',
      gender: user.fitnessProfile?.gender || 'unknown',
      equipment: user.fitnessProfile?.equipment || 'none',
    });
    setPrefs({
      emailUpdates: user.notificationPrefs?.emailUpdates ?? true,
      questReminders: user.notificationPrefs?.questReminders ?? true,
      productNews: user.notificationPrefs?.productNews ?? false,
      shareProfile: user.privacyPrefs?.shareProfile ?? false,
    });
  }, [user]);

  useEffect(() => {
    if (activeTab !== 'stats') return;
    const loadStats = async () => {
      setStatsLoading(true);
      try {
        const { data } = await api.get('/quests/progress');
        setStats(data);
      } catch (err) {
        notify(err.response?.data?.message || 'Failed to load stats', 'error');
      } finally {
        setStatsLoading(false);
      }
    };
    loadStats();
    // eslint-disable-next-line
  }, [activeTab]);

 
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

 
  const saveFitnessProfile = async () => {
    setSavingFitness(true);
    try {
      const { data } = await api.post('/user/fitness-profile', fitness);
      setUser({ ...user, fitnessProfile: data.fitnessProfile });
      notify('Fitness profile updated');
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to update fitness profile', 'error');
    } finally {
      setSavingFitness(false);
    }
  };

  const savePreferences = async () => {
    setSavingPrefs(true);
    try {
      const payload = {
        notificationPrefs: {
          emailUpdates: prefs.emailUpdates,
          questReminders: prefs.questReminders,
          productNews: prefs.productNews,
        },
        privacyPrefs: {
          shareProfile: prefs.shareProfile,
        },
      };
      const { data } = await api.put('/user/preferences', payload);
      setUser({
        ...user,
        notificationPrefs: data.notificationPrefs,
        privacyPrefs: data.privacyPrefs,
      });
      notify('Preferences saved');
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to save preferences', 'error');
    } finally {
      setSavingPrefs(false);
    }
  };

  const cancelPremium = async () => {
    setCancelingPremium(true);
    try {
      const { data } = await api.post('/user/premium/cancel');
      setUser({ ...user, isPremium: data.isPremium, premiumExpiresAt: data.premiumExpiresAt });
      notify('Premium cancelled');
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to cancel premium', 'error');
    } finally {
      setCancelingPremium(false);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return;
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      const { data } = await api.put('/user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser({ ...user, avatar: data.avatar });
      setAvatarFile(null);
      notify('Avatar updated');
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to upload avatar', 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const exportData = async () => {
    setExporting(true);
    try {
      const { data } = await api.get('/user/export');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fitness-ai-coach-export.json';
      a.click();
      window.URL.revokeObjectURL(url);
      notify('Export ready');
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to export data', 'error');
    } finally {
      setExporting(false);
    }
  };

  const clearHistory = async () => {
    setClearingHistory(true);
    try {
      const { data } = await api.delete('/user/history');
      setUser({ ...user, completedQuests: data.completedQuests });
      notify('History cleared');
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to clear history', 'error');
    } finally {
      setClearingHistory(false);
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

  const premiumUntil = user?.premiumExpiresAt
    ? new Date(user.premiumExpiresAt).toLocaleDateString()
    : null;

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
        <div className="flex flex-wrap gap-3 mb-10">
          {['general', 'subscription', 'fitness', 'notifications', 'privacy', 'stats', 'email', 'password', 'security'].map(tab => (
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
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <Camera className="w-6 h-6 text-white/70" />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                    className="text-white/80 text-sm"
                  />
                  <Button onClick={uploadAvatar} disabled={!avatarFile || uploadingAvatar}>
                    {uploadingAvatar ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              </div>
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
                Changing your email will update your login email immediately.
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

        {/* SUBSCRIPTION */}
        {activeTab === 'subscription' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-white font-semibold">
                    {user?.isPremium ? 'Premium' : 'Free'}
                  </div>
                  <div className="text-white/60 text-sm">
                    {user?.isPremium
                      ? `Renews ${premiumUntil || 'soon'}`
                      : 'Upgrade to unlock premium quests and coaching.'}
                  </div>
                </div>
                {user?.isPremium && (
                  <Button
                    className="bg-red-600 hover:bg-red-700"
                    onClick={cancelPremium}
                    disabled={cancelingPremium}
                  >
                    {cancelingPremium ? 'Cancelling...' : 'Cancel Premium'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* FITNESS PROFILE */}
        {activeTab === 'fitness' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Fitness Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  type="number"
                  placeholder="Age"
                  value={fitness.age}
                  onChange={(e) => setFitness({ ...fitness, age: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Weight (kg)"
                  value={fitness.weight}
                  onChange={(e) => setFitness({ ...fitness, weight: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Height (cm)"
                  value={fitness.height}
                  onChange={(e) => setFitness({ ...fitness, height: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white"
                  value={fitness.goal}
                  onChange={(e) => setFitness({ ...fitness, goal: e.target.value })}
                >
                  <option value="lose_fat">Lose Fat</option>
                  <option value="gain_muscle">Gain Muscle</option>
                  <option value="stay_fit">Stay Fit</option>
                  <option value="endurance">Endurance</option>
                  <option value="strength">Strength</option>
                </select>

                <select
                  className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white"
                  value={fitness.activityLevel}
                  onChange={(e) => setFitness({ ...fitness, activityLevel: e.target.value })}
                >
                  <option value="low">Low activity</option>
                  <option value="medium">Medium activity</option>
                  <option value="high">High activity</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white"
                  value={fitness.gender}
                  onChange={(e) => setFitness({ ...fitness, gender: e.target.value })}
                >
                  <option value="unknown">Prefer not to say</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>

                <select
                  className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white"
                  value={fitness.equipment}
                  onChange={(e) => setFitness({ ...fitness, equipment: e.target.value })}
                >
                  <option value="none">No equipment</option>
                  <option value="home_basic">Home basic</option>
                  <option value="gym">Gym</option>
                </select>
              </div>

              <Button onClick={saveFitnessProfile} disabled={savingFitness}>
                {savingFitness ? 'Saving...' : 'Save Fitness Profile'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-3 text-white">
                <input
                  type="checkbox"
                  checked={prefs.emailUpdates}
                  onChange={(e) => setPrefs({ ...prefs, emailUpdates: e.target.checked })}
                />
                Email updates
              </label>
              <label className="flex items-center gap-3 text-white">
                <input
                  type="checkbox"
                  checked={prefs.questReminders}
                  onChange={(e) => setPrefs({ ...prefs, questReminders: e.target.checked })}
                />
                Quest reminders
              </label>
              <label className="flex items-center gap-3 text-white">
                <input
                  type="checkbox"
                  checked={prefs.productNews}
                  onChange={(e) => setPrefs({ ...prefs, productNews: e.target.checked })}
                />
                Product news
              </label>
              <Button onClick={savePreferences} disabled={savingPrefs}>
                {savingPrefs ? 'Saving...' : 'Save Preferences'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* PRIVACY */}
        {activeTab === 'privacy' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-3 text-white">
                <input
                  type="checkbox"
                  checked={prefs.shareProfile}
                  onChange={(e) => setPrefs({ ...prefs, shareProfile: e.target.checked })}
                />
                Share my profile for community features
              </label>

              <div className="flex flex-wrap gap-3">
                <Button onClick={savePreferences} disabled={savingPrefs}>
                  {savingPrefs ? 'Saving...' : 'Save Privacy'}
                </Button>
                <Button onClick={exportData} disabled={exporting}>
                  {exporting ? 'Exporting...' : 'Export My Data'}
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={clearHistory}
                  disabled={clearingHistory}
                >
                  {clearingHistory ? 'Clearing...' : 'Clear Quest History'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STATS */}
        {activeTab === 'stats' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Activity Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="text-white/70">Loading stats...</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-white/60 text-xs">XP</div>
                    <div className="text-white text-xl font-semibold">{stats?.xp ?? 0}</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-white/60 text-xs">Coins</div>
                    <div className="text-white text-xl font-semibold">{stats?.coins ?? 0}</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-white/60 text-xs">Level</div>
                    <div className="text-white text-xl font-semibold">{stats?.level ?? 1}</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-white/60 text-xs">Completed</div>
                    <div className="text-white text-xl font-semibold">{stats?.completed ?? 0}</div>
                  </div>
                </div>
              )}
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


