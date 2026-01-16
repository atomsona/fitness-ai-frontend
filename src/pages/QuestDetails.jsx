import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const QuestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [quest, setQuest] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [skipLoading, setSkipLoading] = useState(false);
  const [rerollLoading, setRerollLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const load = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { data } = await api.get(`/quests/${id}`);
      setQuest(data.quest || data);
      setIsCompleted(!!data.isCompleted);
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || 'Failed to load quest');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [id]);

  const complete = async () => {
    setBtnLoading(true);
    setErrorMsg('');
    try {
      const { data } = await api.post(`/quests/${id}/complete`);
      setIsCompleted(true);

      // ✅ update auth user instantly
      if (data?.user) {
        setUser({
          ...user,
          ...data.user,
          completedQuests: [...(user?.completedQuests || []), id],
        });
      }

      // go back to quests list after short delay (optional)
      setTimeout(() => navigate('/quests'), 300);
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || 'Failed to complete quest');
    } finally {
      setBtnLoading(false);
    }
  };

  const skipQuest = async () => {
    setSkipLoading(true);
    setErrorMsg('');
    try {
      const { data } = await api.post(`/quests/${id}/skip`);
      setUser({ ...user, coins: data.coins });
      navigate('/quests');
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || 'Failed to skip quest');
    } finally {
      setSkipLoading(false);
    }
  };

  const rerollQuest = async () => {
    setRerollLoading(true);
    setErrorMsg('');
    try {
      const { data } = await api.post(`/quests/${id}/reroll`);
      setUser({ ...user, coins: data.coins });
      navigate(`/quests/${data.quest._id}`);
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || 'Failed to reroll quest');
    } finally {
      setRerollLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-10 text-white">
        Loading...
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-10 text-white">
        {errorMsg || 'Quest not found'}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-10">
      <div className="max-w-3xl mx-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
        <button
          onClick={() => navigate('/quests')}
          className="text-white/70 hover:text-white mb-6"
        >
          ← Back to Quests
        </button>

        <h1 className="text-3xl font-bold text-white">{quest.title}</h1>
        <p className="text-white/70 mt-2">{quest.description}</p>

        {errorMsg && (
          <div className="mt-4 bg-red-500/15 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl">
            {errorMsg}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/80">
          {/*
            Coin display mirrors backend difficulty tiers.
          */}
          {(() => {
            const coinsByDifficulty = { Easy: 10, Medium: 15, Hard: 20, Expert: 25 };
            const coinDisplay = coinsByDifficulty[quest.difficulty] ?? 10;
            return (
              <>
          <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-200">{quest.difficulty}</span>
          <span className="px-3 py-1 rounded-full bg-white/10">{quest.category}</span>
          <span className="px-3 py-1 rounded-full bg-white/10">{quest.duration} min</span>
          <span className="px-3 py-1 rounded-full bg-white/10">{quest.xpReward} XP</span>
          <span className="px-3 py-1 rounded-full bg-white/10">{coinDisplay} Coins</span>
              </>
            );
          })()}
        </div>

        <h2 className="text-white text-xl font-semibold mt-8">Exercises</h2>

        <div className="mt-4 space-y-3">
          {(quest.exercises || []).map((ex, idx) => (
            <div key={idx} className="rounded-xl bg-black/20 border border-white/10 p-4">
              <div className="text-white font-semibold">{ex.name}</div>
              <div className="text-white/70 text-sm mt-1">
                {ex.sets ? `${ex.sets} sets` : ''}{ex.reps ? ` • ${ex.reps} reps` : ''}{ex.duration ? ` • ${ex.duration}s` : ''}
              </div>
              {ex.instructions && (
                <div className="text-white/70 text-sm mt-2">{ex.instructions}</div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8">
          <button
            disabled={isCompleted || btnLoading}
            onClick={complete}
            className={`w-full rounded-full py-3 font-semibold text-white transition ${
              isCompleted
                ? 'bg-white/15 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
            }`}
          >
            {isCompleted ? 'Completed ✓' : btnLoading ? 'Completing...' : 'Complete Quest'}
          </button>
          {!isCompleted && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={rerollQuest}
                disabled={rerollLoading}
                className="w-full rounded-full py-3 font-semibold text-white bg-white/10 hover:bg-white/15 transition"
              >
                {rerollLoading ? 'Rerolling...' : 'Reroll (30 coins)'}
              </button>
              <button
                onClick={skipQuest}
                disabled={skipLoading}
                className="w-full rounded-full py-3 font-semibold text-white bg-white/10 hover:bg-white/15 transition"
              >
                {skipLoading ? 'Skipping...' : 'Skip (20 coins)'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestDetails;
