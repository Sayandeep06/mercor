import { prisma } from "@/lib/db"
import { google } from '@ai-sdk/google';
import { NextRequest, NextResponse } from "next/server";
import {generateText} from "ai";
import { getServerSession } from "next-auth";


export async function POST(req: NextRequest, res: NextResponse){
   const session = await getServerSession();

    const user = await prisma.user.findFirst({
      where: {
        email: session?.user?.email ?? "",
      },
    });
  
    if (!user) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 403 });
    } 
    const {jobrole, level, skills} = await req.json();
    console.log("reached checkpoint 1")
    try{
        console.log("reached checkpoint try")
        const { text } = await generateText({
            model: google("gemini-2.0-flash-001"),
            prompt: `Prepare questions for a job interview.
              The job role is ${jobrole}.
              The job experience level is ${level}.
              The tech stack used in the job is: ${skills}.
              The focus between behavioural and technical questions should lean towards: ${jobrole}.
              The amount of questions required is between 8-10.
              Please return only the questions, without any additional text.
              The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
              Return the questions formatted like this:
              ["Question 1", "Question 2", "Question 3"]
          `,
        });

        console.log("reached checkpoint 2")

        const questions = JSON.parse(text);

        console.log("reached checkpoint 3")

        const interview = await prisma.interview.create({
            data:{
                userId: user.id,
                jobRole: jobrole,
                experienceLevel: level,
                skills: skills.split(",").map((s: string) => s.trim()),
                questions: questions
            }
        });

        console.log("reached checkpoint 4")
        return NextResponse.json({success: true, interview})
    }catch(e){
        console.log(e)
        return NextResponse.json({
            success: false,
            error: "Something went wrong",
            details: e instanceof Error ? e.message : e
        })
    }
}