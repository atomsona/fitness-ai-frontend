import React, { useEffect, useState } from 'react';
import {
  Trophy,
  Target,
  Zap,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import api from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState({
    totalQuests: 0,
    completedQuests: 0,
    weeklyQuests: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const { data } = await api.get('/quests/progress');
      const progressData = Array.isArray(data?.progress) ? data.progress : [];

      setProgress(progressData);

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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     STRIPE UPGRADE HANDLER
  ========================= */
  const handleUpgrade = async () => {
    try {
      const { data } = await api.post('/payment/create-checkout-session');
      window.location.href = data.url;
    } catch (err) {
      console.error('Stripe error:', err);
      alert('Failed to start payment');
    }
  };

  const xpProgress = ((user?.xp || 0) % 1000) / 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <h1 className="text-4xl font-bold text-white mb-8">
          Here&apos;s your fitness progress
        </h1>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

          <Card className="bg-gradient-to-br from-pink-500 to-purple-600">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-pink-200">Level</p>
                  <p className="text-3xl font-bold text-white">
                    {user?.level || 1}
                  </p>
                </div>
                <Trophy className="text-yellow-300 w-10 h-10" />
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs text-pink-200 mb-1">
                  <span>XP Progress</span>
                  <span>{(user?.xp || 0) % 1000}/1000</span>
                </div>
                <div className="w-full bg-purple-900 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-400 text-sm">Total XP</p>
              <p className="text-3xl font-bold text-white">
                {user?.xp || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-400 text-sm">Coins</p>
              <p className="text-3xl font-bold text-white">
                {user?.coins || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-3xl font-bold text-white">
                {stats.completedQuests}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* UPGRADE BANNER */}
        {!user?.isPremium && (
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl p-6 mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Upgrade to Premium 👑
              </h2>
              <p className="text-yellow-100">
                Unlock AI coaching, premium quests, and exclusive rewards
              </p>
            </div>

            <button
              onClick={handleUpgrade}
              className="bg-white text-orange-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition"
            >
              Upgrade Now
            </button>
          </div>
        )}

        {/* WEEKLY PROGRESS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 text-purple-400" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                <div
                  className="bg-purple-500 h-3 rounded-full"
                  style={{
                    width: `${Math.min((stats.weeklyQuests / 7) * 100, 100)}%`
                  }}
                />
              </div>
              <p className="text-gray-400 text-sm">
                {stats.weeklyQuests >= 7
                  ? '🎉 Weekly goal achieved!'
                  : `Complete ${7 - stats.weeklyQuests} more quests`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 text-yellow-400" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-gray-400">Loading...</p>
              ) : (
                <p className="text-gray-400">
                  No completed quests yet. Start your first quest!
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RECENT ACTIVITY */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 text-blue-400" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {progress.length === 0 ? (
              <p className="text-gray-400">
                No activity yet. Start your fitness journey!
              </p>
            ) : (
              progress.slice(0, 5).map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between p-3 bg-white/5 rounded-lg mb-2"
                >
                  <span className="text-white">
                    {item.quest?.title}
                  </span>
                  <span className="text-purple-400">
                    +{item.quest?.xpReward} XP
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Dashboard;
