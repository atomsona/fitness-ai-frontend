import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Dumbbell, Trophy, Target, Users, TrendingUp, Lock, Check, Star, Zap, Heart, Award, ChevronRight, Menu, X } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Quest System",
      description: "Transform workouts into epic adventures with daily and premium quests",
      free: true
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI Coaching",
      description: "Personal AI coach that adapts to your progress and lifestyle",
      free: false
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Rewards & XP",
      description: "Earn coins, badges, and unlock exclusive content",
      free: true
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Social Quests",
      description: "Team up with friends for group challenges",
      free: false
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Progress Tracking",
      description: "Advanced analytics and performance insights",
      free: false
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Seasonal Events",
      description: "Limited-time challenges with exclusive rewards",
      free: true
    }
  ];

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "Basic daily quests",
        "Limited XP rewards",
        "Basic progress tracking",
        "Community access",
        "Ad-supported"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Premium",
      price: "$9.99",
      period: "per month",
      features: [
        "AI Personal Coach",
        "Unlimited premium quests",
        "Advanced analytics",
        "No ads",
        "Priority support",
        "Exclusive events",
        "Real-life rewards"
      ],
      cta: "Start 7-Day Trial",
      popular: true
    }
  ];

  const quests = [
    {
      title: "Morning Warrior",
      difficulty: "Easy",
      xp: 50,
      time: "10 min",
      type: "free",
      description: "Complete 10 push-ups and 5-minute stretch"
    },
    {
      title: "Strength Builder",
      difficulty: "Medium",
      xp: 150,
      time: "30 min",
      type: "premium",
      description: "AI-curated strength training session"
    },
    {
      title: "Cardio Master",
      difficulty: "Hard",
      xp: 300,
      time: "45 min",
      type: "premium",
      description: "Progressive endurance challenge"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-purple-500 bg-opacity-20 backdrop-blur-sm border border-purple-400 border-opacity-30 rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-purple-200 text-sm font-medium">Turn Fitness Into An Adventure</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Level Up Your
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Fitness Journey
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Transform your workouts into epic quests. Get personalized AI coaching, earn rewards, and achieve your fitness goals through gamified challenges.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/register">
                <button className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition">
                  Start Your Quest
                </button>
              </Link>
              <button className="w-full sm:w-auto bg-white bg-opacity-10 backdrop-blur-sm text-white border border-white border-opacity-30 px-8 py-4 rounded-full font-bold text-lg hover:bg-opacity-20 transition">
                Watch Demo
              </button>
            </div>
            <div className="mt-12 flex items-center justify-center space-x-8 text-gray-300">
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-400" />
                <span>7-day premium trial</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-16 bg-black bg-opacity-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Users", value: "50K+" },
              { label: "Quests Completed", value: "1M+" },
              { label: "Avg. Weight Loss", value: "15 lbs" },
              { label: "Success Rate", value: "92%" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to transform your fitness journey into an engaging adventure
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 rounded-2xl p-6 hover:bg-opacity-10 transition group">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl text-white group-hover:shadow-lg group-hover:shadow-purple-500/50 transition">
                    {feature.icon}
                  </div>
                  {!feature.free && (
                    <div className="bg-yellow-400 bg-opacity-20 border border-yellow-400 border-opacity-50 px-3 py-1 rounded-full">
                      <span className="text-yellow-400 text-xs font-semibold">PREMIUM</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section id="quests" className="py-24 bg-black bg-opacity-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Available Quests
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose from hundreds of quests designed to keep you motivated
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {quests.map((quest, i) => (
              <div key={i} className="bg-gradient-to-br from-purple-900 to-indigo-900 border border-purple-500 border-opacity-30 rounded-2xl p-6 hover:border-opacity-60 transition">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    quest.difficulty === 'Easy' ? 'bg-green-400 bg-opacity-20 text-green-400' :
                    quest.difficulty === 'Medium' ? 'bg-yellow-400 bg-opacity-20 text-yellow-400' :
                    'bg-red-400 bg-opacity-20 text-red-400'
                  }`}>
                    {quest.difficulty}
                  </span>
                  {quest.type === 'premium' && (
                    <Lock className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{quest.title}</h3>
                <p className="text-gray-300 mb-4">{quest.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span>⚡ {quest.xp} XP</span>
                    <span>🕐 {quest.time}</span>
                  </div>
                </div>
                <Link to="/register">
                  <button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition">
                    Start Quest
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Choose Your Path
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Start free or unlock the full power of AI coaching
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <div key={i} className={`relative rounded-3xl p-8 ${
                plan.popular 
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 border-4 border-yellow-400' 
                  : 'bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-yellow-400 text-purple-900 px-4 py-1 rounded-full text-sm font-bold">
                      MOST POPULAR
                    </div>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-300 ml-2">/{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-200">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <button className={`w-full py-3 rounded-full font-bold transition ${
                    plan.popular
                      ? 'bg-white text-purple-600 hover:bg-gray-100'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50'
                  }`}>
                    {plan.cta}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-24 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Fitness Adventure?
          </h2>
          <p className="text-xl text-white text-opacity-90 mb-8">
            Join thousands of users who've transformed their fitness journey
          </p>
          <Link to="/register">
            <button className="bg-white text-purple-600 px-12 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition">
              Get Started Free
            </button>
          </Link>
        </div>
      </section>

      
      <footer className="bg-black bg-opacity-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Dumbbell className="w-6 h-6 text-purple-400" />
                <span className="text-white font-bold">Fitness AI Coach</span>
              </div>
              <p className="text-gray-400 text-sm">
                Transform your fitness journey into an epic adventure
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#quests" className="hover:text-white transition">Quests</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            © 2024 Fitness AI Coach. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

