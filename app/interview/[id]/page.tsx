"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { vapi } from "@/lib/vapi";
import { useSession } from "next-auth/react";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";


export const interviewer: CreateAssistantDTO = {
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
Follow the structured question flow:
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
  clientMessages: [],
  serverMessages: [],
};

const InterviewPage = ({ params }: { params: { id: string } }) => {
  const interviewId = params.id;
  const session = useSession();
  const user = session.data?.user;
  const username = user?.name;
  const firstLetter = user && username ? username.trim().charAt(0).toUpperCase() : (user ? 'C' : 'G');
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [callEnded, setCallEnded] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndInterview = async () => {
      try {
        const userRes = await axios.get("/api/user/");
        setUserId(userRes.data.userId);

        const interviewRes = await axios.get(`/api/interview/${interviewId}`);
        setQuestions(interviewRes.data.questions || []);
      } catch (error) {
        console.error("Error fetching user or interview data:", error);
      }
    };

    fetchUserAndInterview();
  }, [interviewId]);

  useEffect(() => {
    const originalError = console.error;
    console.error = function (msg, ...args) {
      if (
        msg &&
        (msg.includes("Meeting has ended") ||
          (args[0] && args[0].toString().includes("Meeting has ended")))
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
      const sendTranscript = async () => {
        try {
          await axios.post("/api/transcript", {
            userId,
            interviewId,
            transcript: messages,
          });
        } catch (err) {
          console.error("Failed to send transcript:", err);
        }
      };

      sendTranscript();

      const redirectTimer = setTimeout(() => {
        router.push("/feedback");
      }, 1500);
      return () => clearTimeout(redirectTimer);
    }
  }, [callEnded, messages, router, userId, interviewId]);

  useEffect(() => {
    const handleCallStart = () => {
      setConnecting(false);
      setCallActive(true);
      setCallEnded(false);
    };

    const handleCallEnd = () => {
      setCallActive(false);
      setConnecting(false);
      setIsSpeaking(false);
      setCallEnded(true);
    };

    const handleSpeechStart = () => setIsSpeaking(true);
    const handleSpeechEnd = () => setIsSpeaking(false);

    const handleMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { content: message.transcript, role: message.role };
        
        if (message.role === "assistant" && 
            message.transcript.includes("INTERVIEW_COMPLETE")) {

          setTimeout(() => {
            if (callActive) {
              vapi.stop();
            }
          }, 2000);
        }
        
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const handleError = (error: any) => {
      console.log("Vapi Error", error);
      setConnecting(false);
      setCallActive(false);
    };

    vapi
      .on("call-start", handleCallStart)
      .on("call-end", handleCallEnd)
      .on("speech-start", handleSpeechStart)
      .on("speech-end", handleSpeechEnd)
      .on("message", handleMessage)
      .on("error", handleError);

    return () => {
      vapi
        .off("call-start", handleCallStart)
        .off("call-end", handleCallEnd)
        .off("speech-start", handleSpeechStart)
        .off("speech-end", handleSpeechEnd)
        .off("message", handleMessage)
        .off("error", handleError);
    };
  }, [callActive]);

  const toggleCall = async () => {
    if (callActive) {
      vapi.stop();
    } else {
      try {
        setConnecting(true);
        setMessages([]);
        setCallEnded(false);

        let formattedQuestions = "";
        if (questions.length > 0) {
          formattedQuestions = questions.map((q) => `- ${q}`).join("\n");
        }

        await vapi.start(interviewer, {
          clientMessages: [],
          serverMessages: [],
          variableValues: {
            username:username,
            questions: formattedQuestions,
          },
        });
      } catch (error) {
        console.log("Failed to start call", error);
        setConnecting(false);
      }
    }
  };

  return (
    <div className="mt-10 min-h-screen flex flex-col py-16 font-sans antialiased">
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
                <div className={`text-xs ${callActive ? 'text-green-500' : 'text-gray-400'} flex items-center gap-2`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${callActive ? (isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-green-500') : 'bg-gray-500'}`} />
                  {callActive ? (isSpeaking ? "Speaking..." : "Listening...") : callEnded ? "Interview Ended" : connecting ? "Connecting..." : "Idle"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-md font-semibold text-gray-200">You</div>
                <div className="text-xs text-gray-400">{ username?.trim()? "Candidate" : "Guest"}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {firstLetter}
              </div>
            </div>
          </div>

          <div ref={messageContainerRef} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar bg-gray-850">
            {messages.length === 0 && !callActive && !callEnded && (
              <p className="text-gray-400 text-center italic mt-10 text-lg">
                Ready to start? Click "Start Interview" below.
              </p>
            )}

            {messages.map((msg, index) => {
              const displayContent = msg.content.replace("INTERVIEW_COMPLETE", "");
              
              return (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideInFromBottom`}>
                  <div className={`max-w-[80%] px-5 py-3 rounded-2xl shadow-md ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : msg.role === 'assistant'
                        ? 'bg-gray-700 text-gray-200 rounded-bl-sm'
                        : 'bg-gray-600 text-gray-300 italic text-center text-sm'
                  }`}>
                    {msg.role !== 'system' && (
                      <div className="text-xs font-semibold mb-1 opacity-80">
                        {msg.role === 'assistant' ? 'AI' : 'You'}
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap break-words">{displayContent}</p>
                  </div>
                </div>
              );
            })}

            {callEnded && (
              <div className="text-center text-green-500 italic mt-6 text-lg animate-fadeIn">
                Interview complete. View feedback or transcript below.
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
                  ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-600/40'
                  : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-600/40'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={toggleCall}
            disabled={connecting}
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
                    ? 'View Summary'
                    : 'Start Interview'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default InterviewPage;