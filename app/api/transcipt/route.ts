import axios from "axios";
import {prisma} from '@/lib/db'
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse){
    const {userId, interviewId, transcript} = await req.json();

    
}