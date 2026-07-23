import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Dashboard() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

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
        <p className="text-gray-600">Dashboard coming next.</p>
      </main>
    </div>
  )
}

export default Dashboard
