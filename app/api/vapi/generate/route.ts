import { prisma } from "@/lib/db";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { jobrole, level, skills, userId } = await req.json();

  try {
    const { text } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Return a list of job interview questions for a ${level} ${jobrole} position using ${skills}.
Focus more on ${jobrole} questions.
Return ONLY a JSON array of strings like: ["Question 1", "Question 2"].
Do NOT add any explanation or extra text.
Avoid special characters like / or *.
This will be parsed using JSON.parse.`,
    });

    const raw = text.trim();
    console.log("Raw model output:", raw);

    let questions: string[];
    try {
      questions = JSON.parse(raw);
      if (!Array.isArray(questions)) throw new Error("Parsed output is not an array");
    } catch (err) {
      return Response.json(
        {
          success: false,
          error: "Failed to parse model output",
          rawOutput: raw,
          details: err instanceof Error ? err.message : err,
        },
        { status: 500 }
      );
    }

    const interview = await prisma.interview.create({
      data: {
        userId,
        jobRole: jobrole,
        experienceLevel: level,
        skills: skills.split(",").map((s: string) => s.trim()),
        questions,
      },
    });

    return Response.json({ success: true, interview }, { status: 200 });
  } catch (e) {
    console.error("Error in handler:", e);
    return Response.json(
      {
        success: false,
        error: "Something went wrong",
        details: e instanceof Error ? e.message : e,
      },
      { status: 500 }
    );
  }
}