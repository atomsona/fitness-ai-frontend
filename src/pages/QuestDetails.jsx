import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';

const QuestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState('');

  const loadQuest = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/quests/${id}`);
      setQuest(data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load quest');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuest();
  }, [id]);

  const complete = async () => {
    if (!quest || quest.completed) return;

    try {
      setCompleting(true);
      const { data } = await api.post(`/quests/${id}/complete`);

      // ✅ update global user instantly (xp/coins)
      if (data.user) updateUser(data.user);

      // ✅ update local quest instantly
      setQuest(prev => prev ? { ...prev, completed: true } : prev);

      // go back to quests list (Quests.jsx refetches automatically via location.key)
      navigate('/quests');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to complete quest');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center text-white">
        Loading quest...
      </div>
    );
  }

  if (error || !quest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center text-white">
        {error || 'Quest not found'}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <div className="max-w-4xl mx-auto px-4 py-12 text-white">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">{quest.title}</h1>
          <p className="text-gray-300">{quest.description}</p>
        </div>

        <div className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl p-6 mb-8">
          <div className="flex flex-wrap gap-4 text-sm text-gray-200">
            <span>⚡ {quest.xpReward} XP</span>
            <span>🪙 {quest.coinReward} Coins</span>
            <span>⏱ {quest.duration} min</span>
            <span>🏷 {quest.category}</span>
            <span>🎯 {quest.difficulty}</span>
          </div>
        </div>

        <div className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Exercises</h2>

          <div className="space-y-4">
            {(quest.exercises || []).map((ex, i) => (
              <div key={i} className="bg-black bg-opacity-20 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{ex.name}</h3>
                  <div className="text-gray-300 text-sm">
                    {ex.sets ? `${ex.sets} sets` : ''}
                    {ex.reps ? ` • ${ex.reps} reps` : ''}
                    {ex.duration ? ` • ${ex.duration}s` : ''}
                  </div>
                </div>
                {ex.howTo && (
                  <p className="text-gray-300 mt-2 text-sm">How to: {ex.howTo}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={() => navigate('/quests')}>
              Back
            </Button>

            <Button
              onClick={complete}
              disabled={quest.completed || completing}
              className={quest.completed ? 'bg-green-600 hover:bg-green-600' : ''}
            >
              {quest.completed ? 'Completed ✅' : completing ? 'Completing...' : 'Complete Quest'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestDetails;
