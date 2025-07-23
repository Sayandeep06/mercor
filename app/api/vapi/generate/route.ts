import { prisma } from "@/lib/db";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";

export async function POST(req: NextRequest) {
  const { jobrole, level, skills} = await req.json();
  const session = await getServerSession();

  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email ?? "",
    },
  });

  const userId = user?.id;

  try {
    const { text } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare 8–10 interview questions for a ${level} ${jobrole} position with a balance between both technical and behavioral.
Use the following tech stack: ${skills}.
Lean more toward ${jobrole}-style questions.
Return ONLY a JSON array like ["Question 1", "Question 2", ...]. No extra text, no markdown.`,
    });

    const raw = text
      .replace(/```json/i, "")
      .replace(/```/, "")
      .trim();

    console.log("Cleaned output:", raw);

    let questions: string[];
    try {
      questions = JSON.parse(raw);
      if (!Array.isArray(questions)) throw new Error("Output is not an array");
      questions = questions.slice(0, 10);
    } catch (err) {
      return Response.json(
        {
          success: false,
          error: "Failed to parse questions",
          rawOutput: raw,
          details: err instanceof Error ? err.message : err,
        },
        { status: 500 }
      );
    }
    if(userId){
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
    }else{
      return Response.json({ success: false}, { status: 400 });
    }
  } catch (e) {
    console.error("Error in interview creation:", e);
    return Response.json(
      {
        success: false,
        error: "Internal server error",
        details: e instanceof Error ? e.message : e,
      },
      { status: 500 }
    );
  }
}