import { prisma } from "@/lib/db"
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET(){
    const session = await getServerSession();

    const user = await prisma.user.findFirst({
      where: {
        email: session?.user?.email ?? "",
      },
    });
  
    if (!user) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 403 });
    } 
    try{
        const interview = await prisma.interview.findMany({
            where: {
                userId: user.id
            }
        });

        return NextResponse.json({
            interview
        },{
            status: 200
        })
        
    }catch(e){
        return NextResponse.json({
            error: e
        },{status: 403})
    }
}
