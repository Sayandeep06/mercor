'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

interface Feedback {
  id: string
  score: number
  strengths: string[]
  weaknesses: string[]
  comments: string
  areasToImprove: string[]
  interviewId: string
  userId: string
}

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await axios.get('/api/transcript')
        const latestThree = res.data.data.slice(0, 3)
        setFeedbacks(latestThree)
      } catch (error) {
        console.error("Failed to fetch feedback", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeedback()
  }, [])

  const selectedFeedback = feedbacks[selectedIndex]

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Loading feedback...
      </div>
    )
  }

  if (!selectedFeedback) {
    return (
      <div className="text-center mt-10 text-gray-500">
        No feedback available.
      </div>
    )
  }

  return (
    <div className="max-w-4xl mt-18 mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Interview Feedback</h1>

      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {feedbacks.map((_, idx) => (
          <Button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
              idx === selectedIndex
                ? 'bg-primary text-black border-primary'
                : 'bg-white text-black border-primary hover:bg-primary'
            }`}
          >
            {idx === 0 ? 'Latest Feedback' : `Previous Feedback ${idx}`}
          </Button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 space-y-4 border">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Score</h2>
          <p className="text-blue-600 text-lg font-bold">{selectedFeedback.score}/10</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">Strengths</h2>
          <ul className="list-disc ml-6 text-gray-700">
            {selectedFeedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">Weaknesses</h2>
          <ul className="list-disc ml-6 text-gray-700">
            {selectedFeedback.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">Comments</h2>
          <p className="text-gray-700">{selectedFeedback.comments}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">Areas to Improve</h2>
          <ul className="list-disc ml-6 text-gray-700">
            {selectedFeedback.areasToImprove.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default FeedbackPage