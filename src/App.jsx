import React, { useState } from 'react';
import { AppShell } from './components/AppShell';
import { Card } from './components/Card';
import { Button } from './components/Button';
import { BioGenerator } from './components/BioGenerator';
import { DateIdeaGenerator } from './components/DateIdeaGenerator';
import { ToastContainer, useToast } from './components/Toast';
import { Users, Coffee, Star, Zap } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const toast = useToast();

  const renderContent = () => {
    switch (activeTab) {
      case 'bio':
        return <BioGenerator />;
      case 'dates':
        return <DateIdeaGenerator />;
      default:
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <Card className="text-center space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
                  SoulConnect
                </h1>
                <p className="text-xl text-white/90 max-w-2xl mx-auto">
                  Craft your perfect dating profile & spark meaningful connections with AI-powered bios and personalized date ideas.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => setActiveTab('bio')} className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Generate Bio
                </Button>
                <Button onClick={() => setActiveTab('dates')} variant="secondary" className="flex items-center gap-2">
                  <Coffee className="w-4 h-4" />
                  Date Ideas
                </Button>
              </div>
            </Card>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-pink-400" />
                  <h3 className="text-xl font-semibold">AI Bio Generator</h3>
                </div>
                <p className="text-white/80">
                  Input your interests and personality, and our AI will craft multiple unique, engaging dating app bios designed to capture attention and showcase who you really are.
                </p>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Star className="w-4 h-4" />
                  <span>Save time with high-quality, personalized bios</span>
                </div>
              </Card>

              <Card className="space-y-4">
                <div className="flex items-center gap-3">
                  <Coffee className="w-8 h-8 text-amber-400" />
                  <h3 className="text-xl font-semibold">Date Idea Generator</h3>
                </div>
                <p className="text-white/80">
                  Based on your interests and location, receive curated lists of unique and personalized date activities that go beyond the usual coffee meetups.
                </p>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Star className="w-4 h-4" />
                  <span>Discover memorable and engaging experiences</span>
                </div>
              </Card>
            </div>

            {/* How It Works */}
            <Card className="space-y-6">
              <h3 className="text-2xl font-semibold text-center">How It Works</h3>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-accent" />
                  </div>
                  <h4 className="font-semibold">1. Connect Wallet</h4>
                  <p className="text-sm text-white/70">Connect your Base-compatible wallet for secure micro-transactions</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-accent" />
                  </div>
                  <h4 className="font-semibold">2. Share Your Details</h4>
                  <p className="text-sm text-white/70">Tell us about your interests, personality, and what you're looking for</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-accent" />
                  </div>
                  <h4 className="font-semibold">3. Get AI Results</h4>
                  <p className="text-sm text-white/70">Receive personalized bios and date ideas for just $0.001 each</p>
                </div>
              </div>
            </Card>
          </div>
        );
    }
  };

  return (
    <AppShell>
      {/* Navigation */}
      <nav className="flex justify-center mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'home'
                  ? 'bg-accent text-white shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('bio')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'bio'
                  ? 'bg-accent text-white shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Bio Generator
            </button>
            <button
              onClick={() => setActiveTab('dates')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'dates'
                  ? 'bg-accent text-white shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Date Ideas
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      {renderContent()}
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toast.toasts} />
    </AppShell>
  );
}

export default App;
