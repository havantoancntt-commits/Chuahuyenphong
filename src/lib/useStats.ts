import { useState, useEffect } from 'react';

interface Stats {
  onlineUsers: number;
  totalVisits: number;
}

function getOrCreateClientId() {
  let id = localStorage.getItem('hp_client_id');
  if (!id) {
    id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('hp_client_id', id);
  }
  return id;
}

function checkAndMarkNewSession() {
  const now = Date.now();
  const lastActive = localStorage.getItem('hp_last_active');
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

  let isNewSession = false;
  // If no last active time, or it's been more than 30 minutes, count as a new session/visit
  if (!lastActive || (now - parseInt(lastActive, 10) > SESSION_TIMEOUT)) {
    isNewSession = true;
  }

  localStorage.setItem('hp_last_active', now.toString());
  return isNewSession;
}

export function useStats() {
  const [stats, setStats] = useState<Stats>({ onlineUsers: 0, totalVisits: 0 });

  useEffect(() => {
    const clientId = getOrCreateClientId();
    const isNewSession = checkAndMarkNewSession();

    // Determine WebSocket URL based on current location
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws-stats?clientId=${clientId}&newSession=${isNewSession}`;
    
    let ws: WebSocket | null = null;
    let reconnectTimer: NodeJS.Timeout;
    let activityInterval: NodeJS.Timeout;
    let pollInterval: NodeJS.Timeout;
    let isPolling = false;

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          setStats({
            onlineUsers: data.onlineUsers,
            totalVisits: data.totalVisits,
          });
        }
      } catch (e) {
        // Ignore fetch errors
      }
    };

    const connect = () => {
      try {
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          if (isPolling) {
            clearInterval(pollInterval);
            isPolling = false;
          }
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'stats') {
              setStats({
                onlineUsers: data.onlineUsers,
                totalVisits: data.totalVisits,
              });
            }
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        ws.onclose = () => {
          // Fallback to polling if WebSocket closes or fails
          if (!isPolling) {
            isPolling = true;
            fetchStats();
            pollInterval = setInterval(fetchStats, 10000); // Poll every 10s
          }
          // Attempt to reconnect after 15 seconds
          reconnectTimer = setTimeout(connect, 15000);
        };
        
        ws.onerror = () => {
          // Error will trigger onclose
        };
      } catch (e) {
        // Fallback to polling if WebSocket creation fails
        if (!isPolling) {
          isPolling = true;
          fetchStats();
          pollInterval = setInterval(fetchStats, 10000);
        }
      }
    };

    connect();

    // Keep session alive while the user is on the page
    activityInterval = setInterval(() => {
      localStorage.setItem('hp_last_active', Date.now().toString());
    }, 60000); // Update every minute

    return () => {
      clearTimeout(reconnectTimer);
      clearInterval(activityInterval);
      clearInterval(pollInterval);
      if (ws) {
        ws.onclose = null; // Prevent reconnect logic
        ws.close();
      }
    };
  }, []);

  return stats;
}
