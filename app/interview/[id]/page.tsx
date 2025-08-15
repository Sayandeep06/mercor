"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { vapi } from "@/lib/vapi";
import { useSession } from "next-auth/react";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";

interface TranscriptMessage {
  role: string;
  content: string;
}

const interviewer: CreateAssistantDTO = {
  name: "Interviewer",
  firstMessage:
    "Hello {{username}}! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience.",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  voice: {
    provider: "11labs",
    voiceId: "sarah",
    stability: 0.4,
    similarityBoost: 0.8,
    speed: 0.9,
    style: 0.5,
    useSpeakerBoost: true,
  },
  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a professional job interviewer conducting a real-time voice interview with a candidate. Your goal is to assess their qualifications, motivation, and fit for the role.

Interview Guidelines:
{{questions}}

Engage naturally & react appropriately:
Listen actively to responses and acknowledge them before moving forward.
Ask brief follow-up questions if a response is vague or requires more detail.
Don't say you are right or you are wrong and don't proceed to answer the questions either even if it's right or wrong.
Keep the conversation flowing smoothly while maintaining control.
Be professional, yet warm and welcoming:

Use official yet friendly language.
Keep responses concise and to the point (like in a real voice interview).
Avoid robotic phrasing—sound natural and conversational.
Answer the candidate's questions professionally:

If asked about the role, company, or expectations, provide a clear and relevant answer.
If unsure, redirect the candidate to HR for more details.

Conclude the interview properly:
Thank the candidate for their time.
Inform them that the company will reach out soon with feedback and the user will be redirected to the feedback page a few secs after the interview ends.
After delivering your closing remarks, send the message "INTERVIEW_COMPLETE" to signal the end of the interview.
End the conversation on a polite and positive note.

IMPORTANT: When you have finished the entire interview and delivered your closing remarks, you MUST send the message "INTERVIEW_COMPLETE" as your final response. This will signal that the interview session should end.

- Be sure to be professional and polite.
- Keep all your responses short and simple. Use official language, but be kind and welcoming.
- This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.`
      },
    ],
  },
};

const InterviewPage = () => {
  const params = useParams();
  const interviewId = params.id as string;
  const session = useSession();
  const user = session.data?.user;
  const username = user?.name;
  const firstLetter = user && username ? username.trim().charAt(0).toUpperCase() : (user ? 'C' : 'G');
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [displayMessages, setDisplayMessages] = useState<TranscriptMessage[]>([]);
  const transcriptRef = useRef<TranscriptMessage[]>([]);

  const [callEnded, setCallEnded] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndInterview = async () => {
      try {
        const userRes = await axios.get("/api/user/");
        if (userRes.data && userRes.data.userId) {
          setUserId(userRes.data.userId);
          console.log("User ID fetched:", userRes.data.userId);
        } else {
          console.error("User ID not found in API response:", userRes.data);
          setUserId(null);
        }

        const interviewRes = await axios.get(`/api/interview/${interviewId}`);
        setQuestions(interviewRes.data.interview.questions || []);
        console.log("Interview questions fetched for ID:", interviewId);
      } catch (error) {
        console.error("Error fetching user or interview data:", error);
      }
    };

    if (interviewId) {
      fetchUserAndInterview();
    }
  }, [interviewId]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [displayMessages]);

  useEffect(() => {
    const originalError = console.error;
    console.error = function (msg, ...args) {
      if (
        typeof msg === 'string' &&
        (msg.includes("Meeting has ended") ||
          (args[0] && typeof args[0].toString === 'function' && args[0].toString().includes("Meeting has ended")))
      ) {
        return;
      }
      return originalError.call(console, msg, ...args);
    };
    return () => {
      console.error = originalError;
    };
  }, []);

  useEffect(() => {
    if (callEnded) {
      const delayAndSendTranscript = async () => {
        const finalTranscript = transcriptRef.current;

        console.log("Attempting to send transcript. Data:", {
          userId,
          interviewId,
          transcriptLength: finalTranscript.length,
          transcriptSample: finalTranscript.slice(0, 2)
        });

        if (!userId || !interviewId) {
            console.error("CRITICAL: userId or interviewId is missing before sending transcript! Transcript not sent.");
            return;
        }
        if (finalTranscript.length === 0) {
            console.warn("Transcript is empty from ref. Sending an empty transcript or skipping. Check message handling.");
        }

        try {
          await axios.post("/api/transcript", {
            userId,
            interviewId,
            transcript: finalTranscript,
          });
          console.log("Transcript sent successfully to /api/transcript");
        } catch (err) {
          console.error("Failed to send transcript to /api/transcript:", err);
        }
      };

      delayAndSendTranscript();

      const redirectTimer = setTimeout(() => {
        router.push("/feedback");
      }, 5000);

      return () => clearTimeout(redirectTimer);
    }
  }, [callEnded, router, userId, interviewId]);

  useEffect(() => {
    const handleCallStart = () => {
      console.log("VAPI Event: call-start");
      setConnecting(false);
      setCallActive(true);
      setCallEnded(false);
      setDisplayMessages([]);
      transcriptRef.current = [];
    };

    const handleCallEnd = () => {
      console.log("VAPI Event: call-end");
      setCallActive(false);
      setConnecting(false);
      setIsSpeaking(false);
      setCallEnded(true);
    };

    const handleSpeechStart = () => {
      setIsSpeaking(true);
    };
    const handleSpeechEnd = () => {
      setIsSpeaking(false);
    };


    const handleMessage = (message: any) => {
    
      if (!message || typeof message.type !== 'string') {
        console.warn("Received invalid message object from VAPI", message);
        return;
      }
    
      if (message.type === "transcript") {
        const { transcript, role, transcriptType } = message;
    
        if (typeof transcript !== 'string' || typeof role !== 'string' || typeof transcriptType !== 'string') {
          console.warn("Received invalid transcript message structure from VAPI", message);
          return;
        }
    
    
        if (transcriptType === "final") {
          const newMessage: TranscriptMessage = {
            role: role,
            content: transcript
          };
    
    
          if (role === "assistant" && transcript.includes("INTERVIEW_COMPLETE")) {
            console.log("INTERVIEW_COMPLETE detected in assistant message. Ending call immediately.");
            
            const cleanedTranscript = transcript.replace("INTERVIEW_COMPLETE", "").trim();
            if (cleanedTranscript) {
              const cleanedMessage: TranscriptMessage = {
                role: role,
                content: cleanedTranscript
              };
              
              setDisplayMessages(prevMessages => [...prevMessages, cleanedMessage]);
              transcriptRef.current = [...transcriptRef.current, cleanedMessage];
            }
            
            if (callActive) {
              console.log("Stopping Vapi call initiated by INTERVIEW_COMPLETE signal.");
              vapi.stop();
            }
            
            return;
          }
    
          setDisplayMessages(prevMessages => [...prevMessages, newMessage]);
          transcriptRef.current = [...transcriptRef.current, newMessage];
    
        } else if (transcriptType === "partial") {
          console.log(` Received PARTIAL transcript: [${role}] ${transcript}`);
          
          if (role === "assistant" && transcript.includes("INTERVIEW_COMPLETE")) {
            console.log("INTERVIEW_COMPLETE detected in assistant partial message. Preparing to end call.");
          }
          
        } else {
          console.log(` Received UNKNOWN transcriptType: ${transcriptType}`, message);
        }
    
      } else {
        console.log(`Received non-transcript VAPI message type: ${message.type}`, message);
      }
    };


    const handleError = (error: any) => {
      console.error("VAPI Event: error", error);
      setConnecting(false);
      setCallActive(false);
      setIsSpeaking(false);
    };

    console.log("Setting up VAPI event listeners...");
    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("speech-start", handleSpeechStart);
    vapi.on("speech-end", handleSpeechEnd);
    vapi.on("message", handleMessage); 
    vapi.on("error", handleError);

    return () => {
      console.log("Cleaning up VAPI event listeners.");
      vapi.off("call-start", handleCallStart);
      vapi.off("call-end", handleCallEnd);
      vapi.off("speech-start", handleSpeechStart);
      vapi.off("speech-end", handleSpeechEnd);
      vapi.off("message", handleMessage);
      vapi.off("error", handleError);
      console.log("VAPI event listeners cleaned up.");
    };
  }, [callActive]);


  const toggleCall = async () => {
    if (callActive) {
      console.log("User initiated: Stop call");
      vapi.stop();
    } else {
      console.log("User initiated: Start call");
      try {
        setConnecting(true);
        setDisplayMessages([]);
        transcriptRef.current = [];
        setCallEnded(false);
  
        let formattedQuestions = "";
        if (questions && questions.length > 0) {
          formattedQuestions = questions
            .map((question, index) => `${index + 1}. ${question}`)
            .join("\n\n");
          console.log("Questions loaded for the interview:", formattedQuestions);
        } else {
          console.warn("No questions loaded for the interview. Proceeding without specific questions in prompt.");
        }
  
        const currentUsername = username || "Candidate";
        console.log("Starting Vapi call with username:", currentUsername);
  
        await vapi.start(interviewer, {
          variableValues: {
            username: currentUsername,
            questions: formattedQuestions,
          },
        });
  
      } catch (error) {
        console.error("Failed to start Vapi call:", error);
        setConnecting(false);
        setCallActive(false);
        setCallEnded(false);
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative container mx-auto px-6 py-12 max-w-5xl">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm font-medium text-primary mb-6">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            Live Interview Session
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI Interview
            </span>
            <br />
            <span className="text-foreground">Experience</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Engage in a natural conversation with our AI interviewer. 
            Speak clearly and confidently - this is your time to shine.
          </p>
        </div>

        {/* Interview Interface */}
        <div className="relative overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg rounded-xl">
          
          {/* Header Bar */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                  AI
                </div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">AI Interviewer</div>
                <div className={`text-sm flex items-center gap-2 transition-colors duration-300 ${
                  callActive ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    callActive 
                      ? (isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-blue-600') 
                      : 'bg-gray-400'
                  }`} />
                  {callActive 
                    ? (isSpeaking ? "Speaking..." : "Listening...") 
                    : callEnded 
                      ? "Interview Complete" 
                      : connecting 
                        ? "Connecting..." 
                        : "Ready to Start"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">{username || "You"}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {username ? "Candidate" : "Guest"}
                </div>
              </div>
              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                {firstLetter}
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div 
            ref={messageContainerRef} 
            className="h-[60vh] overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-800/50"
          >
            {/* Empty State */}
            {displayMessages.length === 0 && !callActive && !callEnded && !connecting && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
                  <div className="w-12 h-12 bg-blue-200 dark:bg-blue-800/40 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Ready to Begin</h3>
                <p className="text-gray-600 dark:text-gray-300">Click "Start Interview" to begin your AI-powered interview session</p>
              </div>
            )}

            {/* Connecting State */}
            {displayMessages.length === 0 && connecting && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <div className="w-12 h-12 bg-blue-200 dark:bg-blue-800/40 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-6 h-6 bg-blue-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Connecting...</h3>
                <p className="text-gray-600 dark:text-gray-300">Establishing connection with the AI interviewer</p>
              </div>
            )}

            {/* Messages */}
            {displayMessages.map((msg, index) => {
              const displayContent = typeof msg.content === 'string' ? msg.content.replace("INTERVIEW_COMPLETE", "").trim() : "";
              if (displayContent === "") return null;

              return (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-4 py-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : msg.role === 'assistant'
                        ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-bl-sm'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 italic text-center text-sm'
                  }`}>
                    {(msg.role === 'assistant' || msg.role === 'user') && (
                      <div className={`text-xs font-medium mb-2 ${
                        msg.role === 'user' 
                          ? 'text-blue-200' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {msg.role === 'assistant' ? 'AI Interviewer' : (username || 'You')}
                      </div>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{displayContent}</p>
                  </div>
                </div>
              );
            })}

            {/* Interview Complete State */}
            {callEnded && (
              <div className="flex flex-col items-center justify-center pt-8 text-center animate-scaleIn">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                  <div className="text-green-500 text-2xl">✓</div>
                </div>
                <h3 className="text-xl font-semibold text-green-600 mb-2">Interview Complete!</h3>
                <p className="text-muted-foreground">
                  Generating your personalized feedback. You'll be redirected shortly...
                </p>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="relative p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
            <button
              className={`w-full h-16 text-lg font-semibold rounded-lg transition-all duration-200 ${
                callActive
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : callEnded
                    ? 'bg-green-600 text-white cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={toggleCall}
              disabled={connecting || (callEnded && !callActive)}
            >
              {connecting && (
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-2xl"></div>
              )}
              <span className="relative z-10 flex items-center justify-center gap-3">
                {callActive ? (
                  <>
                    <div className="w-3 h-3 bg-current rounded-sm"></div>
                    End Interview
                  </>
                ) : connecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Connecting...
                  </>
                ) : callEnded ? (
                  <>
                    ✓ Interview Complete
                  </>
                ) : (
                  <>
                    <div className="w-0 h-0 border-l-[6px] border-l-current border-y-[4px] border-y-transparent"></div>
                    Start Interview
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InterviewPage;
