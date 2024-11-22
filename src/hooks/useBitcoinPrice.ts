import { useState, useEffect, useCallback } from 'react';

interface PriceData {
  price: number;
  priceChange: number;
  lastUpdate: string;
}

const WEBSOCKET_ENDPOINT = 'wss://ws.coincap.io/prices?assets=bitcoin';
const FALLBACK_API = 'https://api.coincap.io/v2/assets/bitcoin';

export const useBitcoinPrice = () => {
  const [data, setData] = useState<PriceData>({
    price: 0,
    priceChange: 0,
    lastUpdate: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const fetchFallbackPrice = async () => {
    try {
      const response = await fetch(FALLBACK_API);
      const data = await response.json();
      return {
        price: parseFloat(data.data.priceUsd),
        priceChange: parseFloat(data.data.changePercent24Hr),
      };
    } catch (err) {
      throw new Error('Failed to fetch price data');
    }
  };

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;
    let lastPrice = 0;

    const connect = async () => {
      try {
        // Get initial price from REST API
        const initialData = await fetchFallbackPrice();
        lastPrice = initialData.price;
        setData({
          price: initialData.price,
          priceChange: initialData.priceChange,
          lastUpdate: new Date().toLocaleTimeString(),
        });
        setLoading(false);

        // Connect to WebSocket for live updates
        ws = new WebSocket(WEBSOCKET_ENDPOINT);

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            const newPrice = parseFloat(message.bitcoin);
            
            if (newPrice && !isNaN(newPrice)) {
              setData(prev => {
                const priceChange = lastPrice > 0 
                  ? ((newPrice - lastPrice) / lastPrice) * 100 
                  : prev.priceChange;
                
                lastPrice = newPrice;
                
                return {
                  price: newPrice,
                  priceChange: priceChange,
                  lastUpdate: new Date().toLocaleTimeString(),
                };
              });
              setError('');
            }
          } catch (err) {
            console.error('Error parsing message:', err);
          }
        };

        ws.onopen = () => {
          setError('');
          setRetryCount(0);
        };

        ws.onclose = () => {
          if (retryCount < 3) {
            reconnectTimeout = setTimeout(() => {
              setRetryCount(prev => prev + 1);
              connect();
            }, 3000);
          } else {
            setError('Connection lost. Please refresh the page.');
          }
        };

        ws.onerror = () => {
          setError('Connection issues. Attempting to reconnect...');
          ws?.close();
        };
      } catch (err) {
        setError('Unable to fetch price data. Please try again later.');
        setLoading(false);
      }
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      if (ws) {
        ws.close();
      }
    };
  }, [retryCount]);

  return { ...data, loading, error };
};