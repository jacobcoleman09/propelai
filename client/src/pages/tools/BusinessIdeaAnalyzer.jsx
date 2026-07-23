import { useState } from 'react'
import { Link } from 'react-router-dom'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase.js'
import { useAuth } from '../../context/AuthContext.jsx'
import api from '../../lib/api.js'
import ActionItems from '../../components/ActionItems.jsx'

function ResultList({ title, items }) {
  return (
    <section>
      <h2 className="text-lg font-medium text-gray-900">{title}</h2>
      <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-gray-800">
        {items?.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

function BusinessIdeaAnalyzer() {
  const { currentUser } = useAuth()
  const [ideaName, setIdeaName] = useState('')
  const [description, setDescription] = useState('')
  const [targetMarket, setTargetMarket] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)
    setSubmitting(true)

    try {
      const { data } = await api.post('/business-idea/analyze', {
        ideaName,
        description,
        targetMarket,
      })
      setResult(data)

      await addDoc(collection(db, 'users', currentUser.uid, 'sessions'), {
        type: 'business-idea',
        ideaName,
        description,
        targetMarket,
        strengths: data.strengths,
        weaknesses: data.weaknesses,
        competitiveRisks: data.competitiveRisks,
        nextSteps: data.nextSteps,
        actionItems: data.actionItems,
        createdAt: serverTimestamp(),
      })
    } catch (err) {
      setError('Something went wrong analyzing your idea. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

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
        <p className="mt-2 text-gray-600">
          Describe your idea and target market to get a structured breakdown.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 max-w-2xl">
          <div>
            <label htmlFor="ideaName" className="block text-sm font-medium text-gray-700">
              Idea name
            </label>
            <input
              id="ideaName"
              type="text"
              required
              value={ideaName}
              onChange={(e) => setIdeaName(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              required
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does it do, how does it make money, what problem does it solve..."
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="targetMarket" className="block text-sm font-medium text-gray-700">
              Target market
            </label>
            <input
              id="targetMarket"
              type="text"
              required
              value={targetMarket}
              onChange={(e) => setTargetMarket(e.target.value)}
              placeholder="e.g. college students, small restaurant owners"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitting ? 'Analyzing...' : 'Analyze idea'}
          </button>
        </form>

        {result && (
          <div className="mt-10 space-y-8 max-w-2xl">
            <ResultList title="Strengths" items={result.strengths} />
            <ResultList title="Weaknesses" items={result.weaknesses} />
            <ResultList title="Competitive risks" items={result.competitiveRisks} />
            <ResultList title="Next steps" items={result.nextSteps} />
            <ActionItems items={result.actionItems} />
          </div>
        )}
      </main>
    </div>
  )
}

export default BusinessIdeaAnalyzer
