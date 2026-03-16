import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// GET - Publicly fetch active videos
export async function GET() {
  try {
    const videos = await (prisma as any).video.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(videos);
  } catch (error) {
    console.error("Fetch videos error:", error);
    return NextResponse.json({ error: "ভিডিও লোড করতে সমস্যা হয়েছে" }, { status: 500 });
  }
}

// POST - Add a new video (Admin Only)
export async function POST(request: Request) {
  try {
    const tokenPayload = await verifyToken();
    if (!tokenPayload) {
      return NextResponse.json({ error: "অনুমতি নেই" }, { status: 401 });
    }

    const { title, youtubeId } = await request.json();

    if (!title || !youtubeId) {
      return NextResponse.json({ error: "শিরোনাম এবং ইউটিউব আইডি আবশ্যক" }, { status: 400 });
    }

    // Extract ID if full URL is provided
    let finalId = youtubeId;
    if (youtubeId.includes("v=")) {
      finalId = youtubeId.split("v=")[1].split("&")[0];
    } else if (youtubeId.includes("youtu.be/")) {
      finalId = youtubeId.split("youtu.be/")[1].split("?")[0];
    }

    const video = await (prisma as any).video.create({
      data: { title, youtubeId: finalId },
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error("Create video error:", error);
    return NextResponse.json({ error: "ভিডিও যোগ করতে সমস্যা হয়েছে" }, { status: 500 });
  }
}

// DELETE - Remove a video (Admin Only) - Adding this in a separate file if needed or handle here
export async function DELETE(request: Request) {
  try {
    const tokenPayload = await verifyToken();
    if (!tokenPayload) return NextResponse.json({ error: "অনুমতি নেই" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID আবশ্যক" }, { status: 400 });

    await (prisma as any).video.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete video error:", error);
    return NextResponse.json({ error: "মুছে ফেলতে সমস্যা হয়েছে" }, { status: 500 });
  }
}
