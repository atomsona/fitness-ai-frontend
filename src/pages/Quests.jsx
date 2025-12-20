import React, { useEffect, useMemo, useState } from 'react';
import { Filter } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import QuestCard from '../components/QuestCard';
import { Button } from '../components/ui/button';
import api from '../utils/api';

const Quests = () => {
  const location = useLocation();

  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    type: 'all',
    difficulty: 'all',
    category: 'all'
  });

  const fetchQuests = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/quests');
      setQuests(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setQuests([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ fetch on first load AND whenever user returns to this page
  useEffect(() => {
    fetchQuests();
    // location.key changes when navigating back from details
  }, [location.key]);

  const filteredQuests = useMemo(() => {
    let out = [...quests];
    if (filters.type !== 'all') out = out.filter(q => q.type === filters.type);
    if (filters.difficulty !== 'all') out = out.filter(q => q.difficulty === filters.difficulty);
    if (filters.category !== 'all') out = out.filter(q => q.category === filters.category);
    return out;
  }, [quests, filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Available Quests</h1>
          <p className="text-gray-300">You always get 10 quests. Finish all to generate new ones.</p>
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

        {loading ? (
          <div className="text-center text-white text-xl py-12">Loading quests...</div>
        ) : filteredQuests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuests.map((quest) => (
              <QuestCard key={quest._id} quest={quest} />
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
