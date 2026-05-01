# Invoice SaaS

A modern invoice management application built with React and Express.

## Quick Start

### Prerequisites

- Node.js 16+ installed
- Firebase project created with Authentication enabled
- Firebase service account credentials available for the backend

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
   # Edit .env with your Firebase service account credentials
   npm install
   npm start
   ```

3. **Setup Frontend** (in a new terminal)

   ```bash
   cd client
   cp .env.example .env
   # Edit .env with your Firebase web config values
   npm install
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

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
│   ├── models/           # Firestore models / data structures
│   ├── middleware/       # Auth middleware
│   └── index.js          # Server entry point
│
├── netlify.toml          # Netlify configuration
└── DEPLOYMENT.md         # Deployment guide
```

## Features

- 🔐 User Authentication (Firebase Auth)
- 📄 Create, Read, Update, Delete invoices
- 💾 Firebase Firestore database
- 🎨 Dark/Light theme support
- 📱 Responsive design
- 📊 Invoice filtering and sorting
- 📥 PDF export functionality

## Troubleshooting

### Netlify Deployment Issues

See [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting)

### Local Development

- **Port 5173 already in use**: Change port in `client/vite.config.js`
- **Firebase auth or Firestore issue**: Ensure `client/.env` and `server/.env` are configured correctly.
- **API calls failing**: Check `VITE_API_URL` in `client/.env`

## Environment Variables

See `server/.env.example` and `client/.env.example` for the variables required by each side.

- `server/.env.example` contains Firebase Admin service account settings and CORS origin.
- `client/.env.example` contains Firebase web SDK config values and the backend API URL.

## License

ISC
