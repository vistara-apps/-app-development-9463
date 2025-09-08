# SoulConnect - AI-Powered Dating Profile Assistant

**Tagline:** Craft your perfect dating profile & spark meaningful connections.

SoulConnect uses AI to generate compelling dating app bios and suggest personalized date ideas for young singles looking for deeper connections.

## 🚀 Features

### Core Features
- **AI Bio Generator**: Input your interests, personality traits, and what you're looking for, and our AI will craft multiple unique, engaging dating app bios designed to capture attention.
- **Personalized Date Idea Generator**: Based on your inputted interests, location, and desired vibe, receive a curated list of unique and personalized date activities tailored to you and your potential match's preferences.
- **Wallet Integration**: Secure micro-transactions using Base-compatible wallets.

### Future Features (MVP)
- **Photo Analysis & Selection Tool**: Upload your photos and our AI will analyze them based on best practices seen in dating apps to suggest the most engaging and attractive photos to use in your profile.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Wallet Integration**: RainbowKit, Wagmi, Viem
- **AI**: OpenAI API (via OpenRouter)
- **Payments**: x402-axios for micro-transactions
- **Blockchain**: Base (Ethereum L2)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Base-compatible wallet (MetaMask, etc.)
- OpenAI API key (via OpenRouter)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/-app-development-9463.git
   cd -app-development-9463
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   VITE_OPENAI_API_KEY=your_openrouter_api_key_here
   VITE_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AppShell.jsx    # Main app layout
│   ├── BioGenerator.jsx # AI bio generation component
│   ├── DateIdeaGenerator.jsx # Date idea generation component
│   ├── Button.jsx      # Button component
│   ├── Card.jsx        # Card component
│   └── TextInput.jsx   # Input component
├── hooks/              # Custom React hooks
│   ├── useAI.js        # AI generation logic
│   └── usePaymentContext.js # Payment processing
├── App.jsx             # Main app component
├── main.jsx           # App entry point
└── index.css          # Global styles
```

## 🎨 Design System

### Colors
- **Background**: `hsl(220, 20%, 98%)`
- **Text**: `hsl(220, 30%, 15%)`
- **Accent**: `hsl(300, 70%, 60%)`
- **Primary**: `hsl(240, 80%, 50%)`
- **Surface**: `hsl(220, 20%, 100%)`

### Spacing
- **Small**: 8px
- **Medium**: 16px
- **Large**: 24px

### Border Radius
- **Small**: 4px
- **Medium**: 8px
- **Large**: 12px

## 💰 Business Model

**Type**: Micro-transactions
- Pay-per-generation for bios and date ideas ($0.001 each)
- Secure payments via Base blockchain
- No subscription required

## 🔌 API Integration

### OpenAI Integration
The app uses OpenAI's API via OpenRouter for AI generation:

```javascript
// Bio Generation
const generateBio = async (interests, personality, lookingFor) => {
  const prompt = `Create 3 engaging dating app bio variations...`;
  const completion = await openai.chat.completions.create({
    model: 'google/gemini-2.0-flash-001',
    messages: [/* ... */],
    temperature: 0.8,
    max_tokens: 500,
  });
  return JSON.parse(completion.choices[0].message.content).bios;
};
```

### Payment Processing
Micro-transactions are handled via x402-axios:

```javascript
const createSession = async (amount = "$0.001") => {
  const apiClient = withPaymentInterceptor(baseClient, walletClient);
  const response = await apiClient.post("/api/payment", { amount });
  return decodeXPaymentResponse(response.config.headers["X-PAYMENT"]);
};
```

## 🔐 Environment Variables

Create a `.env` file with the following variables:

```env
# OpenAI API Key (via OpenRouter)
VITE_OPENAI_API_KEY=your_openrouter_api_key_here

# WalletConnect Project ID (optional, for enhanced wallet support)
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id_here
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build the Docker image
docker build -t soulconnect .

# Run the container
docker run -p 3000:3000 soulconnect
```

### Manual Deployment
```bash
# Build for production
npm run build

# Preview the build
npm run preview
```

## 🧪 Usage Examples

### Generating a Bio
1. Connect your Base-compatible wallet
2. Navigate to "Bio Generator"
3. Fill in your interests, personality, and what you're looking for
4. Click "Generate Bio ($0.001)"
5. Copy your favorite generated bio

### Getting Date Ideas
1. Navigate to "Date Ideas"
2. Enter shared interests, location, and desired vibe
3. Click "Generate Ideas ($0.001)"
4. Browse personalized date suggestions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please open an issue on GitHub or contact the development team.

## 🔮 Roadmap

- [ ] Photo Analysis & Selection Tool
- [ ] Enhanced AI models for better bio generation
- [ ] Social features and profile sharing
- [ ] Integration with popular dating apps
- [ ] Advanced analytics and success tracking
