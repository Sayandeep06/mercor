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
- This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.`,
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
        setQuestions(interviewRes.data.questions || []);
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
        await new Promise((resolve) => setTimeout(resolve, 1000));

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
      }, 3000);

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
      console.log("Received VAPI message:", message);

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

          console.log(`VAPI Transcript - Type: ${transcriptType}, Role: ${role}, Content: "${transcript}"`);


          if (transcriptType === "final") {
              // This is a final transcript message - add it to display and transcript ref
              const newMessage: TranscriptMessage = {
                  role: role,
                  content: transcript
              };

              console.log(`---> Processing FINAL transcript for display and storage: [${role}] ${transcript}`);

              setDisplayMessages(prevMessages => [...prevMessages, newMessage]);


              transcriptRef.current = [...transcriptRef.current, newMessage];

              if (role === "assistant" && transcript.includes("INTERVIEW_COMPLETE")) {
                  console.log("INTERVIEW_COMPLETE detected in assistant message. Scheduling call stop in 2s.");
                  setTimeout(() => {
                      if (callActive) {
                          console.log("Stopping Vapi call initiated by INTERVIEW_COMPLETE signal.");
                          vapi.stop();
                      } else {
                           console.log("Vapi call stop skipped (already inactive).");
                      }
                  }, 2000); 
              }

          } else if (transcriptType === "partial") {
              console.log(`---> Received PARTIAL transcript: [${role}] ${transcript}`);
          } else {
               console.log(`---> Received UNKNOWN transcriptType: ${transcriptType}`, message);
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
          formattedQuestions = questions.map((q) => `- ${q}`).join("\n");
          console.log("Questions loaded for the interview:", questions.length);
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
    <div className="mt-10 min-h-screen flex flex-col py-16 font-sans antialiased bg-gray-900 text-white">
      <div className="mx-auto w-full max-w-3xl px-4">

        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-400 tracking-tight">
            Interview<span className="text-white">AI</span>
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
            Step into a real-time AI-powered voice interview experience designed for seamless communication.
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden h-[70vh] flex flex-col">

          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700 bg-gray-800 sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                AI
              </div>
              <div>
                <div className="text-md font-semibold text-gray-200">AI Interviewer</div>
                <div className={`text-xs ${callActive ? 'text-green-400' : 'text-gray-400'} flex items-center gap-2`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${callActive ? (isSpeaking ? 'bg-green-400 animate-pulse' : 'bg-green-400') : 'bg-gray-500'}`} />
                  {callActive ? (isSpeaking ? "Speaking..." : "Listening...") : callEnded ? "Interview Ended" : connecting ? "Connecting..." : "Idle"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-md font-semibold text-gray-200">{username || "You"}</div>
                <div className="text-xs text-gray-400">{ username ? "Candidate" : "Guest"}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {firstLetter}
              </div>
            </div>
          </div>

          <div ref={messageContainerRef} className="flex-1 overflow-y-auto p-6 space-y-5 bg-gray-850 custom-scrollbar">
            {displayMessages.length === 0 && !callActive && !callEnded && !connecting && (
              <div className="text-gray-400 text-center italic mt-10 text-lg flex flex-col items-center justify-center h-full">
                <p>Ready to start?</p>
                <p>Click "Start Interview" below.</p>
              </div>
            )}
             {displayMessages.length === 0 && connecting && (
              <div className="text-gray-400 text-center italic mt-10 text-lg flex flex-col items-center justify-center h-full">
                <p>Connecting to the AI Interviewer...</p>
              </div>
            )}

            {displayMessages.map((msg, index) => {
              const displayContent = typeof msg.content === 'string' ? msg.content.replace("INTERVIEW_COMPLETE", "").trim() : "";
              if (displayContent === "") return null;


              return (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideInFromBottom`}>
                  <div className={`max-w-[80%] px-5 py-3 rounded-2xl shadow-md ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : msg.role === 'assistant'
                        ? 'bg-gray-700 text-gray-200 rounded-bl-sm'
                        : 'bg-gray-600 text-gray-300 italic text-center text-sm'
                  }`}>
                    {(msg.role === 'assistant' || msg.role === 'user') && (
                      <div className="text-xs font-semibold mb-1 opacity-80">
                        {msg.role === 'assistant' ? 'AI Interviewer' : (username || 'You')}
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap break-words">{displayContent}</p>
                  </div>
                </div>
              );
            })}

            {callEnded && (
              <div className="text-center text-green-400 italic mt-6 text-lg animate-fadeIn">
                Interview complete. Redirecting to feedback page shortly...
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <button
            className={`w-60 py-4 text-lg font-bold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 relative overflow-hidden ${
              callActive
                ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/40'
                : callEnded
                  ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-600/40 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:-green-700 shadow-lg shadow-green-600/40'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={toggleCall}
            disabled={connecting || (callEnded && !callActive)}
          >
            {connecting && (
              <span className="absolute inset-0 bg-white opacity-20 animate-pulse rounded-full"></span>
            )}
            <span className="relative z-10">
              {callActive
                ? 'End Interview'
                : connecting
                  ? 'Connecting...'
                  : callEnded
                    ? 'Interview Ended'
                    : 'Start Interview'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
