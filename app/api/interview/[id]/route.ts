import { prisma } from "@/lib/db"
import { NextRequest,NextResponse } from "next/server";
import { getServerSession } from "next-auth";

interface RouteParams {
    id: string; 
}
  

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) {
    const { id } = await context.params;
    const session = await getServerSession();
  
    const user = await prisma.user.findFirst({
      where: {
        email: session?.user?.email ?? "",
      },
    });
  
    if (!user) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 403 });
    }
  
    try {
      const interview = await prisma.interview.findFirst({
        where: {
          userId: user.id,
          id,
        },
      });
      console.log(interview)
      return NextResponse.json({ interview }, { status: 200 });
    } catch (e) {
      return NextResponse.json({ error: e }, { status: 403 });
    }
  }