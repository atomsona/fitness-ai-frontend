import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Trophy, Zap, Target, Clock, Award, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Button } from '../components/ui/button';

const AdminDashboard = () => {
  const { user, setUser } = useAuth();

  // Stats & progress
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState({ totalQuests: 0, completedQuests: 0, weeklyQuests: 0 });
  const [loading, setLoading] = useState(true);

  // Quest form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    type: 'free',
    category: 'strength',
    xpReward: 0,
    coinReward: 0,
    duration: 0,
    exercises: []
  });
  const [exerciseInput, setExerciseInput] = useState({ name: '', sets: '', reps: '', duration: '' });
  const [imageFile, setImageFile] = useState(null);
  const [loadingQuest, setLoadingQuest] = useState(false);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const { data } = await api.get('/quests/progress');
      const progressData = Array.isArray(data) ? data : [];
      setProgress(progressData);

      const completed = progressData.filter(p => p.status === 'completed');
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weeklyCompleted = completed.filter(p => p.completedAt && new Date(p.completedAt) >= weekAgo);

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

  // Quest form handlers
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addExercise = () => {
    if (exerciseInput.name) {
      setForm({
        ...form,
        exercises: [
          ...form.exercises,
          {
            ...exerciseInput,
            sets: +exerciseInput.sets,
            reps: +exerciseInput.reps,
            duration: +exerciseInput.duration
          }
        ]
      });
      setExerciseInput({ name: '', sets: '', reps: '', duration: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingQuest(true);
    try {
      const formData = new FormData();
      for (const key in form) {
        if (key === 'exercises') formData.append('exercises', JSON.stringify(form.exercises));
        else formData.append(key, form[key]);
      }
      if (imageFile) formData.append('image', imageFile);

      await api.post('/admin/quests', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert('Quest added successfully!');
      // Reset form
      setForm({ title:'', description:'', difficulty:'Easy', type:'free', category:'strength', xpReward:0, coinReward:0, duration:0, exercises:[] });
      setImageFile(null);
      fetchProgress();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to add quest');
    } finally {
      setLoadingQuest(false);
    }
  };

  // XP progress
  const xpProgress = ((user?.xp || 0) % 1000) / 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>

        {/* Stats cards */}
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
                  <div className="bg-yellow-400 h-2 rounded-full transition-all duration-500" style={{ width: `${xpProgress}%` }}></div>
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
                  <p className="text-gray-400 text-sm">Completed</p>
                  <p className="text-3xl font-bold text-white">{stats.completedQuests}</p>
                </div>
                <Target className="w-12 h-12 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Weekly Completed</p>
                  <p className="text-3xl font-bold text-white">{stats.weeklyQuests}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Quest Form */}
        <div className="mt-8 bg-white bg-opacity-10 p-6 rounded-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Add New Quest</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} required className="w-full p-2 rounded bg-white bg-opacity-20 text-white"/>
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required className="w-full p-2 rounded bg-white bg-opacity-20 text-white"/>

            <div className="flex gap-4">
              <select name="difficulty" value={form.difficulty} onChange={handleChange} className="p-2 rounded bg-white bg-opacity-20 text-white">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
                <option>Expert</option>
              </select>
              <select name="type" value={form.type} onChange={handleChange} className="p-2 rounded bg-white bg-opacity-20 text-white">
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
              <select name="category" value={form.category} onChange={handleChange} className="p-2 rounded bg-white bg-opacity-20 text-white">
                <option value="strength">Strength</option>
                <option value="cardio">Cardio</option>
                <option value="flexibility">Flexibility</option>
                <option value="nutrition">Nutrition</option>
                <option value="habit">Habit</option>
              </select>
            </div>

            <div className="flex gap-4">
              <input type="number" name="xpReward" placeholder="XP Reward" value={form.xpReward} onChange={handleChange} className="p-2 rounded bg-white bg-opacity-20 text-white"/>
              <input type="number" name="coinReward" placeholder="Coin Reward" value={form.coinReward} onChange={handleChange} className="p-2 rounded bg-white bg-opacity-20 text-white"/>
              <input type="number" name="duration" placeholder="Duration (min)" value={form.duration} onChange={handleChange} className="p-2 rounded bg-white bg-opacity-20 text-white"/>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-semibold">Exercises</h4>
              <div className="flex gap-2">
                <input placeholder="Name" value={exerciseInput.name} onChange={(e)=>setExerciseInput({...exerciseInput,name:e.target.value})} className="p-2 rounded bg-white bg-opacity-20 text-white"/>
                <input placeholder="Sets" type="number" value={exerciseInput.sets} onChange={(e)=>setExerciseInput({...exerciseInput,sets:e.target.value})} className="p-2 rounded bg-white bg-opacity-20 text-white"/>
                <input placeholder="Reps" type="number" value={exerciseInput.reps} onChange={(e)=>setExerciseInput({...exerciseInput,reps:e.target.value})} className="p-2 rounded bg-white bg-opacity-20 text-white"/>
                <input placeholder="Duration" type="number" value={exerciseInput.duration} onChange={(e)=>setExerciseInput({...exerciseInput,duration:e.target.value})} className="p-2 rounded bg-white bg-opacity-20 text-white"/>
                <button type="button" onClick={addExercise} className="bg-purple-500 px-4 rounded text-white">Add</button>
              </div>
              {form.exercises.length>0 && <ul className="text-white mt-2">{form.exercises.map((ex,i)=><li key={i}>{ex.name} - {ex.sets}x{ex.reps} ({ex.duration} min)</li>)}</ul>}
            </div>

            <div>
              <input type="file" accept="image/*" onChange={(e)=>setImageFile(e.target.files[0])} />
            </div>

            <Button type="submit" disabled={loadingQuest}>{loadingQuest ? 'Adding...' : 'Add Quest'}</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
