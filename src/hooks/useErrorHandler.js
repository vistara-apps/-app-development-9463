import { useState, useCallback } from 'react';

export function useErrorHandler() {
  const [error, setError] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleError = useCallback((error, context = '') => {
    console.error(`Error in ${context}:`, error);
    
    let userMessage = 'An unexpected error occurred. Please try again.';
    
    // Handle specific error types
    if (error.message?.includes('wallet')) {
      userMessage = 'Wallet connection failed. Please check your wallet and try again.';
    } else if (error.message?.includes('payment')) {
      userMessage = 'Payment processing failed. Please check your wallet balance and try again.';
    } else if (error.message?.includes('API')) {
      userMessage = 'Service temporarily unavailable. Please try again in a moment.';
    } else if (error.message?.includes('network')) {
      userMessage = 'Network error. Please check your connection and try again.';
    } else if (error.code === 'INSUFFICIENT_FUNDS') {
      userMessage = 'Insufficient funds in your wallet. Please add funds and try again.';
    } else if (error.code === 'USER_REJECTED') {
      userMessage = 'Transaction was cancelled. Please try again if you want to proceed.';
    }
    
    setError({
      message: userMessage,
      originalError: error,
      context,
      timestamp: new Date().toISOString()
    });
    setIsError(true);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setIsError(false);
  }, []);

  const retryAction = useCallback(async (action) => {
    clearError();
    try {
      return await action();
    } catch (err) {
      handleError(err, 'retry');
      throw err;
    }
  }, [clearError, handleError]);

  return {
    error,
    isError,
    handleError,
    clearError,
    retryAction
  };
}
