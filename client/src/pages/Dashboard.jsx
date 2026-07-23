import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../lib/firebase.js'
import { useAuth } from '../context/AuthContext.jsx'

const tools = [
  {
    title: 'Resume and Cover Letter Builder',
    description: 'Turn your experience into an ATS-optimized resume and matching cover letter.',
    to: '/tools/resume',
  },
  {
    title: 'Mock Interview Simulator',
    description: 'Practice tailored interview questions and get scored on clarity, depth, and quality.',
    to: '/tools/interview',
  },
  {
    title: 'Business Idea Analyzer',
    description: 'Get a structured breakdown of your idea: strengths, weaknesses, competition, next steps.',
    to: '/tools/business-idea',
  },
]

const SESSION_META = {
  resume: { label: 'Resume & Cover Letter', to: '/tools/resume' },
  interview: { label: 'Mock Interview', to: '/tools/interview' },
  'business-idea': { label: 'Business Idea Analysis', to: '/tools/business-idea' },
}

function sessionTitle(session) {
  if (session.type === 'resume') {
    return session.targetCompany
      ? `${session.targetJobTitle} at ${session.targetCompany}`
      : session.targetJobTitle
  }
  if (session.type === 'interview') {
    return `${session.jobRole} — ${session.overallScore}/10`
  }
  if (session.type === 'business-idea') {
    return session.ideaName
  }
  return 'Session'
}

function Dashboard() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])
  const [loadingSessions, setLoadingSessions] = useState(true)

  useEffect(() => {
    if (!currentUser) return

    const loadSessions = async () => {
      try {
        const q = query(
          collection(db, 'users', currentUser.uid, 'sessions'),
          orderBy('createdAt', 'desc'),
        )
        const snapshot = await getDocs(q)
        setSessions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      } catch (err) {
        console.error('Failed to load sessions:', err)
      } finally {
        setLoadingSessions(false)
      }
    }

    loadSessions()
  }, [currentUser])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">PropelAI</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {currentUser?.displayName || currentUser?.email}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold text-gray-900">
          Welcome{currentUser?.displayName ? `, ${currentUser.displayName}` : ''}
        </h2>
        <p className="mt-1 text-gray-600">Pick a tool to get started.</p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="block bg-white rounded-lg border border-gray-200 p-6 hover:border-indigo-400 hover:shadow transition"
            >
              <h3 className="font-medium text-gray-900">{tool.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{tool.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-medium text-gray-900">Your sessions</h3>

          {!loadingSessions && sessions.length === 0 && (
            <div className="mt-3 rounded-lg border border-dashed border-gray-300 p-8 text-center">
              <p className="text-gray-600">You haven't created any sessions yet.</p>
              <p className="mt-1 text-sm text-gray-500">
                Pick a tool above to run your first one.
              </p>
            </div>
          )}

          {sessions.length > 0 && (
            <div className="mt-3 space-y-3">
              {sessions.map((session) => {
                const meta = SESSION_META[session.type] || { label: 'Session', to: '/' }
                const date = session.createdAt?.toDate
                  ? session.createdAt.toDate().toLocaleDateString()
                  : ''
                return (
                  <Link
                    key={session.id}
                    to={meta.to}
                    className="block bg-white rounded-lg border border-gray-200 p-4 hover:border-indigo-400 hover:shadow transition"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{sessionTitle(session)}</p>
                      <span className="text-xs text-gray-500">{date}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{meta.label}</p>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
