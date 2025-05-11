import { prisma } from "@/lib/db";
import { google } from '@ai-sdk/google';
import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";

export async function POST(req: NextRequest) {
    const { jobrole, level, skills, userId } = await req.json();
    console.log("reached checkpoint 1");

    try {
        console.log("reached checkpoint try");

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
              Return ONLY a valid JSON array of plain text questions, like: ["Question 1", "Question 2", "Question 3"] — nothing else.
          `,
        });

        console.log("reached checkpoint 2");

        const raw = text.trim();
        console.log("Raw model output:", raw);

        let questions: string[];
        try {
            questions = JSON.parse(raw);
            if (!Array.isArray(questions)) {
                throw new Error("Parsed output is not an array");
            }
        } catch (err) {
            return NextResponse.json({
                success: false,
                error: "Failed to parse model output",
                rawOutput: raw,
                details: err instanceof Error ? err.message : err
            });
        }

        console.log("reached checkpoint 3");

        const interview = await prisma.interview.create({
            data: {
                userId,
                jobRole: jobrole,
                experienceLevel: level,
                skills: skills.split(",").map((s: string) => s.trim()),
                questions
            }
        });

        console.log("reached checkpoint 4");

        return NextResponse.json({ success: true, interview });
    } catch (e) {
        console.log(e);
        return NextResponse.json({
            success: false,
            error: "Something went wrong",
            details: e instanceof Error ? e.message : e
        });
    }
}