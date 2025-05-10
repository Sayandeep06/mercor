"use client"
import { useEffect, useState } from "react";
import axios from 'axios';
import { useRouter } from "next/navigation";

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
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-[200px] border-2 border-dashed border-border rounded-xl p-8 flex items-center justify-center text-muted-foreground text-center">
        Loading interview details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[200px] border-2 border-dashed border-red-500 rounded-xl p-8 flex items-center justify-center text-red-500 text-center">
        Error: {error}
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <div className="w-full min-h-[200px] border-2 border-dashed border-border rounded-xl p-8 flex items-center justify-center text-muted-foreground text-center">
        No interviews found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {interviews.map((interview) => (
        <div
          key={interview.id}
          className="border border-border rounded-xl p-6 shadow-lg flex flex-col justify-between"
        >
          <div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">
              {interview.jobRole.toUpperCase()}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Tech Stack: {interview.skills.join(', ')}
            </p>
          </div>
          <button
            onClick={() => {
              router.push(`/interview/${interview.id}`)
            }}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Start Interview
          </button>
        </div>
      ))}
    </div>
  );
};

export default Interviews;
