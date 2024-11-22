import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  percentageChange: number;
  lastUpdate: string;
  error?: string;
  icon: React.ReactNode;
  prefix?: string;
  suffix?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  percentageChange,
  lastUpdate,
  error,
  icon,
  prefix = '',
  suffix = ''
}) => {
  const isPositive = percentageChange >= 0;

  if (error) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-800 rounded-2xl shadow-lg p-6 w-full border border-gray-700"
      >
        <div className="flex flex-col items-center space-y-4 text-red-400">
          <AlertCircle className="w-12 h-12" />
          <p className="text-lg font-medium text-center">{error}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-gray-800 rounded-2xl shadow-lg p-6 w-full border border-gray-700"
    >
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2 text-gray-300">
          {icon}
          <h2 className="text-xl font-medium">{title}</h2>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={value}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-baseline space-x-2"
          >
            <motion.span 
              className="text-3xl font-bold text-white"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {prefix}{value}{suffix}
            </motion.span>
            <motion.div
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              className={`flex items-center space-x-1 ${
                isPositive ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-semibold">
                {isPositive ? '+' : ''}{percentageChange.toFixed(2)}%
              </span>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <p className="text-gray-400 text-xs">
          Last updated: {lastUpdate}
        </p>
      </div>
    </motion.div>
  );
};