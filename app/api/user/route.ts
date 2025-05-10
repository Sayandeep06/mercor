import { prisma } from "@/lib/db"
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET(){
    try{    
        const session = await getServerSession();

        const user = await prisma.user.findFirst({
        where: {
            email: session?.user?.email ?? "",
        },
        });

        return NextResponse.json({
            userId: user?.id
        })
    }catch(e){
        return NextResponse.json({
            e
        },{
            status: 400
        })
    }
}