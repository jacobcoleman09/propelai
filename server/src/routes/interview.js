import { Router } from 'express'
import openai from '../config/openai.js'

const router = Router()

router.post('/questions', async (req, res) => {
  const { jobRole } = req.body

  if (!jobRole) {
    return res.status(400).json({ error: 'jobRole is required' })
  }

  const prompt = `Generate 5 interview questions for a candidate interviewing for the role of "${jobRole}".
Mix behavioral and role-specific technical/situational questions appropriate for that role.

Respond with JSON in exactly this shape:
{
  "questions": ["question 1", "question 2", "question 3", "question 4", "question 5"]
}`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are an experienced hiring manager who writes sharp, role-specific interview questions. You always respond with valid JSON matching the requested shape, no markdown fences.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(completion.choices[0].message.content)
    res.json(result)
  } catch (err) {
    console.error('Interview question generation failed:', err)
    res.status(500).json({ error: 'Failed to generate interview questions' })
  }
})

router.post('/score', async (req, res) => {
  const { jobRole, qa } = req.body

  if (!jobRole || !Array.isArray(qa) || qa.length === 0) {
    return res.status(400).json({ error: 'jobRole and qa (array of {question, answer}) are required' })
  }

  const transcript = qa
    .map((item, i) => `Q${i + 1}: ${item.question}\nA${i + 1}: ${item.answer}`)
    .join('\n\n')

  const prompt = `A candidate is interviewing for the role of "${jobRole}". Here is the interview transcript:

${transcript}

Score the candidate's overall performance from 1-10 based on clarity, depth, and quality of their answers.
Also give specific feedback for each individual answer, plus 2-3 concrete action items the candidate
should do before their next interview (e.g. specific things to practice, stories to prepare, gaps to fix).

Respond with JSON in exactly this shape:
{
  "overallScore": 7,
  "perAnswer": [
    { "question": "...", "answer": "...", "score": 7, "feedback": "specific feedback for this answer" }
  ],
  "actionItems": ["action item 1", "action item 2"]
}`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are an experienced interview coach who gives honest, specific, and constructive feedback. You always respond with valid JSON matching the requested shape, no markdown fences.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(completion.choices[0].message.content)
    res.json(result)
  } catch (err) {
    console.error('Interview scoring failed:', err)
    res.status(500).json({ error: 'Failed to score interview answers' })
  }
})

export default router
