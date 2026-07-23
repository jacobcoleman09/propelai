# Contributing to PropelAI

Team: **Sara** (frontend), **Merve** (Firebase and testing), **Jacob** (backend and OpenAI integration).

## Getting set up

1. Clone the repo:

   ```bash
   git clone https://github.com/jacobcoleman09/propelai.git
   cd propelai
   ```

2. Install dependencies for both apps:

   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

3. Create your local env files from the examples:

   ```bash
   cp client/.env.example client/.env
   cp server/.env.example server/.env
   ```

4. Fill in the real values (get these from Jacob, not from git — `.env` files are never committed):
   - **`client/.env`** — Firebase web app config. Ask to be added to the `propelai` Firebase project (console.firebase.google.com) so you can copy it yourself from Project Settings → Your apps, or ask Jacob to send it directly.
   - **`server/.env`** — `OPENAI_API_KEY` and Firebase Admin service account values. Only needed if you're running the backend locally. Sara typically won't need a working `OPENAI_API_KEY` to build UI (AI calls will just fail gracefully in dev); Merve will need Firebase Admin credentials for Firestore rules testing.

5. Run locally (two terminals):

   ```bash
   # terminal 1
   cd server && npm run dev

   # terminal 2
   cd client && npm run dev
   ```

   Client: `http://localhost:5173` · Server: `http://localhost:5001`

## Branching strategy

`main` is always deployable — never commit directly to it. Every change goes through a feature branch and a pull request.

Branch names are prefixed by ownership area so it's obvious who's working on what:

| Prefix | Owner | Example |
| --- | --- | --- |
| `frontend/*` | Sara | `frontend/resume-form-ui` |
| `firebase/*` | Merve | `firebase/firestore-rules` |
| `backend/*` | Jacob | `backend/openai-resume-prompt` |

Workflow:

```bash
git checkout main
git pull origin main
git checkout -b frontend/short-description

# ...make changes, commit...

git push -u origin frontend/short-description
```

Then open a pull request into `main` on GitHub. Get at least one look from someone else on the team before merging if the change touches shared code (routes, Firestore schema, API contracts). Delete the branch after it's merged.

## Notes

- Never commit `.env` files or hardcode API keys — everything secret lives in `.env` only.
- If you're touching Firestore data structure or security rules, loop in Merve.
- If you're touching the `/api/*` contract the frontend depends on, loop in Sara.
