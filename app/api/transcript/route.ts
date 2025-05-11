import {prisma} from '@/lib/db'
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import z from 'zod'

const feedbackSchema = z.object({
    score: z.number().int().min(0).max(10),
    strengths: z.array(z.string().min(1)).optional(),
    weaknesses: z.array(z.string().min(1)).optional(),
    comments: z.string().min(1),
    areasToImprove: z.array(z.string().min(1)).optional(),
})

export async function POST(req: NextRequest){
    let requestBody;
    try{
        requestBody = await req.json();
        console.log('Received POST request body:', JSON.stringify(requestBody, null, 2));

        const {userId, interviewId, transcript} = requestBody;

        if (!userId || !interviewId || !transcript) {
            console.error("Missing required fields in request body:", { userId: !!userId, interviewId: !!interviewId, transcript: !!transcript });
             return NextResponse.json({ success: false, error: "Missing required fields (userId, interviewId, transcript)." }, { status: 400 });
        }

        console.log('Transcript received (backend):', transcript);
        console.log('Transcript length (backend):', transcript.length);

        if (!Array.isArray(transcript) || transcript.length === 0) {
            console.warn("Received empty or invalid transcript array. Skipping AI processing.");
            try {
                 const res = await prisma.feedback.create({
                    data: {
                        interviewId: interviewId,
                        score: 0,
                        strengths: [],
                        weaknesses: [],
                        comments: "No transcript received or transcript was empty.",
                        areasToImprove: [],
                        userId: userId
                    }
                });
                 console.log("Saved minimal feedback for empty transcript:", res.id);
                 return NextResponse.json({ success: true, data: res, message: "Received empty transcript, saved minimal feedback." });

            } catch (dbError) {
                 console.error("Failed to save minimal feedback for empty transcript:", dbError);
                 return NextResponse.json({ success: false, error: "Received empty transcript, but failed to save minimal feedback." }, { status: 500 });
            }
        }

        const transcriptmsg = transcript.map((sentence: { role: string; content: string }) =>  `- ${sentence.role}: ${sentence.content}`).join("\n");
        console.log('Formatted Transcript for AI:', transcriptmsg);


        let generatedObject;
        try {
             const { object } = await generateObject({
                model: google("gemini-2.0-flash-001"),
                schema: feedbackSchema,
                prompt: `
                You are an AI interviewer evaluating a candidate based on the following mock interview transcript. Provide a critical, honest, and structured assessment of the candidate. Focus on identifying both strengths and weaknesses, and suggest actionable areas for improvement.

                Transcript:
                ${transcriptmsg}

                Your evaluation should include the following:
                1. **Overall Score**: A single integer score out of 10 reflecting the candidate’s performance.
                2. **Strengths**: A list of specific strengths the candidate demonstrated.
                3. **Weaknesses**: A list of weaknesses or mistakes that were evident during the interview.
                4. **Comments**: A concise summary of the candidate’s performance.
                5. **Areas to Improve**: A list of actionable suggestions to help the candidate perform better in future interviews.

                Do not fabricate information not present in the transcript. Be critical where needed, and do not provide generic feedback.
                `,
                system: "You are an expert AI interview evaluator trained to critically assess candidate performance in technical and behavioral interviews. Your task is to analyze the given transcript and provide structured, honest, and constructive feedback. Your evaluation should be objective, detail-oriented, and focused on helping the candidate improve. Do not be lenient or vague. Avoid praise without justification. Always support strengths and weaknesses with clear reasoning from the transcript. Respond ONLY with the JSON object conforming to the provided schema.",
            });
            generatedObject = object;
            console.log('AI Generated Object:', JSON.stringify(generatedObject, null, 2));

            try {
                feedbackSchema.parse(generatedObject);
                console.log("AI object conforms to schema.");
            } catch (validationError) {
                console.error("AI object failed schema validation!", validationError);
            }


        } catch (aiError) {
             console.error("Failed during AI generateObject call:", aiError);
             return NextResponse.json({ success: false, error: "Failed to generate feedback from AI." }, { status: 500 });
        }
        const res = await prisma.feedback.upsert({
          where: {
            interviewId, 
          },
          update: {
            score: generatedObject.score,
            strengths: generatedObject.strengths || [],
            weaknesses: generatedObject.weaknesses || [],
            comments: generatedObject.comments,
            areasToImprove: generatedObject.areasToImprove || [],
          },
          create: {
            interviewId,
            userId,
            score: generatedObject.score,
            strengths: generatedObject.strengths || [],
            weaknesses: generatedObject.weaknesses || [],
            comments: generatedObject.comments,
            areasToImprove: generatedObject.areasToImprove || [],
          }
        });
        console.log('Feedback saved to DB:', res.id);
        return NextResponse.json({ success: true, data: res });

    } catch (error) {
      console.error('An unexpected error occurred in POST handler:', error);
      if (error instanceof Error) {
          console.error(error.stack);
      }
      return NextResponse.json({ success: false, error: "An unexpected server error occurred." }, { status: 500 });
    }
}

export async function GET() {
  const session = await getServerSession();

  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email ?? "",
    },
  });

  if (!user) {
    return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
  }

  try {
    const feedbacks = await prisma.feedback.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, data: feedbacks });
  } catch (error) {
    console.error('Error fetching feedbacks in GET handler:', error);
    return NextResponse.json({ success: false, error: "Failed to fetch feedbacks." }, { status: 500 });
  }
}