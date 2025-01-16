import { NextRequest, NextResponse } from "next/server";

export async function GET() {
 return NextResponse.json({
    message: "success get api/history"
 })   
}

export async function POST(request: NextRequest) {
    const {url} = await request.json()
    console.log('Logged URL:', url);

  return NextResponse.json({ success: url });
}