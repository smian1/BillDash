import React from 'react';
import { Bitcoin, Coffee, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { MetricCard } from './components/MetricCard';
import { useBitcoinPrice } from './hooks/useBitcoinPrice';
import { useSimulatedMetric } from './hooks/useSimulatedMetric';

export default function App() {
  const { price, priceChange, lastUpdate, loading, error } = useBitcoinPrice();

  const coffeeMetric = useSimulatedMetric({
    initialValue: 2_000_000_000,
    minIncrease: 1000,
    maxIncrease: 5000,
    updateInterval: 2000,
    formatValue: (v) => Math.floor(v).toLocaleString()
  });

  const smsMetric = useSimulatedMetric({
    initialValue: 8_000_000_000_000,
    minIncrease: 500000,
    maxIncrease: 1000000,
    updateInterval: 1000,
    formatValue: (v) => Math.floor(v).toLocaleString()
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Bitcoin className="w-12 h-12 text-blue-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col items-center justify-center mb-12 space-y-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-blue-500 ring-opacity-50 shadow-xl">
              <img 
                src="https://ca.slack-edge.com/E7T5PNK3P-U01GXV4F256-3270cc667551-512" 
                alt="Bill's Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <motion.div 
              className="absolute inset-0 rounded-full bg-blue-500 mix-blend-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
            />
          </motion.div>
          <h1 className="text-4xl font-bold text-white text-center">
            Bill's Personal Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            title="Bitcoin Price"
            value={price.toLocaleString('en-US', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
            percentageChange={priceChange}
            lastUpdate={lastUpdate}
            error={error}
            icon={<Bitcoin className="w-6 h-6 text-blue-400" />}
            prefix="$"
          />

          <MetricCard
            title="Global Coffee Consumption"
            value={coffeeMetric.value}
            percentageChange={coffeeMetric.percentageChange}
            lastUpdate={coffeeMetric.lastUpdate}
            icon={<Coffee className="w-6 h-6 text-amber-400" />}
            suffix=" cups"
          />

          <MetricCard
            title="SMS Messages Sent"
            value={smsMetric.value}
            percentageChange={smsMetric.percentageChange}
            lastUpdate={smsMetric.lastUpdate}
            icon={<MessageSquare className="w-6 h-6 text-green-400" />}
            suffix=" messages"
          />
        </div>
      </motion.div>
    </div>
  );
}