import { Router } from 'express'
import openai from '../config/openai.js'

const router = Router()

router.post('/analyze', async (req, res) => {
  const { ideaName, description, targetMarket } = req.body

  if (!ideaName || !description || !targetMarket) {
    return res.status(400).json({ error: 'ideaName, description, and targetMarket are required' })
  }

  const prompt = `Business idea: "${ideaName}"
Description: ${description}
Target market: ${targetMarket}

Analyze this business idea and respond with JSON in exactly this shape:
{
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "competitiveRisks": ["risk 1", "risk 2"],
  "nextSteps": ["step 1", "step 2", "step 3"]
}

Each bullet should be specific to this idea and market, not generic startup advice.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are a sharp startup advisor and market analyst who gives specific, grounded feedback on business ideas. You always respond with valid JSON matching the requested shape, no markdown fences.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(completion.choices[0].message.content)
    res.json(result)
  } catch (err) {
    console.error('Business idea analysis failed:', err)
    res.status(500).json({ error: 'Failed to analyze business idea' })
  }
})

export default router
