import React, { useEffect, useMemo, useState } from 'react';
import QuestCard from '../components/QuestCard';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Quests = () => {
  const { user, setUser } = useAuth();

  const [activeQuests, setActiveQuests] = useState([]);
  const [completedQuests, setCompletedQuests] = useState([]);
  const [completedLoaded, setCompletedLoaded] = useState(false);
  const [completedLoading, setCompletedLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [shopMessage, setShopMessage] = useState('');
  const [shopLoading, setShopLoading] = useState(false);

  // ✅ Completed dropdown toggle
  const [showCompleted, setShowCompleted] = useState(false);

  // ✅ Survey popup
  const isProfileComplete = (profile) =>
    !!profile &&
    Number(profile.age) > 0 &&
    Number(profile.weight) > 0 &&
    Number(profile.height) > 0;

  const [showSurvey, setShowSurvey] = useState(!isProfileComplete(user?.fitnessProfile));
  const [survey, setSurvey] = useState({
    age: '',
    weight: '',
    height: '',
    goal: 'stay_fit',
    activityLevel: 'medium',
    gender: 'unknown',
    equipment: 'none',
  });

  // ✅ filters
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [category, setCategory] = useState('All');

  const fetchAll = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { data } = await api.get('/quests');
      setActiveQuests(Array.isArray(data) ? data : []);
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || e?.message || 'Failed to load quests');
    } finally {
      setLoading(false);
    }
  };

  const buyDoubleXp = async () => {
    setShopLoading(true);
    setShopMessage('');
    try {
      const { data } = await api.post('/quests/shop/buy', { item: 'doubleXp' });
      setUser({ ...user, coins: data.coins, boosts: data.boosts });
      setShopMessage('Double XP purchased. It will apply to your next quest.');
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || 'Failed to purchase boost');
    } finally {
      setShopLoading(false);
    }
  };

  const fetchCompleted = async () => {
    if (completedLoaded || completedLoading) return;
    setCompletedLoading(true);
    try {
      const { data } = await api.get('/quests/completed');
      setCompletedQuests(Array.isArray(data) ? data : []);
      setCompletedLoaded(true);
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || e?.message || 'Failed to load completed quests');
    } finally {
      setCompletedLoading(false);
    }
  };

  useEffect(() => {
    if (!showSurvey) fetchAll();
    // eslint-disable-next-line
  }, [showSurvey]);

  useEffect(() => {
    setShowSurvey(!isProfileComplete(user?.fitnessProfile));
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    if (showCompleted) fetchCompleted();
    // eslint-disable-next-line
  }, [showCompleted]);

  const submitSurvey = async () => {
    setErrorMsg('');
    try {
      const { data } = await api.post('/user/fitness-profile', survey);
      setUser({ ...user, fitnessProfile: data.fitnessProfile });
      setShowSurvey(false);
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || 'Failed to save survey');
    }
  };

  const filteredActive = useMemo(() => {
    return activeQuests.filter((q) => {
      const s = search.trim().toLowerCase();
      const matchSearch =
        !s ||
        q.title?.toLowerCase().includes(s) ||
        q.description?.toLowerCase().includes(s);

      const matchDiff = difficulty === 'All' || q.difficulty === difficulty;
      const matchCat = category === 'All' || q.category === category;

      return matchSearch && matchDiff && matchCat;
    });
  }, [activeQuests, search, difficulty, category]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-10">
      {/* ✅ SURVEY POPUP */}
      {showSurvey && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl w-full max-w-md space-y-4">
            <h2 className="text-2xl font-bold text-white">Quick Fitness Survey</h2>
            <p className="text-white/70 text-sm">
              We’ll generate quests based on your info.
            </p>

            <input
              className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white"
              placeholder="Age"
              value={survey.age}
              onChange={(e) => setSurvey({ ...survey, age: e.target.value })}
            />
            <input
              className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white"
              placeholder="Weight (kg)"
              value={survey.weight}
              onChange={(e) => setSurvey({ ...survey, weight: e.target.value })}
            />
            <input
              className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white"
              placeholder="Height (cm)"
              value={survey.height}
              onChange={(e) => setSurvey({ ...survey, height: e.target.value })}
            />

            <select
              className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white"
              value={survey.goal}
              onChange={(e) => setSurvey({ ...survey, goal: e.target.value })}
            >
              <option value="lose_fat">Lose Fat</option>
              <option value="gain_muscle">Gain Muscle</option>
              <option value="stay_fit">Stay Fit</option>
              <option value="endurance">Endurance</option>
              <option value="strength">Strength</option>
            </select>

            <select
              className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white"
              value={survey.activityLevel}
              onChange={(e) => setSurvey({ ...survey, activityLevel: e.target.value })}
            >
              <option value="low">Low activity</option>
              <option value="medium">Medium activity</option>
              <option value="high">High activity</option>
            </select>

            <select
              className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white"
              value={survey.gender}
              onChange={(e) => setSurvey({ ...survey, gender: e.target.value })}
            >
              <option value="unknown">Prefer not to say</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>

            <select
              className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white"
              value={survey.equipment}
              onChange={(e) => setSurvey({ ...survey, equipment: e.target.value })}
            >
              <option value="none">No equipment</option>
              <option value="home_basic">Home basic</option>
              <option value="gym">Gym</option>
            </select>

            {errorMsg && (
              <div className="bg-red-500/15 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl">
                {errorMsg}
              </div>
            )}

            <button
              onClick={submitSurvey}
              className="w-full rounded-full py-3 font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition"
            >
              Generate My Quests 🚀
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white">Available Quests</h1>
            <p className="text-white/60 mt-2">Choose your next challenge</p>
          </div>

          {/* ✅ Completed Quests button (top right like your arrow) */}
          <div className="relative">
            <button
              onClick={() => setShowCompleted((v) => !v)}
              className="rounded-full px-5 py-3 font-semibold text-white bg-white/10 border border-white/15 hover:bg-white/15 transition"
            >
              Completed Quests
              <span className="ml-2 text-white/70">({completedQuests.length})</span>
            </button>

            {showCompleted && (
              <div className="absolute right-0 mt-3 w-[380px] max-w-[90vw] rounded-2xl border border-white/10 bg-[#14122a]/95 backdrop-blur p-4 shadow-2xl z-40">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-white font-semibold">Completed</div>
                  <button
                    onClick={() => setShowCompleted(false)}
                    className="text-white/60 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                {completedLoading ? (
                  <div className="text-white/60 text-sm">Loading completed quests...</div>
                ) : completedQuests.length === 0 ? (
                  <div className="text-white/60 text-sm">No completed quests yet.</div>
                ) : (
                  <div className="space-y-2 max-h-[360px] overflow-auto pr-1">
                    {completedQuests.map((q) => (
                      <div
                        key={q._id}
                        className="rounded-xl border border-white/10 bg-white/5 p-3"
                      >
                        <div className="text-white font-semibold">
                          {/* ✅ remove numbers */}
                          {String(q.title).replace(/\s*#\d+\s*$/g, '')}
                        </div>
                        <div className="text-white/60 text-xs mt-1">
                          {q.category} • {q.difficulty} • {q.duration} min
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ✅ error box (no alerts) */}
        {errorMsg && !showSurvey && (
          <div className="mt-6 bg-red-500/15 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl">
            {errorMsg}
          </div>
        )}

        {/* COIN SHOP */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-white font-semibold">Coin Shop</div>
              <div className="text-white/60 text-sm">
                Coins: {user?.coins ?? 0} • Double XP: {user?.boosts?.doubleXp ?? 0}
              </div>
              {user?.isPremium && (
                <div className="text-green-300 text-xs mt-1">
                  Premium bonus: +20% coins on completion.
                </div>
              )}
            </div>
            <button
              onClick={buyDoubleXp}
              className="rounded-full px-5 py-2 font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition"
              disabled={shopLoading}
            >
              {shopLoading ? 'Purchasing...' : 'Buy Double XP (100 coins)'}
            </button>
          </div>
          {shopMessage && (
            <div className="mt-4 text-green-300 text-sm">{shopMessage}</div>
          )}
        </div>

        {/* FILTERS */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
          <div className="text-white font-semibold mb-4">Filters</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white"
              placeholder="Search quests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="All">All difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
              <option value="Expert">Expert</option>
            </select>

            <select
              className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All categories</option>
              <option value="strength">Strength</option>
              <option value="cardio">Cardio</option>
              <option value="flexibility">Flexibility</option>
              <option value="nutrition">Nutrition</option>
              <option value="habit">Habit</option>
            </select>
          </div>
        </div>

        {/* LIST */}
        <div className="mt-8">
          {loading ? (
            <div className="text-white/70 text-center py-20">Loading quests...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredActive.map((q) => (
                <QuestCard key={q._id} quest={q} />
              ))}
              {filteredActive.length === 0 && (
                <div className="text-white/60">
                  No quests match your filters.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quests;
