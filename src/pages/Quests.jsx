import React, { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import QuestCard from '../components/QuestCard';
import { Button } from '../components/ui/button';
import api from '../utils/api';

const Quests = () => {
  const { user, setUser } = useAuth();
  const [quests, setQuests] = useState([]);
  const [filteredQuests, setFilteredQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    difficulty: 'all',
    category: 'all'
  });

  useEffect(() => {
    fetchQuests();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [quests, filters]);

  const fetchQuests = async () => {
    try {
      const { data } = await api.get('/quests');
      setQuests(data);
    } catch (error) {
      console.error('Error fetching quests:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...quests];

    if (filters.type !== 'all') {
      filtered = filtered.filter(q => q.type === filters.type);
    }
    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === filters.difficulty);
    }
    if (filters.category !== 'all') {
      filtered = filtered.filter(q => q.category === filters.category);
    }

    setFilteredQuests(filtered);
  };

  const handleCompleteQuest = async (questId) => {
    try {
      const { data } = await api.post(`/quests/${questId}/complete`);
      
      // Update user data
      setUser(prevUser => ({
        ...prevUser,
        xp: data.user.xp,
        level: data.user.level,
        coins: data.user.coins,
        completedQuests: [...(prevUser.completedQuests || []), questId]
      }));

      alert(`Quest completed! +${data.rewards.xp} XP, +${data.rewards.coins} Coins`);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to complete quest');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Available Quests</h1>
          <p className="text-gray-300">Choose your next challenge</p>
        </div>

        {/* Filters */}
        <div className="bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 rounded-2xl p-6 mb-8">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 text-purple-400 mr-2" />
            <h3 className="text-white font-semibold">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All</option>
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Difficulty</label>
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                className="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All</option>
                <option value="strength">Strength</option>
                <option value="cardio">Cardio</option>
                <option value="flexibility">Flexibility</option>
                <option value="nutrition">Nutrition</option>
                <option value="habit">Habit</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quests Grid */}
        {loading ? (
          <div className="text-center text-white text-xl py-12">Loading quests...</div>
        ) : filteredQuests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuests.map((quest) => (
              <QuestCard key={quest._id} quest={quest} onComplete={handleCompleteQuest} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No quests found with current filters</p>
            <Button onClick={() => setFilters({ type: 'all', difficulty: 'all', category: 'all' })}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quests;
