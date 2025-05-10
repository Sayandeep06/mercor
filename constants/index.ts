// --- Start of Code Context: Type Definitions (Assuming TypeScript) ---

// These types define the structure of the configuration object.
// If you are using an SDK or library, these types might be provided.
// Otherwise, you'll need to define them like this.

export interface TranscriberConfig {
    provider: "deepgram" | string; // Use string for flexibility if other providers exist
    model: string;
    language: string;
  }
  
  export interface VoiceConfig {
    provider: "11labs" | string; // Use string for flexibility
    voiceId: string;
    stability?: number; // Optional parameters
    similarityBoost?: number;
    speed?: number;
    style?: number;
    useSpeakerBoost?: boolean;
  }
  
  export interface Message {
    role: "system" | "user" | "assistant";
    content: string;
  }
  
  export interface ModelConfig {
    provider: "openai" | string; // Use string for flexibility
    model: string; // e.g., "gpt-4", "gpt-4o", "claude-3-sonnet", etc.
    messages: Message[];
    // Add other potential model parameters like temperature, top_p, etc., if needed
    temperature?: number;
    top_p?: number;
  }
  
  export interface CreateAssistantDTO {
    name: string;
    firstMessage: string;
    transcriber: TranscriberConfig;
    voice: VoiceConfig;
    model: ModelConfig;
    // Add other potential assistant parameters like endCallMessage, hook, etc.
    endCallMessage?: string;
    // Add placeholders object if the platform supports replacing dynamic variables
    // For {{questions}}, this would typically be handled when starting a specific call,
    // by injecting the questions into the 'content' of the system message itself.
    // placeholders?: { [key: string]: string }; // Example if your platform supports this pattern
  }
  
  // --- End of Code Context: Type Definitions ---
  
  
  // --- Optimized Interviewer Assistant Configuration ---
  
  export const interviewer: CreateAssistantDTO = {
    name: "Professional Interviewer AI", // Slightly more descriptive name
    firstMessage:
      "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience.",
    transcriber: {
      provider: "deepgram",
      model: "nova-2", // Nova-2 is a good, current model for transcription
      language: "en",
    },
    voice: {
      provider: "11labs",
      voiceId: "sarah", // Make sure this voice ID is valid for your 11 Labs account
      stability: 0.4,
      similarityBoost: 0.8,
      speed: 0.95, // Slightly faster speed can sound more natural
      style: 0.5,
      useSpeakerBoost: true,
    },
    model: {
      provider: "openai",
      // Using 'gpt-4o' is generally recommended if available,
      // as it's often faster, cheaper, and performs well for conversational tasks.
      // If 'gpt-4o' isn't suitable or available, 'gpt-4-turbo' or 'gpt-4' are good alternatives.
      model: "gpt-4o",
      temperature: 0.7, // Add temperature for slightly more varied but still focused responses
      messages: [
        {
          role: "system",
          content: `You are a professional job interviewer conducting a real-time voice interview.
  Your goal is to assess the candidate's qualifications, motivation, and fit for the role based on the questions provided.
  
  **Key Instructions for Voice Interaction:**
  1.  **Be Brief and Conversational:** Your responses must be short, concise, and sound natural for a real-time voice call. Avoid lengthy explanations.
  2.  **Follow Question Structure:** Address the questions provided below sequentially.
      {{questions}}
  3.  **Engage Actively:** Listen carefully to the candidate's answers. Acknowledge their points before moving on.
  4.  **Optional Follow-ups:** Only ask *brief* follow-up questions if absolutely necessary for clarification.
  5.  **Maintain Professional Tone:** Be polite, welcoming, and professional using appropriate language.
  6.  **Handle Candidate Inquiries:** If asked about the role or company details, provide concise, relevant information. For specific HR/process questions, politely direct them to the HR contact.
  7.  **Concluding:** Thank the candidate for their time and clearly state the next steps (e.g., "HR will be in touch"). End the conversation positively.
  
  Prioritize natural, concise speech while covering the necessary points from the question list.`,
        },
        // You could optionally add a short assistant message here to guide the AI
        // on how to *start* after the firstMessage, but often the system prompt is enough.
        // { role: "assistant", content: "Okay, I understand. I will conduct the interview following these guidelines." }
      ],
    },
    // Optional: Define a message to play when the call ends
    endCallMessage: "Thank you for your time today. We will be in touch regarding the next steps.",
  };
  
  // --- Start of Code Context: Example Usage (Conceptual) ---
  
  // This part shows how you might use the DTO in a conceptual application flow.
  // The exact code will depend heavily on the platform or framework you are using.
  
  // Example questions that would be dynamically inserted
  const interviewQuestions: string[] = [
    "Could you start by telling me a little bit about yourself and your background?",
    "What interests you about this specific role and our company?",
    "Can you describe a challenging project you worked on and how you handled it?",
    "What are your strengths and weaknesses?",
    "Where do you see yourself in 5 years?",
    "Do you have any questions for me?",
  ];
  
  // In a real application, you would typically have a function
  // that takes the assistant config and the dynamic data (like questions)
  // and initiates the voice call or session.
  
  function startInterviewSession(assistantConfig: CreateAssistantDTO, questions: string[]): void {
    // 1. Format the questions for the prompt
    //    This replaces the {{questions}} placeholder in the system message
    const formattedQuestions = questions.map((q, index) => `${index + 1}. ${q}`).join('\n');
  
    // 2. Find and update the system message content
    const systemMessage = assistantConfig.model.messages.find(msg => msg.role === 'system');
  
    if (systemMessage) {
      systemMessage.content = systemMessage.content.replace('{{questions}}', formattedQuestions);
    } else {
      // Handle error: System message not found
      console.error("Error: System message not found in assistant config.");
      return;
    }
  
    // 3. Now, use the *updated* assistantConfig to create/start the session
    //    This is where you would typically interact with your Voice AI platform's SDK or API.
    console.log("Starting interview session with updated configuration...");
    console.log("Final System Prompt Content:", systemMessage.content);
  
    // Pseudocode example of calling a platform SDK:
    // yourVoicePlatformSDK.createSession({
    //   assistant: assistantConfig,
    //   candidatePhoneNumber: "+1...", // or other session parameters
    //   // ... other session specific settings
    // }).then(session => {
    //   console.log("Session started:", session.id);
    // }).catch(error => {
    //   console.error("Failed to start session:", error);
    // });
  
    console.log("Conceptual session initiation complete. Replace this with actual platform SDK/API calls.");
  }
  
  // Example of how you might call the function
  // startInterviewSession(interviewer, interviewQuestions); // Uncomment to see conceptual execution
  
  // --- End of Code Context: Example Usage (Conceptual) ---