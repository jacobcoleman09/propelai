import { Router } from 'express'
import openai from '../config/openai.js'

const router = Router()

router.post('/generate', async (req, res) => {
  const { experience, targetJobTitle, targetCompany } = req.body

  if (!experience || !targetJobTitle) {
    return res.status(400).json({ error: 'experience and targetJobTitle are required' })
  }

  const prompt = `Candidate experience:
${experience}

Target job title: ${targetJobTitle}
Target company: ${targetCompany || 'Not specified'}

Write an ATS-optimized resume and a matching cover letter for this candidate and target job.
Also give 3-5 specific, actionable notes on how the candidate could strengthen their materials
or experience for this role (things like missing keywords, weak bullet points, gaps to address).
Finally, give 2-3 concrete action items the candidate should do next (e.g. specific things to
add to their resume, people to reach out to, skills to pick up).

Respond with JSON in exactly this shape:
{
  "resume": "the full resume as plain text, with clear section headers",
  "coverLetter": "the full cover letter as plain text",
  "improvementNotes": ["note 1", "note 2", "note 3"],
  "actionItems": ["action item 1", "action item 2"]
}`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert resume writer and career coach. You write ATS-optimized resumes and compelling, specific cover letters. You always respond with valid JSON matching the requested shape, no markdown fences.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(completion.choices[0].message.content)
    res.json(result)
  } catch (err) {
    console.error('Resume generation failed:', err)
    res.status(500).json({ error: 'Failed to generate resume and cover letter' })
  }
})

export default router
