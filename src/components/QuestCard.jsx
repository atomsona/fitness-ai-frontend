import React from 'react';
import { Lock, Trophy, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const QuestCard = ({ quest }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!quest) return null;

  const isLocked = quest.type === 'premium' && !user?.isPremium && user?.role !== 'admin';

  const difficultyColors = {
    Easy: 'bg-green-400 bg-opacity-20 text-green-400',
    Medium: 'bg-yellow-400 bg-opacity-20 text-yellow-400',
    Hard: 'bg-red-400 bg-opacity-20 text-red-400',
    Expert: 'bg-purple-400 bg-opacity-20 text-purple-400'
  };

  return (
    <Card className={`${isLocked ? 'opacity-60' : ''} hover:border-opacity-60 transition`}>
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[quest.difficulty] || ''}`}>
            {quest.difficulty}
          </span>

          {isLocked && <Lock className="w-4 h-4 text-yellow-400" />}
          {quest.completed && <Trophy className="w-4 h-4 text-yellow-400" />}
        </div>
        <CardTitle>{quest.title}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-gray-300 mb-4">{quest.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <div className="flex items-center space-x-4">
            <span>⚡ {quest.xpReward} XP</span>
            <span>🪙 {quest.coinReward} Coins</span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {quest.duration} min
            </span>
          </div>
        </div>

        <Button
          className="w-full"
          disabled={isLocked || quest.completed}
          onClick={() => navigate(`/quests/${quest._id}`)}
        >
          {quest.completed ? 'Completed ✅' : isLocked ? 'Premium Required 👑' : 'Start Quest'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuestCard;
