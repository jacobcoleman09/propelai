import { useState } from 'react'
import { Link } from 'react-router-dom'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase.js'
import { useAuth } from '../../context/AuthContext.jsx'
import api from '../../lib/api.js'
import ActionItems from '../../components/ActionItems.jsx'

function MockInterview() {
  const { currentUser } = useAuth()
  const [jobRole, setJobRole] = useState('')
  const [questions, setQuestions] = useState(null)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [generating, setGenerating] = useState(false)
  const [scoring, setScoring] = useState(false)

  const handleGenerate = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)
    setQuestions(null)
    setGenerating(true)

    try {
      const { data } = await api.post('/interview/questions', { jobRole })
      setQuestions(data.questions)
      setAnswers({})
    } catch (err) {
      setError('Could not generate questions. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const handleScore = async (e) => {
    e.preventDefault()
    setError('')
    setScoring(true)

    const qa = questions.map((question, i) => ({
      question,
      answer: answers[i] || '',
    }))

    try {
      const { data } = await api.post('/interview/score', { jobRole, qa })
      setResult(data)

      await addDoc(collection(db, 'users', currentUser.uid, 'sessions'), {
        type: 'interview',
        jobRole,
        overallScore: data.overallScore,
        perAnswer: data.perAnswer,
        actionItems: data.actionItems,
        createdAt: serverTimestamp(),
      })
    } catch (err) {
      setError('Could not score your answers. Please try again.')
    } finally {
      setScoring(false)
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
        <h1 className="text-2xl font-semibold text-gray-900">Mock Interview Simulator</h1>
        <p className="mt-2 text-gray-600">
          Pick a job role to get 5 tailored interview questions, answer them, and get scored.
        </p>

        <form onSubmit={handleGenerate} className="mt-6 flex gap-3 max-w-xl">
          <input
            type="text"
            required
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            placeholder="e.g. Product Manager"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={generating}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 whitespace-nowrap"
          >
            {generating ? 'Generating...' : 'Generate questions'}
          </button>
        </form>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        {questions && !result && (
          <form onSubmit={handleScore} className="mt-8 space-y-6 max-w-2xl">
            {questions.map((question, i) => (
              <div key={i}>
                <label htmlFor={`answer-${i}`} className="block text-sm font-medium text-gray-900">
                  {i + 1}. {question}
                </label>
                <textarea
                  id={`answer-${i}`}
                  required
                  rows={3}
                  value={answers[i] || ''}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [i]: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={scoring}
              className="rounded-md bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {scoring ? 'Scoring...' : 'Submit for scoring'}
            </button>
          </form>
        )}

        {result && (
          <div className="mt-8 max-w-2xl space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-600">Overall score</p>
              <p className="text-3xl font-semibold text-gray-900">{result.overallScore} / 10</p>
            </div>

            {result.perAnswer?.map((item, i) => (
              <div key={i} className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="font-medium text-gray-900">
                  {i + 1}. {item.question}
                </p>
                <p className="mt-2 text-sm text-gray-700 italic">"{item.answer}"</p>
                <p className="mt-2 text-sm font-medium text-indigo-600">Score: {item.score} / 10</p>
                <p className="mt-1 text-sm text-gray-800">{item.feedback}</p>
              </div>
            ))}

            <ActionItems items={result.actionItems} />
          </div>
        )}
      </main>
    </div>
  )
}

export default MockInterview
