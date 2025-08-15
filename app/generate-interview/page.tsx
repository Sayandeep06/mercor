"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Bot, Briefcase, User, Target, Code, Sparkles, ArrowRight, Loader2, CheckCircle } from "lucide-react";

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
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative container mx-auto px-6 py-16 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm font-medium text-primary mb-6">
            <Bot size={16} />
            AI Interview Creator
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Create Your
            </span>
            <br />
            <span className="text-foreground">Perfect Interview</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Generate intelligent, role-specific interview questions with AI. 
            Just provide the job details and let our AI craft the perfect interview experience.
          </p>
        </div>

        {!created ? (
          <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-lg shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
            
            <div className="relative p-8 md:p-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Briefcase className="text-primary" size={24} />
                </div>
                <h2 className="text-2xl font-bold">Interview Configuration</h2>
              </div>

              <div className="grid gap-8">
                {/* Job Role */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <User size={16} className="text-primary" />
                    Job Role
                  </label>
                  <input
                    type="text"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    placeholder="e.g., Senior Software Engineer, Product Manager, Data Scientist"
                    className="w-full h-14 px-4 rounded-xl border border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 backdrop-blur-sm"
                    disabled={creating}
                  />
                </div>

                {/* Experience Level */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Target size={16} className="text-accent" />
                    Experience Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Junior', 'Mid-level', 'Senior'].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setLevel(lvl)}
                        disabled={creating}
                        className={`h-14 rounded-xl border-2 transition-all duration-300 font-medium ${
                          level === lvl
                            ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/20'
                            : 'border-border/50 bg-background/50 text-muted-foreground hover:border-primary/30 hover:bg-primary/5'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Code size={16} className="text-accent" />
                    Skills & Technologies
                  </label>
                  <textarea
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g., React, TypeScript, Node.js, PostgreSQL, AWS, Docker, Kubernetes"
                    className="w-full h-24 px-4 py-3 rounded-xl border border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 backdrop-blur-sm resize-none"
                    disabled={creating}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple skills with commas for best results
                  </p>
                </div>

                {/* Create Button */}
                <div className="pt-4">
                  <Button
                    onClick={createInterview}
                    disabled={creating || !jobRole.trim() || !level || !skills.trim()}
                    size="lg"
                    className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 shadow-2xl hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creating ? (
                      <div className="flex items-center gap-3">
                        <Loader2 size={20} className="animate-spin" />
                        <span>Creating Your Interview...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Sparkles size={20} />
                        <span>Generate AI Interview</span>
                        <ArrowRight size={20} />
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="relative overflow-hidden border-green-500/50 bg-green-500/5 backdrop-blur-lg shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent"></div>
            
            <div className="relative p-12 text-center">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-green-500" size={40} />
              </div>
              
              <h2 className="text-3xl font-bold mb-4 text-green-600">
                Interview Created Successfully!
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Your AI-powered interview has been generated with personalized questions 
                tailored to the {jobRole} role at {level} level. You'll be redirected to 
                your interviews dashboard shortly.
              </p>

              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{jobRole}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target size={16} />
                  <span>{level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Code size={16} />
                  <span>{skills.split(',').length} skills</span>
                </div>
              </div>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
};

export default GenerateInterviewPage;