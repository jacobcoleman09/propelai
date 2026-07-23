import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import resumeRouter from './routes/resume.js'
import interviewRouter from './routes/interview.js'

const app = express()
const PORT = process.env.PORT || 5001

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/resume', resumeRouter)
app.use('/api/interview', interviewRouter)

app.listen(PORT, () => {
  console.log(`PropelAI server running on port ${PORT}`)
})
