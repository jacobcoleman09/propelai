import { useState } from 'react'
import { Link } from 'react-router-dom'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase.js'
import { useAuth } from '../../context/AuthContext.jsx'
import api from '../../lib/api.js'
import ActionItems from '../../components/ActionItems.jsx'

function ResumeBuilder() {
  const { currentUser } = useAuth()
  const [experience, setExperience] = useState('')
  const [targetJobTitle, setTargetJobTitle] = useState('')
  const [targetCompany, setTargetCompany] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)
    setSubmitting(true)

    try {
      const { data } = await api.post('/resume/generate', {
        experience,
        targetJobTitle,
        targetCompany,
      })
      setResult(data)

      await addDoc(collection(db, 'users', currentUser.uid, 'sessions'), {
        type: 'resume',
        targetJobTitle,
        targetCompany,
        experience,
        resume: data.resume,
        coverLetter: data.coverLetter,
        improvementNotes: data.improvementNotes,
        actionItems: data.actionItems,
        createdAt: serverTimestamp(),
      })
    } catch (err) {
      setError('Something went wrong generating your resume. Please try again.')
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
        <h1 className="text-2xl font-semibold text-gray-900">Resume and Cover Letter Builder</h1>
        <p className="mt-2 text-gray-600">
          Describe your experience and the job you're targeting to get an ATS-optimized resume and
          matching cover letter.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 max-w-2xl">
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
              Your experience
            </label>
            <textarea
              id="experience"
              required
              rows={8}
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Roles, responsibilities, achievements, skills, education..."
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="targetJobTitle" className="block text-sm font-medium text-gray-700">
              Target job title
            </label>
            <input
              id="targetJobTitle"
              type="text"
              required
              value={targetJobTitle}
              onChange={(e) => setTargetJobTitle(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="targetCompany" className="block text-sm font-medium text-gray-700">
              Target company <span className="text-gray-400">(optional)</span>
            </label>
            <input
              id="targetCompany"
              type="text"
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitting ? 'Generating...' : 'Generate resume and cover letter'}
          </button>
        </form>

        {result && (
          <div className="mt-10 space-y-8 max-w-3xl">
            <section>
              <h2 className="text-lg font-medium text-gray-900">Resume</h2>
              <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-800 font-sans">
                {result.resume}
              </pre>
            </section>

            <section>
              <h2 className="text-lg font-medium text-gray-900">Cover letter</h2>
              <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-800 font-sans">
                {result.coverLetter}
              </pre>
            </section>

            <section>
              <h2 className="text-lg font-medium text-gray-900">Improvement notes</h2>
              <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-gray-800">
                {result.improvementNotes?.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </section>

            <ActionItems items={result.actionItems} />
          </div>
        )}
      </main>
    </div>
  )
}

export default ResumeBuilder
