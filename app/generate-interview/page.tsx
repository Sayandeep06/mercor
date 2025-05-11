"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { vapi } from "@/lib/vapi";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const GenerateInterviewPage = () => {
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [userId, setUserId] = useState("")
  const [callEnded, setCallEnded] = useState(false);

  const { data: session } = useSession();
  const user = session?.user;
  const username = session?.user?.name || "Guest";
  const firstLetter = user && username ? username.trim().charAt(0).toUpperCase() : (user ? 'C' : 'G');
  const router = useRouter();

  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const getuser = async()=>{
      const res = await axios.get('/api/user');
      const userId = res.data.userId;
      setUserId(userId);
    }
    getuser();
  },[session])

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
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (callEnded) {
      const redirectTimer = setTimeout(() => {
        router.push("/profile");
      }, 1500);
      return () => clearTimeout(redirectTimer);
    }
  }, [callEnded, router]);

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
  }, []);

  const toggleCall = async () => {
    if (callActive) {
      vapi.stop();
    } else {
      try {
        setConnecting(true);
        setMessages([]);
        setCallEnded(false);


        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
            clientMessages: [],
            serverMessages: [],
            variableValues: {
              username: username,
              userId: userId
            }
        });
      } catch (error) {
        console.log("Failed to start call", error);
        setConnecting(false);
      }
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
            Get on a quick call and generate the right interview for you.
          </p>
        </div>

        <Card className="bg-card/80 backdrop-blur-md border border-border overflow-hidden h-[60vh] flex flex-col">

          <div className="flex justify-between items-center p-4 border-b border-border bg-card">
            <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center overflow-hidden">
                <span className="text-xl text-muted-foreground">AI</span>
            </div>
            <div>
                <div className="font-semibold text-sm text-foreground">Interviewer</div>
                <div className={`text-xs text-muted-foreground flex items-center gap-1 ${callActive ? 'text-primary' : ''}`}>
                <div className={`w-2 h-2 rounded-full ${callActive ? (isSpeaking ? 'bg-primary animate-pulse' : 'bg-green-500') : 'bg-gray-500'}`} />
                {callActive
                    ? (isSpeaking ? "AI Speaking..." : "Listening...")
                    : callEnded
                    ? "Interview Ended"
                    : (connecting ? "Connecting..." : "Ready")}
                </div>
            </div>
            </div>

            <div className="flex items-center gap-3">
               <div>
                  <div className="font-semibold text-sm text-foreground text-right">You</div>
                  <div className="text-xs text-muted-foreground text-right">
                    {user ? username.trim() || "Candidate" : "Guest"}
                  </div>
               </div>
               <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center overflow-hidden">
                     <span className="text-xl text-muted-foreground">
                        {firstLetter}
                     </span>
               </div>
            </div>
          </div>

          <div
            ref={messageContainerRef}
            className="flex-1 p-4 overflow-y-auto custom-scrollbar"
          >
            <div className="space-y-4">
              {messages.length === 0 && !callActive && !callEnded && (
                 <div className="text-center text-muted-foreground italic mt-10">
                    Click "Start Call" to begin.
                 </div>
              )}

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} message-item animate-fadeIn`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : msg.role === "assistant"
                          ? "bg-muted text-muted-foreground rounded-bl-none"
                          : "bg-gray-500/10 text-gray-400 italic text-center"
                    }`}
                  >
                     {msg.role !== 'system' && (
                       <div className="font-semibold text-xs mb-1">
                         {msg.role === "assistant" ? "Interviewer" : "You"}:
                       </div>
                     )}
                    <p className="text-sm break-words">{msg.content}</p>
                  </div>
                </div>
              ))}

              {callEnded && (
                <div className="text-center text-primary italic mt-4 animate-fadeIn">
                  Interview completed! Click below to see the summary/feedback.
                </div>
              )}
            </div>
          </div>
        </Card>

        <div className="w-full flex justify-center mt-8">
          <Button
            className={`w-48 py-3 text-lg rounded-full relative transition-colors ${
              callActive
                ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                : callEnded
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
            }`}
            onClick={toggleCall}
            disabled={connecting}
          >
            {connecting && (
              <span className="absolute inset-0 rounded-full animate-ping bg-primary/50 opacity-75"></span>
            )}
            <span className="relative z-10">
              {callActive
                ? "End Interview"
                : connecting
                  ? "Connecting..."
                  : callEnded
                    ? "See Summary"
                    : "Start Call"}
            </span>
          </Button>
        </div>

      </div>
    </div>
  );
};

export default GenerateInterviewPage;