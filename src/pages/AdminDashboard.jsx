import React, { useEffect, useState } from 'react';
import { Users, Target, TrendingUp, DollarSign, Plus, Edit, Trash2, BarChart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import api from '../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [editingQuest, setEditingQuest] = useState(null);
  const [questForm, setQuestForm] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    type: 'free',
    category: 'strength',
    xpReward: 50,
    coinReward: 10,
    duration: 10
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, usersRes, questsRes] = await Promise.all([
        api.get('/admin/statistics'),
        api.get('/admin/users'),
        api.get('/quests')
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setQuests(questsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuest = async (e) => {
    e.preventDefault();
    try {
      if (editingQuest) {
        await api.put(`/admin/quests/${editingQuest._id}`, questForm);
      } else {
        await api.post('/admin/quests', questForm);
      }
      setShowQuestModal(false);
      setEditingQuest(null);
      setQuestForm({
        title: '',
        description: '',
        difficulty: 'Easy',
        type: 'free',
        category: 'strength',
        xpReward: 50,
        coinReward: 10,
        duration: 10
      });
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save quest');
    }
  };

  const handleEditQuest = (quest) => {
    setEditingQuest(quest);
    setQuestForm({
      title: quest.title,
      description: quest.description,
      difficulty: quest.difficulty,
      type: quest.type,
      category: quest.category,
      xpReward: quest.xpReward,
      coinReward: quest.coinReward,
      duration: quest.duration
    });
    setShowQuestModal(true);
  };

  const handleDeleteQuest = async (questId) => {
    if (!confirm('Are you sure you want to delete this quest?')) return;

    try {
      await api.delete(`/admin/quests/${questId}`);
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete quest');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">Manage users, quests, and view statistics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-white">{stats?.totalUsers || 0}</p>
                  <p className="text-blue-200 text-xs mt-1">+{stats?.newUsersLastWeek || 0} this week</p>
                </div>
                <Users className="w-12 h-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Premium Users</p>
                  <p className="text-3xl font-bold text-white">{stats?.premiumUsers || 0}</p>
                  <p className="text-purple-200 text-xs mt-1">{stats?.conversionRate}% conversion</p>
                </div>
                <DollarSign className="w-12 h-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600 to-green-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm">Total Quests</p>
                  <p className="text-3xl font-bold text-white">{stats?.totalQuests || 0}</p>
                  <p className="text-green-200 text-xs mt-1">Active quests</p>
                </div>
                <Target className="w-12 h-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-600 to-orange-600">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-200 text-sm">Completions</p>
                  <p className="text-3xl font-bold text-white">{stats?.completedQuests || 0}</p>
                  <p className="text-yellow-200 text-xs mt-1">+{stats?.completionsLastWeek || 0} this week</p>
                </div>
                <TrendingUp className="w-12 h-12 text-yellow-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quest Management */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Quest Management</CardTitle>
              <Button onClick={() => {
                setEditingQuest(null);
                setQuestForm({
                  title: '',
                  description: '',
                  difficulty: 'Easy',
                  type: 'free',
                  category: 'strength',
                  xpReward: 50,
                  coinReward: 10,
                  duration: 10
                });
                setShowQuestModal(true);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Create Quest
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quests.slice(0, 10).map((quest) => (
                <div key={quest._id} className="flex items-center justify-between p-4 bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-white font-semibold">{quest.title}</h4>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        quest.type === 'premium' ? 'bg-yellow-400 bg-opacity-20 text-yellow-400' : 'bg-green-400 bg-opacity-20 text-green-400'
                      }`}>
                        {quest.type}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs bg-purple-400 bg-opacity-20 text-purple-400">
                        {quest.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{quest.description}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button size="sm" variant="outline" onClick={() => handleEditQuest(quest)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-400 border-red-400" onClick={() => handleDeleteQuest(quest._id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white border-opacity-10">
                    <th className="text-left text-gray-400 font-semibold pb-3">Name</th>
                    <th className="text-left text-gray-400 font-semibold pb-3">Email</th>
                    <th className="text-left text-gray-400 font-semibold pb-3">Type</th>
                    <th className="text-left text-gray-400 font-semibold pb-3">Level</th>
                    <th className="text-left text-gray-400 font-semibold pb-3">XP</th>
                    <th className="text-left text-gray-400 font-semibold pb-3">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 10).map((user) => (
                    <tr key={user._id} className="border-b border-white border-opacity-5">
                      <td className="py-3 text-white">{user.name}</td>
                      <td className="py-3 text-gray-400">{user.email}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.isPremium ? 'bg-yellow-400 bg-opacity-20 text-yellow-400' : 'bg-gray-400 bg-opacity-20 text-gray-400'
                        }`}>
                          {user.isPremium ? 'Premium' : 'Free'}
                        </span>
                      </td>
                      <td className="py-3 text-white">{user.level}</td>
                      <td className="py-3 text-white">{user.xp}</td>
                      <td className="py-3 text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quest Modal */}
      {showQuestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingQuest ? 'Edit Quest' : 'Create New Quest'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateQuest} className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Title</label>
                  <Input
                    value={questForm.title}
                    onChange={(e) => setQuestForm({ ...questForm, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={questForm.description}
                    onChange={(e) => setQuestForm({ ...questForm, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows="3"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Type</label>
                    <select
                      value={questForm.type}
                      onChange={(e) => setQuestForm({ ...questForm, type: e.target.value })}
                      className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="free">Free</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Difficulty</label>
                    <select
                      value={questForm.difficulty}
                      onChange={(e) => setQuestForm({ ...questForm, difficulty: e.target.value })}
                      className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">XP Reward</label>
                    <Input
                      type="number"
                      value={questForm.xpReward}
                      onChange={(e) => setQuestForm({ ...questForm, xpReward: parseInt(e.target.value) })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Coin Reward</label>
                    <Input
                      type="number"
                      value={questForm.coinReward}
                      onChange={(e) => setQuestForm({ ...questForm, coinReward: parseInt(e.target.value) })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Duration (min)</label>
                    <Input
                      type="number"
                      value={questForm.duration}
                      onChange={(e) => setQuestForm({ ...questForm, duration: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Category</label>
                  <select
                    value={questForm.category}
                    onChange={(e) => setQuestForm({ ...questForm, category: e.target.value })}
                    className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="strength">Strength</option>
                    <option value="cardio">Cardio</option>
                    <option value="flexibility">Flexibility</option>
                    <option value="nutrition">Nutrition</option>
                    <option value="habit">Habit</option>
                  </select>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingQuest ? 'Update Quest' : 'Create Quest'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowQuestModal(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;