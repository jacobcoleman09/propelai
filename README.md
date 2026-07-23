# PropelAI

AI-powered web app giving students and entrepreneurs three tools in one place:

1. **Resume and Cover Letter Builder** — enter your experience and a target job, get an ATS-optimized resume and matching cover letter with improvement notes.
2. **Mock Interview Simulator** — pick a job role, answer tailored interview questions, get scored on clarity, depth, and quality.
3. **Business Idea Analyzer** — submit an idea and target market, get a structured report on strengths, weaknesses, competition, and next steps.

Every session is saved to the user's dashboard along with 2-3 AI-generated action items.

## Tech stack

- **Frontend**: React (Vite) + Tailwind CSS — `/client`
- **Backend**: Node.js + Express — `/server`
- **Database / Auth**: Firebase Firestore + Firebase Auth
- **AI**: OpenAI API (GPT-4)
- **Hosting**: Vercel (frontend), Render (backend)

## Project structure

```
propelai/
├── client/   # React app
└── server/   # Express API
```

## Setup

### Prerequisites

- Node.js 20+
- A Firebase project (Auth + Firestore enabled)
- An OpenAI API key

### 1. Clone and install

```bash
git clone https://github.com/jacobcoleman09/propelai.git
cd propelai

cd client && npm install
cd ../server && npm install
```

### 2. Environment variables

Copy the example env files and fill in real values.

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

**`client/.env`** — Firebase web app config (from Firebase console → Project Settings → Your apps):

| Variable | Description |
| --- | --- |
| `VITE_FIREBASE_API_KEY` | Firebase web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | `<project-id>.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | `<project-id>.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_API_URL` | Backend API URL (`http://localhost:5001/api` locally) |

**`server/.env`**:

| Variable | Description |
| --- | --- |
| `PORT` | Port the API listens on (default `5001`) |
| `OPENAI_API_KEY` | OpenAI secret key |
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account client email |
| `FIREBASE_PRIVATE_KEY` | Firebase service account private key |

### 3. Run locally

```bash
# terminal 1
cd server && npm run dev

# terminal 2
cd client && npm run dev
```

Client runs at `http://localhost:5173`, server at `http://localhost:5001`.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for branching strategy and collaborator setup.
