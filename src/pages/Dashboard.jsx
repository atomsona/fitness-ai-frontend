import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Crown, Target, TrendingUp, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import api from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ xp: 0, coins: 0, level: 1, completed: 0 });
  const [loading, setLoading] = useState(true);

  const profileComplete = useMemo(() => {
    const profile = user?.fitnessProfile;
    return !!profile && Number(profile.age) > 0 && Number(profile.weight) > 0 && Number(profile.height) > 0;
  }, [user]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/quests/progress');
        setStats({
          xp: data?.xp ?? 0,
          coins: data?.coins ?? 0,
          level: data?.level ?? 1,
          completed: data?.completed ?? 0,
        });
      } catch {
        setStats({ xp: 0, coins: 0, level: 1, completed: 0 });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const xpForNextLevel = (level) => {
    const tiers = [1000, 1250, 1500, 2000, 2500];
    if (level <= tiers.length) return tiers[level - 1];
    return 2500 + (level - tiers.length) * 500;
  };

  const levelFromXp = (xpTotal) => {
    let level = 1;
    let remaining = Math.max(0, xpTotal || 0);
    while (remaining >= xpForNextLevel(level) && level < 999) {
      remaining -= xpForNextLevel(level);
      level += 1;
    }
    return { level, remaining, next: xpForNextLevel(level) };
  };

  const xpState = levelFromXp(stats.xp || 0);
  const xpProgress = Math.min((xpState.remaining / xpState.next) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white" style={{ fontFamily: 'var(--font-body)' }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Work+Sans:wght@400;500;600&display=swap');
          :root { --font-display: 'Space Grotesk', ui-sans-serif; --font-body: 'Work Sans', ui-sans-serif; }
          .font-display { font-family: var(--font-display); }
        `}
      </style>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold">
              Welcome back{user?.name ? `, ${user.name}` : ''}.
            </h1>
            <p className="text-white/60 mt-2">
              Your next quest board is waiting. Keep your momentum steady.
            </p>
          </div>
          <Link to="/quests" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-5 py-2 text-sm font-semibold">
            View quests <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-4 mt-10">
          <Card className="bg-gradient-to-br from-purple-600 to-pink-600 border-none">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white/70 text-xs">Level</div>
                  <div className="text-3xl font-bold">{xpState.level}</div>
                </div>
                <Crown className="w-8 h-8 text-yellow-300" />
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>XP progress</span>
                  <span>{xpState.remaining}/{xpState.next}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-black/30">
                  <div className="h-2 rounded-full bg-yellow-300" style={{ width: `${xpProgress}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur">
            <CardContent className="pt-6">
              <div className="text-white/60 text-xs">Total XP</div>
              <div className="text-3xl font-bold mt-2">{stats.xp}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur">
            <CardContent className="pt-6">
              <div className="text-white/60 text-xs">Coins</div>
              <div className="text-3xl font-bold mt-2">{stats.coins}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur">
            <CardContent className="pt-6">
              <div className="text-white/60 text-xs">Completed</div>
              <div className="text-3xl font-bold mt-2">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mt-10">
          <Card className="bg-white/5 border-white/10 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-200" />
                Next steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Complete your fitness profile</div>
                    <div className="text-white/60 text-sm">Improves quest personalization.</div>
                  </div>
                  <Link to="/profile" className="text-sm text-white/80">
                    {profileComplete ? 'Done' : 'Finish'} <ArrowRight className="inline w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Generate your first quest board</div>
                    <div className="text-white/60 text-sm">A 10-minute set to start the week.</div>
                  </div>
                  <Link to="/quests" className="text-sm text-white/80">
                    Open <ArrowRight className="inline w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3 text-white/70">
                  <Zap className="w-5 h-5 text-green-300" />
                  Keep a 3-day streak for a bonus quest.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-pink-300" />
                This week
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="text-white/60">Loading your week...</div>
              ) : (
                <>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm text-white/60">Focus</div>
                    <div className="font-semibold mt-1">Strength + mobility split</div>
                    <div className="text-white/60 text-sm mt-2">3 short sessions, 1 recovery day.</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm text-white/60">Suggested quest</div>
                    <div className="font-semibold mt-1">Posture Reset (8 min)</div>
                    <div className="text-white/60 text-sm mt-2">Low effort, high return.</div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
