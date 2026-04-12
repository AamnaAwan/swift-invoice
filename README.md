# Invoice SaaS

A modern invoice management application built with React and Express.

## Quick Start

### Prerequisites

- Node.js 16+ installed
- MongoDB instance running locally OR MongoDB Atlas account

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd Invoice-saas
   ```

2. **Setup Backend**

   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your MongoDB URI and settings
   npm install
   npm start
   ```

3. **Setup Frontend** (in a new terminal)

   ```bash
   cd client
   cp .env.local.example .env.local  # Optional, already has defaults
   npm install
   npm run dev
   ```

4. Open http://localhost:3000 in your browser

## Deployment

⚠️ **IMPORTANT**: Read [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

**In Summary:**

- **Backend**: Deploy to Render, Railway, or Heroku (NOT Netlify)
- **Frontend**: Deploy to Netlify
- **Database**: Use MongoDB Atlas

### Quick Netlify Deployment

1. Backend deployed separately (e.g., on Render)
2. Set `VITE_API_URL` environment variable in Netlify
3. Push to GitHub
4. Netlify auto-deploys from main branch

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # React pages (Login, Register, Dashboard)
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts (Theme)
│   │   └── api.js         # Axios API client
│   └── vite.config.js     # Vite configuration
│
├── server/                # Express backend
│   ├── routes/           # API routes
│   ├── models/           # MongoDB models
│   ├── middleware/       # Auth middleware
│   └── index.js          # Server entry point
│
├── netlify.toml          # Netlify configuration
└── DEPLOYMENT.md         # Deployment guide
```

## Features

- 🔐 User Authentication (Register, Login, JWT)
- 📄 Create, Read, Update, Delete invoices
- 💾 MongoDB database
- 🎨 Dark/Light theme support
- 📱 Responsive design
- 📊 Invoice filtering and sorting
- 📥 PDF export functionality

## Troubleshooting

### Netlify Deployment Issues

See [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting)

### Local Development

- **Port 3000 already in use**: Change port in `client/vite.config.js`
- **MongoDB connection error**: Ensure MongoDB is running or update MONGODB_URI in `.env`
- **API calls failing**: Check `VITE_API_URL` in client `.env.local`

## Environment Variables

See `.env.example` files in root, client, and server directories.

## License

ISC
