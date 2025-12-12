import React, { useEffect, useState } from 'react';
import { Trophy, Target, Zap, TrendingUp, Award, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import api from '../utils/api';

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const [progress, setProgress] = useState([]);
  const [quests, setQuests] = useState([]);
  const [stats, setStats] = useState({
    totalQuests: 0,
    completedQuests: 0,
    weeklyQuests: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
    fetchQuests();
  }, []);

  const fetchProgress = async () => {
    try {
      const { data } = await api.get('/quests/progress');

      const progressData = data.progress || [];
      setProgress(progressData);

      // Update user info
      setUser(prev => ({
        ...prev,
        xp: data.xp,
        level: data.level,
        coins: data.coins,
        completedQuests: progressData.map(p => p.quest._id)
      }));

      const completed = progressData.filter(p => p.status === 'completed');
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weeklyCompleted = completed.filter(
        p => p.completedAt && new Date(p.completedAt) >= weekAgo
      );

      setStats({
        totalQuests: progressData.length,
        completedQuests: completed.length,
        weeklyQuests: weeklyCompleted.length
      });
    } catch (error) {
      console.error('Error fetching progress:', error);
      setProgress([]);
      setStats({ totalQuests: 0, completedQuests: 0, weeklyQuests: 0 });
    } finally {
      setLoading(false);
    }
  };

  const fetchQuests = async () => {
    try {
      const { data } = await api.get('/quests');
      setQuests(data);
    } catch (error) {
      console.error('Error fetching quests:', error);
    }
  };

  const handleCompleteQuest = async (questId) => {
    try {
      const { data } = await api.post(`/quests/${questId}/complete`);

      setUser(prevUser => ({
        ...prevUser,
        xp: data.user.xp,
        level: data.user.level,
        coins: data.user.coins,
        completedQuests: [...(prevUser.completedQuests || []), questId]
      }));

      const completedQuest = quests.find(q => q._id === questId);
      setProgress(prev => [
        ...prev,
        { quest: completedQuest, status: 'completed', completedAt: new Date() }
      ]);

      alert(`Quest completed! +${data.rewards?.xp || 0} XP, +${data.rewards?.coins || 0} Coins`);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to complete quest');
    }
  };

  const xpProgress = ((user?.xp || 0) % 1000) / 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-300">Here's your fitness progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-600 to-pink-600">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Level</p>
                  <p className="text-3xl font-bold text-white">{user?.level || 1}</p>
                </div>
                <Trophy className="w-12 h-12 text-yellow-400" />
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-purple-200 mb-1">
                  <span>XP Progress</span>
                  <span>{(user?.xp || 0) % 1000} / 1000</span>
                </div>
                <div className="w-full bg-purple-900 bg-opacity-50 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${xpProgress}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total XP</p>
                  <p className="text-3xl font-bold text-white">{user?.xp || 0}</p>
                </div>
                <Zap className="w-12 h-12 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Coins</p>
                  <p className="text-3xl font-bold text-white">{user?.coins || 0}</p>
                </div>
                <div className="text-4xl">🪙</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Completed</p>
                  <p className="text-3xl font-bold text-white">{stats.completedQuests}</p>
                </div>
                <Target className="w-12 h-12 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Premium Card */}
        {!user?.isPremium && (
          <Card className="bg-gradient-to-r from-yellow-600 to-orange-600 mb-8">
            <CardContent className="py-6 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Upgrade to Premium 👑</h3>
                <p className="text-yellow-100">Unlock AI coaching, premium quests, and exclusive rewards</p>
              </div>
              <button className="bg-white text-orange-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition">
                Upgrade Now
              </button>
            </CardContent>
          </Card>
        )}

        {/* Weekly Progress & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-purple-400" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Quests Completed</span>
                    <span className="text-white font-semibold">{stats.weeklyQuests}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((stats.weeklyQuests / 7) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">
                  {stats.weeklyQuests >= 7 ? 
                    '🎉 Amazing! You completed your weekly goal!' : 
                    `Complete ${7 - stats.weeklyQuests} more quests to reach your weekly goal`
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-6 h-6 mr-2 text-yellow-400" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-gray-400">Loading...</p>
              ) : progress.filter(p => p.status === 'completed').slice(0, 3).length > 0 ? (
                <div className="space-y-3">
                  {progress.filter(p => p.status === 'completed').slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 bg-white bg-opacity-5 rounded-lg">
                      <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold">{item.quest?.title}</p>
                        <p className="text-gray-400 text-sm">{new Date(item.completedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No completed quests yet. Start your first quest!</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-6 h-6 mr-2 text-blue-400" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : progress.length > 0 ? (
              <div className="space-y-3">
                {progress.slice(0, 5).map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === 'completed' ? 'bg-green-400' : 
                        item.status === 'in_progress' ? 'bg-yellow-400' : 
                        'bg-gray-400'
                      }`}></div>
                      <div>
                        <p className="text-white font-semibold">{item.quest?.title}</p>
                        <p className="text-gray-400 text-sm">
                          {item.status === 'completed' ? 'Completed' : 
                           item.status === 'in_progress' ? 'In Progress' : 
                           'Not Started'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-purple-400 font-semibold">+{item.quest?.xpReward} XP</p>
                      <p className="text-gray-400 text-sm">+{item.quest?.coinReward} 🪙</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No activity yet. Start your fitness journey!</p>
            )}
          </CardContent>
        </Card>

        {/* Available Quests */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-6 h-6 mr-2 text-green-400" />
              Available Quests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {quests.length === 0 ? (
              <p className="text-gray-400">No quests available right now.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quests.map((quest) => {
                  const isCompleted = user?.completedQuests?.includes(quest._id);
                  return (
                    <div
                      key={quest._id}
                      className={`p-4 rounded-lg bg-white bg-opacity-5 hover:bg-opacity-10 transition ${
                        isCompleted ? 'opacity-60' : ''
                      }`}
                    >
                      <h3 className="text-white font-semibold text-lg">{quest.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">{quest.description}</p>
                      <p className="text-gray-300 text-sm">
                        ⚡ {quest.xpReward} XP | 🪙 {quest.coinReward} Coins | ⏱ {quest.duration} min
                      </p>
                      <button
                        className="mt-2 w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                        disabled={isCompleted}
                        onClick={() => handleCompleteQuest(quest._id)}
                      >
                        {isCompleted ? 'Completed ✓' : 'Start Quest'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Dashboard;
