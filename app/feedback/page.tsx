'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  MessageSquare, 
  Target, 
  Award,
  Loader2,
  FileX,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Calendar,
  Star
} from 'lucide-react'

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

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50 border-green-200'
    if (score >= 6) return 'text-blue-600 bg-blue-50 border-blue-200'
    if (score >= 4) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 8) return <Award className="text-green-600" size={24} />
    if (score >= 6) return <CheckCircle className="text-blue-600" size={24} />
    if (score >= 4) return <AlertCircle className="text-yellow-600" size={24} />
    return <AlertCircle className="text-red-600" size={24} />
  }

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
        <div className="relative container mx-auto px-6 py-16 max-w-4xl">
          <Card className="w-full min-h-[400px] border-border/50 bg-card/50 backdrop-blur-sm flex flex-col items-center justify-center text-center p-12">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <h3 className="text-xl font-semibold mb-2">Loading Your Feedback</h3>
            <p className="text-muted-foreground">Analyzing your interview performance...</p>
          </Card>
        </div>
      </div>
    )
  }

  if (!selectedFeedback) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
        <div className="relative container mx-auto px-6 py-16 max-w-4xl">
          <Card className="w-full min-h-[400px] border-border/50 bg-card/50 backdrop-blur-sm flex flex-col items-center justify-center text-center p-12">
            <FileX className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Feedback Available</h3>
            <p className="text-muted-foreground mb-6">Complete an interview to receive detailed feedback and insights</p>
            <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
              Take an Interview
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative container mx-auto px-6 py-16 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm font-medium text-primary mb-6">
            <BarChart3 size={16} />
            Performance Analysis
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Interview
            </span>
            <br />
            <span className="text-foreground">Feedback</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Detailed analysis of your interview performance with actionable insights for improvement
          </p>
        </div>

        {/* Feedback Selection */}
        {feedbacks.length > 1 && (
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {feedbacks.map((_, idx) => (
              <Button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                variant={idx === selectedIndex ? "default" : "outline"}
                className={`transition-all duration-300 ${
                  idx === selectedIndex
                    ? 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg'
                    : 'border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50'
                }`}
              >
                <Calendar size={16} className="mr-2" />
                {idx === 0 ? 'Latest Feedback' : `Feedback ${idx + 1}`}
              </Button>
            ))}
          </div>
        )}

        {/* Main Feedback Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Score Card */}
          <div className="lg:col-span-1">
            <Card className={`relative overflow-hidden border-2 p-8 text-center transition-all duration-300 hover:shadow-2xl ${getScoreColor(selectedFeedback.score)}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative">
                <div className="flex justify-center mb-4">
                  {getScoreIcon(selectedFeedback.score)}
                </div>
                <h2 className="text-lg font-semibold mb-2">Overall Score</h2>
                <div className="text-6xl font-bold mb-2">{selectedFeedback.score}</div>
                <div className="text-lg opacity-80">out of 10</div>
                
                {/* Score bars */}
                <div className="mt-6 space-y-2">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Star size={12} className={i < selectedFeedback.score ? 'text-current' : 'text-current/20'} />
                      <div className={`h-1 flex-1 rounded-full ${i < selectedFeedback.score ? 'bg-current' : 'bg-current/20'}`}></div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Detailed Feedback */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Strengths */}
            <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
              <div className="relative p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-green-600" size={20} />
                  </div>
                  <h3 className="text-xl font-semibold">Strengths</h3>
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                    {selectedFeedback.strengths.length} highlights
                  </Badge>
                </div>
                <div className="grid gap-3">
                  {selectedFeedback.strengths.map((strength, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                      <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Areas for Improvement */}
            <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent"></div>
              <div className="relative p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                    <Target className="text-yellow-600" size={20} />
                  </div>
                  <h3 className="text-xl font-semibold">Areas to Improve</h3>
                  <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                    {selectedFeedback.areasToImprove.length} areas
                  </Badge>
                </div>
                <div className="grid gap-3">
                  {selectedFeedback.areasToImprove.map((area, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
                      <Target size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Weaknesses */}
            {selectedFeedback.weaknesses.length > 0 && (
              <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent"></div>
                <div className="relative p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                      <TrendingDown className="text-red-600" size={20} />
                    </div>
                    <h3 className="text-xl font-semibold">Areas of Concern</h3>
                    <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
                      {selectedFeedback.weaknesses.length} items
                    </Badge>
                  </div>
                  <div className="grid gap-3">
                    {selectedFeedback.weaknesses.map((weakness, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                        <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm leading-relaxed">{weakness}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Comments */}
            <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
              <div className="relative p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MessageSquare className="text-primary" size={20} />
                  </div>
                  <h3 className="text-xl font-semibold">Detailed Comments</h3>
                </div>
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="leading-relaxed text-foreground">{selectedFeedback.comments}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-16">
          <Button 
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg px-8 py-6 shadow-lg hover:shadow-primary/25"
            onClick={() => window.location.href = '/generate-interview'}
          >
            Take Another Interview
          </Button>
          <Button 
            variant="outline" 
            className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 text-lg px-8 py-6"
            onClick={() => window.location.href = '/#interviews'}
          >
            View All Interviews
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FeedbackPage