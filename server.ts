import express from 'express';
import { createServer as createViteServer } from 'vite';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import fs from 'fs';

const STATS_DIR = path.join(process.cwd(), '.data');
const STATS_FILE = path.join(STATS_DIR, 'stats.json');

// Ensure stats directory exists
if (!fs.existsSync(STATS_DIR)) {
  fs.mkdirSync(STATS_DIR, { recursive: true });
}

let totalVisits = 0;
// Load persisted stats if available
if (fs.existsSync(STATS_FILE)) {
  try {
    const data = JSON.parse(fs.readFileSync(STATS_FILE, 'utf-8'));
    totalVisits = data.totalVisits || 0;
  } catch (e) {
    console.error("Error reading stats file", e);
  }
}

// Debounced save to avoid disk I/O bottlenecks during high traffic
let saveTimeout: NodeJS.Timeout | null = null;
function saveStats() {
  if (saveTimeout) return;
  saveTimeout = setTimeout(() => {
    try {
      fs.writeFileSync(STATS_FILE, JSON.stringify({ totalVisits }));
    } catch (e) {
      console.error("Error saving stats file", e);
    }
    saveTimeout = null;
  }, 2000);
}

// Map to track active connections per unique client ID
// Using a Set of WebSockets handles multiple tabs from the same client gracefully
const activeClients = new Map<string, Set<WebSocket>>();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Create HTTP server
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  // Create WebSocket server without attaching to HTTP server directly
  const wss = new WebSocketServer({ noServer: true });

  // Heartbeat to detect disconnected clients (e.g., closed laptop, lost network)
  const interval = setInterval(() => {
    wss.clients.forEach((ws: any) => {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });

  wss.on('connection', (ws: any, request) => {
    ws.isAlive = true;
    ws.on('pong', () => { ws.isAlive = true; });

    const url = new URL(request.url || '', `http://${request.headers.host}`);
    const clientId = url.searchParams.get('clientId') || 'unknown';
    const isNewSession = url.searchParams.get('newSession') === 'true';

    // Only increment total visits for genuinely new sessions
    if (isNewSession) {
      totalVisits++;
      saveStats();
    }

    // Track active connections per client ID
    if (!activeClients.has(clientId)) {
      activeClients.set(clientId, new Set());
    }
    activeClients.get(clientId)!.add(ws);
    
    // Broadcast updated stats to all connected clients
    const broadcastStats = () => {
      const data = JSON.stringify({ 
        type: 'stats', 
        onlineUsers: activeClients.size, 
        totalVisits 
      });
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    };

    broadcastStats();

    ws.on('close', () => {
      const clientConnections = activeClients.get(clientId);
      if (clientConnections) {
        clientConnections.delete(ws);
        if (clientConnections.size === 0) {
          activeClients.delete(clientId);
        }
      }
      broadcastStats();
    });
  });

  // Handle upgrade requests manually
  server.on('upgrade', (request, socket, head) => {
    // Fix: Match the pathname without query parameters
    const pathname = request.url ? request.url.split('?')[0] : '';
    if (pathname === '/ws-stats') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
    // Let Vite handle other upgrade requests (like HMR)
  });

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/stats", (req, res) => {
    res.json({ onlineUsers: activeClients.size, totalVisits });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

startServer();
