import { useState, useEffect, useRef } from 'react';

interface SimulatedMetricConfig {
  initialValue: number;
  minIncrease: number;
  maxIncrease: number;
  updateInterval: number;
  formatValue?: (value: number) => string;
}

export const useSimulatedMetric = ({
  initialValue,
  minIncrease,
  maxIncrease,
  updateInterval,
  formatValue = (v) => v.toLocaleString()
}: SimulatedMetricConfig) => {
  const [value, setValue] = useState(initialValue);
  const [percentageChange, setPercentageChange] = useState(0);
  const previousValue = useRef(initialValue);

  useEffect(() => {
    const interval = setInterval(() => {
      const increase = minIncrease + Math.random() * (maxIncrease - minIncrease);
      setValue(prev => {
        const newValue = prev + increase;
        const changePercent = ((newValue - previousValue.current) / previousValue.current) * 100;
        setPercentageChange(changePercent);
        previousValue.current = newValue;
        return newValue;
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [minIncrease, maxIncrease, updateInterval]);

  return {
    value: formatValue(value),
    rawValue: value,
    percentageChange,
    lastUpdate: new Date().toLocaleTimeString()
  };
};