import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface PriceCardProps {
  price: number;
  priceChange: number;
  lastUpdate: string;
  error?: string;
}

export const PriceCard: React.FC<PriceCardProps> = ({ 
  price, 
  priceChange, 
  lastUpdate,
  error 
}) => {
  const prevPriceRef = useRef(price);
  const isPositive = priceChange >= 0;
  const priceChanged = prevPriceRef.current !== price;

  useEffect(() => {
    prevPriceRef.current = price;
  }, [price]);

  if (error) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-2xl border border-gray-700"
      >
        <div className="flex flex-col items-center space-y-4 text-red-400">
          <AlertCircle className="w-12 h-12" />
          <p className="text-lg font-medium text-center">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-2xl border border-gray-700"
    >
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-gray-300 text-xl font-medium">Bitcoin Price</h2>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={price}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-baseline space-x-2"
          >
            <motion.span 
              className="text-5xl md:text-7xl font-bold text-white"
              animate={{ scale: priceChanged ? 1.02 : 1 }}
              transition={{ duration: 0.2 }}
            >
              ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </motion.span>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`flex items-center space-x-1 ${
                isPositive ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-6 h-6" />
              ) : (
                <TrendingDown className="w-6 h-6" />
              )}
              <span className="text-xl font-semibold">
                {priceChange.toFixed(2)}%
              </span>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <p className="text-gray-400 text-sm">
          Last updated: {lastUpdate}
        </p>
      </div>
    </motion.div>
  );
};