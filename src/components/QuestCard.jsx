import React from 'react';
import { Trophy, Clock, Zap, CheckCircle2, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuestCard = ({ quest, onStart }) => {
  const navigate = useNavigate();
  const coinsByDifficulty = {
    Easy: 10,
    Medium: 15,
    Hard: 20,
    Expert: 25,
  };
  const coinDisplay = coinsByDifficulty[quest.difficulty] ?? 10;

  const start = () => {
    if (onStart) onStart(quest);
    navigate(`/quests/${quest._id}`);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-200">
            {quest.difficulty}
          </span>
          <h3 className="text-white text-xl font-bold mt-3">{quest.title}</h3>
          <p className="text-white/70 mt-2">{quest.description}</p>

          <div className="flex flex-wrap gap-4 mt-4 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              {quest.xpReward} XP
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              {coinDisplay} Coins
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {quest.duration} min
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={start}
        className="mt-5 w-full rounded-full py-3 font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition flex items-center justify-center gap-2"
      >
        <Play className="w-4 h-4" />
        Start Quest
      </button>
    </div>
  );
};

export default QuestCard;
