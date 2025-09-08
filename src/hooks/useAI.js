import { useState } from 'react';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateBio = async (interests, personality, lookingFor) => {
    setLoading(true);
    setError(null);

    try {
      const prompt = `Create 3 engaging dating app bio variations for someone with these details:
      
Interests: ${interests}
Personality: ${personality}
Looking for: ${lookingFor}

Make each bio unique, authentic, and engaging. Keep them between 2-4 sentences each. Make them sound natural and conversation-starting.

Format as JSON: {"bios": ["bio1", "bio2", "bio3"]}`;

      const completion = await openai.chat.completions.create({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          {
            role: 'system',
            content: 'You are a dating expert who creates compelling, authentic dating app bios that showcase personality and spark meaningful connections.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 500,
      });

      const result = JSON.parse(completion.choices[0].message.content);
      return result.bios;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateDateIdeas = async (interests, location, vibe) => {
    setLoading(true);
    setError(null);

    try {
      const prompt = `Generate 5 unique, creative date ideas based on:
      
Interests: ${interests}
Location: ${location}
Desired vibe: ${vibe}

Make them specific, engaging, and suitable for getting to know someone. Include a mix of activities that encourage conversation.

Format as JSON: {"ideas": [{"title": "Date Title", "description": "Brief description of the date activity"}, ...]}`;

      const completion = await openai.chat.completions.create({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          {
            role: 'system',
            content: 'You are a dating expert who creates memorable, conversation-sparking date ideas tailored to individual preferences and locations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.9,
        max_tokens: 600,
      });

      const result = JSON.parse(completion.choices[0].message.content);
      return result.ideas;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateBio,
    generateDateIdeas,
    loading,
    error,
  };
}