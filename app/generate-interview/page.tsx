"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Briefcase, User, Target, Code, Loader2, CheckCircle } from "lucide-react";

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
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
            Create Interview
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Generate intelligent, role-specific interview questions with AI. 
            Provide the job details and let our platform create the perfect interview.
          </p>
        </div>

        {!created ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Briefcase className="text-blue-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Interview Configuration</h2>
              </div>

              <div className="grid gap-8">
                {/* Job Role */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                    <User size={16} className="text-blue-600" />
                    Job Role
                  </label>
                  <input
                    type="text"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    placeholder="e.g., Senior Software Engineer, Product Manager, Data Scientist"
                    className="w-full h-14 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    disabled={creating}
                  />
                </div>

                {/* Experience Level */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                    <Target size={16} className="text-blue-600" />
                    Experience Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Junior', 'Mid-level', 'Senior'].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setLevel(lvl)}
                        disabled={creating}
                        className={`h-14 rounded-lg border-2 transition-all duration-200 font-medium ${
                          level === lvl
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                    <Code size={16} className="text-blue-600" />
                    Skills & Technologies
                  </label>
                  <textarea
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g., React, TypeScript, Node.js, PostgreSQL, AWS, Docker, Kubernetes"
                    className="w-full h-24 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
                    disabled={creating}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Separate multiple skills with commas for best results
                  </p>
                </div>

                {/* Create Button */}
                <div className="pt-4">
                  <Button
                    onClick={createInterview}
                    disabled={creating || !jobRole.trim() || !level || !skills.trim()}
                    size="lg"
                    className="w-full h-16 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creating ? (
                      <div className="flex items-center gap-3">
                        <Loader2 size={20} className="animate-spin" />
                        <span>Creating Your Interview...</span>
                      </div>
                    ) : (
                      <span>Generate Interview</span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 border border-green-200 dark:border-green-800 rounded-lg shadow-sm">
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-green-600" size={40} />
              </div>
              
              <h2 className="text-3xl font-bold mb-4 text-green-600">
                Interview Created Successfully!
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Your AI-powered interview has been generated with personalized questions 
                tailored to the {jobRole} role at {level} level. You'll be redirected to 
                your interviews dashboard shortly.
              </p>

              <div className="flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-300">
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
          </div>
        )}

      </div>
    </div>
  );
};

export default GenerateInterviewPage;