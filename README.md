# Huyền Phong Phật Đạo - Virtual Temple 3D

<div align="center">
  <img width="1200" height="475" alt="Huyền Phong Phật Đạo" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

An immersive 3D virtual temple experience built with React, Three.js, and Express.

## Features

- 🏯 **3D Virtual Temple** - Explore a beautifully designed temple in 3D
- 🎨 **React + Vite** - Lightning-fast development and production builds
- 🌐 **Real-time Stats** - WebSocket-powered visitor tracking
- 📱 **Responsive Design** - Works on desktop and mobile
- 🔧 **Full-Stack Ready** - Backend Express server + frontend React app

## Run Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set environment variables:**
   Copy `.env.example` to `.env.local` and configure:
   ```bash
   cp .env.example .env.local
   ```
   Then set your `GEMINI_API_KEY` in `.env.local`

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (client + server)
- `npm run build:server` - Build server bundle only
- `npm run start` - Run production server
- `npm run preview` - Preview production build locally
- `npm run lint` - Run TypeScript type checking
- `npm run type-check` - Check TypeScript types
- `npm run clean` - Remove dist folder

## Deployment

### Deploy to Vercel

1. **Push to GitHub** - Ensure your code is committed
2. **Connect to Vercel** - Go to vercel.com and import this repository
3. **Configure Environment Variables** - Add `GEMINI_API_KEY` in Vercel dashboard
4. **Deploy** - Vercel will automatically build and deploy

The `vercel.json` is already configured for optimal Vercel deployment.

## Project Structure

```
├── src/                    # Frontend React components
├── server.ts              # Express backend server
├── index.html             # HTML entry point
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── vercel.json            # Vercel deployment config
└── package.json           # Project dependencies
```

## Tech Stack

- **Frontend:** React 19, Three.js, Framer Motion, Tailwind CSS
- **Backend:** Express, WebSocket (ws)
- **Build Tool:** Vite, esbuild
- **Language:** TypeScript
- **AI Integration:** Google Gemini API

## Troubleshooting

### Port already in use
If port 3000 is already in use, set a different port:
```bash
PORT=3001 npm run dev
```

### Module not found errors
Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

### WebSocket connection failed
- Check if server is running on correct port
- Verify firewall settings
- Check browser console for error messages

## License

MIT License - Feel free to use this project for personal and commercial purposes.

## Author

Ha Van Toan - [havantoancntt@gmail.com](mailto:havantoancntt@gmail.com)