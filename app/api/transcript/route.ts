
import {prisma} from '@/lib/db'
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { NextRequest, NextResponse } from "next/server";
import z from 'zod'

const feedbackSchema = z.object({
    interviewId: z.string().min(1),
    score: z.number().int().min(0).max(10),
    strengths: z.array(z.string().min(1)),
    weaknesses: z.array(z.string().min(1)),
    comments: z.string().min(1),
    areasToImprove: z.array(z.string().min(1)),
    userId: z.string().min(1)
})

export async function POST(req: NextRequest){
    const {userId, interviewId, transcript} = await req.json();

    try{
        const transcriptmsg = transcript.map((sentence: { role: string; content: string }) =>  `- ${sentence.role}: ${sentence.content}\n`).join("");

        const { object } = await generateObject({
            model: google("gemini-2.0-flash-001", {
                structuredOutputs: false,
            }),
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
            system: "You are an expert AI interview evaluator trained to critically assess candidate performance in technical and behavioral interviews. Your task is to analyze the given transcript and provide structured, honest, and constructive feedback. Your evaluation should be objective, detail-oriented, and focused on helping the candidate improve. Do not be lenient or vague. Avoid praise without justification. Always support strengths and weaknesses with clear reasoning from the transcript.",
        });

        const res = await prisma.feedback.create({
            data:{
                interviewId: interviewId,
                score: object.score,
                strengths: object.strengths,
                weaknesses: object.weaknesses,
                comments: object.comments,
                areasToImprove: object.areasToImprove,
                userId: userId
            }
        })
        return NextResponse.json({ success: true, data: res });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ success: false, error: "Failed to generate feedback." }, { status: 500 });
    }
}

export async function GET() {
    try {
      const feedbacks = await prisma.feedback.findMany({
        orderBy: { createdAt: 'desc' }
      });
  
      return NextResponse.json({ success: true, data: feedbacks });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ success: false, error: "Failed to fetch feedbacks." }, { status: 500 });
    }
}