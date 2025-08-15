"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const GenerateInterviewPage = () => {
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);
  const [jobRole, setJobRole] = useState("");
  const [level, setLevel] = useState("");
  const [skills, setSkills] = useState("");

  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (session === null) {
      router.push("/api/auth/signin");
    }
  }, [session, router]);

  useEffect(() => {
    if (created) {
      const redirectTimer = setTimeout(() => {
        router.push("/#interviews");
      }, 2000);
      return () => clearTimeout(redirectTimer);
    }
  }, [created, router]);

  if (status === "loading") {
    return null;
  }

  const createInterview = async () => {
    if (!jobRole.trim() || !level || !skills.trim()) {
      alert("Please fill in all interview details.");
      return;
    }

    try {
      setCreating(true);
      
      const response = await axios.post('/api/vapi/generate', {
        jobrole: jobRole,
        level: level,
        skills: skills
      });

      if (response.data.success) {
        console.log("Interview created:", response.data.interview);
        setCreated(true);
      } else {
        throw new Error("Failed to create interview");
      }
    } catch (error: any) {
      console.error("Failed to create interview:", error);
      alert("Failed to create interview. Please try again.");
      setCreating(false);
    }
  };

  return (
    <div className="mt-15 flex flex-col min-h-screen bg-background text-foreground overflow-hidden py-12">
      <div className="container mx-auto px-4 h-full max-w-4xl">

        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-400 tracking-tight">
            Interview<span className="text-white">AI</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Fill in your details to generate a custom interview.
          </p>
        </div>

        {!created && (
          <Card className="bg-card/80 backdrop-blur-md border border-border p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Interview Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Job Role</label>
                <input
                  type="text"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder="e.g., Software Engineer, Product Manager"
                  className="w-full p-2 rounded-md border border-border bg-background text-foreground"
                  disabled={creating}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Experience Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full p-2 rounded-md border border-border bg-background text-foreground"
                  disabled={creating}
                >
                  <option value="">Select level</option>
                  <option value="Junior">Junior</option>
                  <option value="Mid-level">Mid-level</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Skills/Technologies</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g., React, Node.js, Python, AWS"
                  className="w-full p-2 rounded-md border border-border bg-background text-foreground"
                  disabled={creating}
                />
              </div>
            </div>
          </Card>
        )}

        {created && (
          <Card className="bg-card/80 backdrop-blur-md border border-border p-6 mb-6">
            <div className="text-center">
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <h2 className="text-2xl font-semibold mb-2">Interview Created Successfully!</h2>
              <p className="text-muted-foreground">
                Your custom interview has been generated and saved. You'll be redirected to your interviews page shortly.
              </p>
            </div>
          </Card>
        )}

        <div className="w-full flex justify-center">
          <Button
            className={`w-48 py-3 text-lg rounded-full relative transition-colors ${
              created
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
            }`}
            onClick={createInterview}
            disabled={creating || created || (!jobRole.trim() || !level || !skills.trim())}
          >
            {creating && (
              <span className="absolute inset-0 rounded-full animate-ping bg-primary/50 opacity-75"></span>
            )}
            <span className="relative z-10">
              {creating
                ? "Creating Interview..."
                : created
                  ? "Interview Created!"
                  : "Create Interview"}
            </span>
          </Button>
        </div>

      </div>
    </div>
  );
};

export default GenerateInterviewPage;