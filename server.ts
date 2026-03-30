import express from 'express';
import { createServer as createViteServer } from 'vite';
import { WebSocketServer } from 'ws';
import path from 'path';

let totalVisits = 0;
let onlineUsers = 0;

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Create HTTP server
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  // Create WebSocket server without attaching to HTTP server directly
  const wss = new WebSocketServer({ noServer: true });

  wss.on('connection', (ws) => {
    onlineUsers++;
    totalVisits++;
    
    // Broadcast updated stats to all connected clients
    const broadcastStats = () => {
      const data = JSON.stringify({ type: 'stats', onlineUsers, totalVisits });
      wss.clients.forEach((client) => {
        if (client.readyState === 1) { // WebSocket.OPEN
          client.send(data);
        }
      });
    };

    broadcastStats();

    ws.on('close', () => {
      onlineUsers = Math.max(0, onlineUsers - 1);
      broadcastStats();
    });
  });

  // Handle upgrade requests manually
  server.on('upgrade', (request, socket, head) => {
    if (request.url === '/ws-stats') {
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
    res.json({ onlineUsers, totalVisits });
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
