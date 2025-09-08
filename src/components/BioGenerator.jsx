import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { TextInput } from './TextInput';
import { useAI } from '../hooks/useAI';
import { usePaymentContext } from '../hooks/usePaymentContext';
import { Copy, Sparkles, Users } from 'lucide-react';

export function BioGenerator() {
  const [formData, setFormData] = useState({
    interests: '',
    personality: '',
    lookingFor: '',
  });
  const [generatedBios, setGeneratedBios] = useState([]);
  const [paid, setPaid] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const { generateBio, loading } = useAI();
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

    if (!formData.interests || !formData.personality || !formData.lookingFor) {
      alert('Please fill in all fields');
      return;
    }

    try {
      // Process payment first
      await createSession('$0.001');
      setPaid(true);
      
      // Generate bios
      const bios = await generateBio(
        formData.interests,
        formData.personality,
        formData.lookingFor
      );
      
      setGeneratedBios(bios);
      setShowResults(true);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Generation failed. Please try again.');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Bio copied to clipboard!');
  };

  const resetForm = () => {
    setShowResults(false);
    setPaid(false);
    setGeneratedBios([]);
    setFormData({
      interests: '',
      personality: '',
      lookingFor: '',
    });
  };

  if (showResults && paid) {
    return (
      <Card className="space-y-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-yellow-400" />
          <h2 className="text-2xl font-bold">Your AI-Generated Bios</h2>
        </div>
        
        <div className="space-y-4">
          {generatedBios.map((bio, index) => (
            <div key={index} className="bg-white/10 rounded-md p-4 backdrop-blur-sm">
              <div className="flex justify-between items-start gap-4">
                <p className="text-white/90 leading-relaxed flex-1">{bio}</p>
                <Button
                  variant="secondary"
                  onClick={() => copyToClipboard(bio)}
                  className="shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <Button onClick={resetForm} variant="secondary" className="flex-1">
            Generate New Bios
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="w-6 h-6 text-pink-400" />
        <h2 className="text-2xl font-bold">AI Bio Generator</h2>
      </div>
      
      <p className="text-white/80">
        Let our AI craft the perfect dating app bio that captures your personality and attracts meaningful connections.
      </p>

      <div className="space-y-4">
        <TextInput
          label="Your Interests"
          placeholder="e.g., hiking, cooking, photography, reading sci-fi..."
          value={formData.interests}
          onChange={handleInputChange('interests')}
        />
        
        <TextInput
          label="Your Personality"
          placeholder="e.g., adventurous, witty, thoughtful, spontaneous..."
          value={formData.personality}
          onChange={handleInputChange('personality')}
        />
        
        <TextInput
          label="What You're Looking For"
          placeholder="e.g., long-term relationship, adventure partner, someone who shares my values..."
          value={formData.lookingFor}
          onChange={handleInputChange('lookingFor')}
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
          {!walletConnected ? 'Connect Wallet to Generate' : 'Generate Bio ($0.001)'}
        </Button>
      </div>
    </Card>
  );
}