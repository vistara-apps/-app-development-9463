import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Heart } from 'lucide-react';

export function AppShell({ children }) {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="border-b border-white/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-pink-400" />
            <h1 className="text-2xl font-bold text-white">SoulConnect</h1>
          </div>
          <ConnectButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/20 backdrop-blur-sm mt-16">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-white/70">
          <p>Craft your perfect dating profile & spark meaningful connections</p>
        </div>
      </footer>
    </div>
  );
}