# SoulConnect API Documentation

## Overview

SoulConnect integrates with multiple APIs to provide AI-powered bio generation and date idea suggestions. This document outlines the API integrations, data models, and usage patterns.

## Table of Contents

1. [OpenAI Integration](#openai-integration)
2. [Payment Processing](#payment-processing)
3. [Data Models](#data-models)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)
6. [Security](#security)

## OpenAI Integration

### Configuration

```javascript
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});
```

### Bio Generation API

**Endpoint**: `POST /v1/chat/completions`

**Model**: `google/gemini-2.0-flash-001`

**Request Parameters**:
```javascript
{
  model: 'google/gemini-2.0-flash-001',
  messages: [
    {
      role: 'system',
      content: 'You are a dating expert who creates compelling, authentic dating app bios...'
    },
    {
      role: 'user',
      content: 'Create 3 engaging dating app bio variations for someone with these details...'
    }
  ],
  temperature: 0.8,
  max_tokens: 500
}
```

**Response Format**:
```json
{
  "bios": [
    "Bio variation 1...",
    "Bio variation 2...",
    "Bio variation 3..."
  ]
}
```

**Usage Example**:
```javascript
const generateBio = async (interests, personality, lookingFor) => {
  const prompt = `Create 3 engaging dating app bio variations for someone with these details:
  
Interests: ${interests}
Personality: ${personality}
Looking for: ${lookingFor}

Make each bio unique, authentic, and engaging. Keep them between 2-4 sentences each.
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

  return JSON.parse(completion.choices[0].message.content).bios;
};
```

### Date Ideas Generation API

**Request Parameters**:
```javascript
{
  model: 'google/gemini-2.0-flash-001',
  messages: [
    {
      role: 'system',
      content: 'You are a dating expert who creates memorable, conversation-sparking date ideas...'
    },
    {
      role: 'user',
      content: 'Generate 5 unique, creative date ideas based on...'
    }
  ],
  temperature: 0.9,
  max_tokens: 600
}
```

**Response Format**:
```json
{
  "ideas": [
    {
      "title": "Date Title",
      "description": "Brief description of the date activity"
    }
  ]
}
```

**Usage Example**:
```javascript
const generateDateIdeas = async (interests, location, vibe) => {
  const prompt = `Generate 5 unique, creative date ideas based on:
  
Interests: ${interests}
Location: ${location}
Desired vibe: ${vibe}

Make them specific, engaging, and suitable for getting to know someone.
Format as JSON: {"ideas": [{"title": "Date Title", "description": "Brief description"}, ...]}`;

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

  return JSON.parse(completion.choices[0].message.content).ideas;
};
```

## Payment Processing

### Configuration

```javascript
const baseClient = axios.create({
  baseURL: "https://payments.vistara.dev",
  headers: {
    "Content-Type": "application/json",
  },
});

const apiClient = withPaymentInterceptor(baseClient, walletClient);
```

### Payment Session API

**Endpoint**: `POST /api/payment`

**Request Body**:
```json
{
  "amount": "$0.001"
}
```

**Response Headers**:
```
X-PAYMENT: <encoded_payment_response>
```

**Usage Example**:
```javascript
const createSession = async (amount = "$0.001") => {
  if (!walletClient || !walletClient.account) {
    throw new Error("please connect your wallet");
  }
  
  const apiClient = withPaymentInterceptor(baseClient, walletClient);
  const response = await apiClient.post("/api/payment", { amount });
  const paymentResponse = response.config.headers["X-PAYMENT"];
  
  if (!paymentResponse) {
    throw new Error("payment response is absent");
  }
  
  return decodeXPaymentResponse(paymentResponse);
};
```

## Data Models

### User Profile
```typescript
interface UserProfile {
  userId: string;
  walletAddress: string;
  profileData: {
    interests: string;
    personality: string;
    lookingFor: string;
    location?: string;
    preferredVibe?: string;
  };
  preferences: {
    theme: string;
    notifications: boolean;
    autoSave: boolean;
    language: string;
  };
  creationDate: string;
  updatedAt?: string;
}
```

### Bio Generation
```typescript
interface BioGeneration {
  generationId: string;
  userId: string;
  inputPrompt: {
    interests: string;
    personality: string;
    lookingFor: string;
  };
  generatedBios: string[];
  timestamp: string;
  paymentId?: string;
}
```

### Date Idea Generation
```typescript
interface DateIdeaGeneration {
  ideaId: string;
  userId: string;
  inputPrompt: {
    interests: string;
    location: string;
    vibe: string;
  };
  generatedIdeas: Array<{
    title: string;
    description: string;
  }>;
  timestamp: string;
  paymentId?: string;
}
```

## Error Handling

### Error Types

1. **Wallet Errors**
   - `WALLET_NOT_CONNECTED`: User hasn't connected their wallet
   - `INSUFFICIENT_FUNDS`: Not enough balance for transaction
   - `USER_REJECTED`: User cancelled the transaction

2. **API Errors**
   - `API_RATE_LIMIT`: Too many requests
   - `API_UNAVAILABLE`: Service temporarily down
   - `INVALID_RESPONSE`: Malformed API response

3. **Payment Errors**
   - `PAYMENT_FAILED`: Transaction failed
   - `PAYMENT_TIMEOUT`: Transaction timed out
   - `INVALID_AMOUNT`: Invalid payment amount

### Error Response Format

```javascript
{
  error: {
    code: 'ERROR_CODE',
    message: 'Human-readable error message',
    details: {
      // Additional error context
    },
    timestamp: '2024-01-01T00:00:00Z'
  }
}
```

### Error Handling Example

```javascript
try {
  const bios = await generateBio(interests, personality, lookingFor);
  return bios;
} catch (error) {
  if (error.message?.includes('wallet')) {
    throw new Error('WALLET_ERROR: Please check your wallet connection');
  } else if (error.message?.includes('rate limit')) {
    throw new Error('RATE_LIMIT: Please wait before making another request');
  } else {
    throw new Error('GENERATION_FAILED: Unable to generate bios at this time');
  }
}
```

## Rate Limiting

### OpenAI API Limits
- **Requests per minute**: 60
- **Tokens per minute**: 40,000
- **Requests per day**: 1,000

### Payment API Limits
- **Transactions per minute**: 10
- **Daily transaction limit**: 100

### Client-side Rate Limiting

```javascript
const rateLimiter = {
  lastRequest: 0,
  minInterval: 1000, // 1 second between requests
  
  async throttle(fn) {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequest;
    
    if (timeSinceLastRequest < this.minInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minInterval - timeSinceLastRequest)
      );
    }
    
    this.lastRequest = Date.now();
    return fn();
  }
};
```

## Security

### API Key Management
- Store API keys in environment variables
- Never expose keys in client-side code
- Use OpenRouter for additional security layer

### Wallet Security
- All transactions require user confirmation
- No private keys stored or transmitted
- Use established wallet connection libraries

### Data Privacy
- User data stored locally only
- No personal information sent to AI APIs
- Payment processing is anonymous

### Content Filtering
- AI responses are filtered for inappropriate content
- User inputs are sanitized before processing
- Rate limiting prevents abuse

## Testing

### Mock API Responses

```javascript
// Mock bio generation for testing
const mockBioResponse = {
  bios: [
    "Adventure seeker with a love for good coffee and great conversations.",
    "Bookworm by day, chef by night. Looking for someone to share stories with.",
    "Hiking enthusiast who believes the best dates involve getting lost together."
  ]
};

// Mock date ideas response
const mockDateIdeasResponse = {
  ideas: [
    {
      title: "Sunset Photography Walk",
      description: "Explore the city's hidden gems while capturing the golden hour together."
    },
    {
      title: "Cooking Class Adventure",
      description: "Learn to make pasta from scratch at a local culinary school."
    }
  ]
};
```

### Environment Variables for Testing

```env
# Test environment
VITE_OPENAI_API_KEY=test_key_here
VITE_PAYMENT_API_URL=https://test-payments.vistara.dev
VITE_DEV_MODE=true
VITE_DEBUG_PAYMENTS=true
```

## Deployment Considerations

### Production Configuration
- Use production API endpoints
- Enable error logging and monitoring
- Implement proper caching strategies
- Set up health checks for external APIs

### Environment Variables
```env
# Production environment
VITE_OPENAI_API_KEY=prod_key_here
VITE_PAYMENT_API_URL=https://payments.vistara.dev
VITE_DEV_MODE=false
VITE_DEBUG_PAYMENTS=false
```

### Monitoring
- Track API response times
- Monitor error rates
- Set up alerts for service disruptions
- Log user interactions for analytics
