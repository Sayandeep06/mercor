"use client"
import { useEffect, useState } from "react";
import axios from 'axios';
import { useRouter } from "next/navigation";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, Clock, Briefcase, Code, Play, Loader2, AlertCircle, FileX } from "lucide-react";

interface Interview {
  id: string;
  createdAt: string;
  experienceLevel: string;
  jobRole: string;
  questions: string[];
  skills: string[];
  userId: string;
}

const Interviews = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); 

  const getDetails = async () => {
    try {
      const details = await axios.get('/api/interview');

      if (details.data && Array.isArray(details.data.interview)) {
        setInterviews(details.data.interview);
      } else {
        setError("Unexpected data format received from API.");
        setInterviews([]);
      }
    } catch (err) {
      setError("Failed to fetch interview details. Please try again later.");
      console.log(err)
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getExperienceColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'junior': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'mid-level': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'senior': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  if (loading) {
    return (
      <Card className="w-full min-h-[300px] border-border/50 bg-card/50 backdrop-blur-sm flex flex-col items-center justify-center text-center p-12">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <h3 className="text-xl font-semibold mb-2">Loading Your Interviews</h3>
        <p className="text-muted-foreground">Fetching your interview data...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full min-h-[300px] border-destructive/50 bg-destructive/5 backdrop-blur-sm flex flex-col items-center justify-center text-center p-12">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h3 className="text-xl font-semibold mb-2 text-destructive">Error Loading Interviews</h3>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={getDetails} variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10">
          Try Again
        </Button>
      </Card>
    );
  }

  if (interviews.length === 0) {
    return (
      <Card className="w-full min-h-[300px] border-border/50 bg-card/50 backdrop-blur-sm flex flex-col items-center justify-center text-center p-12">
        <FileX className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Interviews Yet</h3>
        <p className="text-muted-foreground mb-6">Create your first AI-powered interview to get started</p>
        <Button onClick={() => router.push('/generate-interview')} className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
          <Play className="w-4 h-4 mr-2" />
          Create Interview
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {interviews.map((interview) => (
        <Card
          key={interview.id}
          className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:scale-[1.02]"
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative p-6 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground capitalize">
                    {interview.jobRole}
                  </h3>
                  <Badge className={`text-xs ${getExperienceColor(interview.experienceLevel)}`}>
                    {interview.experienceLevel}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-4">
              {/* Skills */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Code size={14} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Tech Stack</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {interview.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-accent/10 text-accent border-accent/20">
                      {skill}
                    </Badge>
                  ))}
                  {interview.skills.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">
                      +{interview.skills.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Questions count */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock size={14} />
                <span>{interview.questions.length} questions prepared</span>
              </div>

              {/* Created date */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar size={14} />
                <span>Created {formatDate(interview.createdAt)}</span>
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={() => router.push(`/interview/${interview.id}`)}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200"
            >
              <Play size={16} className="mr-2" />
              Start Interview
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Interviews;
