import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { TextInput } from './TextInput';
import { useAI } from '../hooks/useAI';
import { usePaymentContext } from '../hooks/usePaymentContext';
import { MapPin, Heart, Coffee } from 'lucide-react';

export function DateIdeaGenerator() {
  const [formData, setFormData] = useState({
    interests: '',
    location: '',
    vibe: '',
  });
  const [generatedIdeas, setGeneratedIdeas] = useState([]);
  const [paid, setPaid] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const { generateDateIdeas, loading } = useAI();
  const { createSession, walletConnected } = usePaymentContext();

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleGenerate = async () => {
    if (!walletConnected) {
      alert('Please connect your wallet first!');
      return;
    }

    if (!formData.interests || !formData.location || !formData.vibe) {
      alert('Please fill in all fields');
      return;
    }

    try {
      // Process payment first
      await createSession('$0.001');
      setPaid(true);
      
      // Generate date ideas
      const ideas = await generateDateIdeas(
        formData.interests,
        formData.location,
        formData.vibe
      );
      
      setGeneratedIdeas(ideas);
      setShowResults(true);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Generation failed. Please try again.');
    }
  };

  const resetForm = () => {
    setShowResults(false);
    setPaid(false);
    setGeneratedIdeas([]);
    setFormData({
      interests: '',
      location: '',
      vibe: '',
    });
  };

  if (showResults && paid) {
    return (
      <Card className="space-y-6">
        <div className="flex items-center gap-3">
          <Heart className="w-6 h-6 text-pink-400" />
          <h2 className="text-2xl font-bold">Your Personalized Date Ideas</h2>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {generatedIdeas.map((idea, index) => (
            <div key={index} className="bg-white/10 rounded-md p-4 backdrop-blur-sm">
              <h3 className="font-semibold text-white mb-2">{idea.title}</h3>
              <p className="text-white/80 text-sm leading-relaxed">{idea.description}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <Button onClick={resetForm} variant="secondary" className="flex-1">
            Generate New Ideas
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="space-y-6">
      <div className="flex items-center gap-3">
        <Coffee className="w-6 h-6 text-amber-400" />
        <h2 className="text-2xl font-bold">Date Idea Generator</h2>
      </div>
      
      <p className="text-white/80">
        Get personalized, creative date ideas that match your interests and create memorable experiences.
      </p>

      <div className="space-y-4">
        <TextInput
          label="Shared Interests"
          placeholder="e.g., art, nature, food, music, adventure..."
          value={formData.interests}
          onChange={handleInputChange('interests')}
        />
        
        <TextInput
          label="Location/City"
          placeholder="e.g., San Francisco, New York, London..."
          value={formData.location}
          onChange={handleInputChange('location')}
        />
        
        <TextInput
          label="Desired Vibe"
          placeholder="e.g., casual and fun, romantic, adventurous, cozy..."
          value={formData.vibe}
          onChange={handleInputChange('vibe')}
        />
      </div>

      <div className="border-t border-white/20 pt-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-white/80">Cost per generation:</span>
          <span className="font-semibold text-accent">$0.001</span>
        </div>
        
        <Button
          onClick={handleGenerate}
          loading={loading}
          disabled={!walletConnected || loading}
          className="w-full"
        >
          {!walletConnected ? 'Connect Wallet to Generate' : 'Generate Ideas ($0.001)'}
        </Button>
      </div>
    </Card>
  );
}