import { Link } from 'react-router-dom'

function BusinessIdeaAnalyzer() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link to="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            &larr; Back to dashboard
          </Link>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-gray-900">Business Idea Analyzer</h1>
        <p className="mt-2 text-gray-600">Coming soon.</p>
      </main>
    </div>
  )
}

export default BusinessIdeaAnalyzer
