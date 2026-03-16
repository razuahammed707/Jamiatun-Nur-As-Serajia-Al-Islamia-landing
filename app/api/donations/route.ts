import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// GET - Fetch donations (admin only)
export async function GET(request: Request) {
  try {
    const tokenPayload = await verifyToken();
    if (!tokenPayload) {
      return NextResponse.json({ error: "অনুমতি নেই" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = 20;
    const skip = (page - 1) * limit;

    if (!(prisma as any).donation) {
      console.error("Prisma Error: 'donation' model is missing from the client. Please restart the dev server.");
      return NextResponse.json({ error: "Prisma Client are stale. Please restart the server." }, { status: 500 });
    }

    const [donations, total] = await Promise.all([
      (prisma as any).donation.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      (prisma as any).donation.count(),
    ]);

    return NextResponse.json({
      donations,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Fetch donations error:", error);
    return NextResponse.json(
      { error: "অনুদান তথ্য লোড করতে সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
}

// POST - Public donation submission
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, 
      phone, 
      address, 
      sector, 
      amount, 
      trxId, 
      bankAccount, 
      paymentMethod, 
      isAnonymous 
    } = body;

    if (!sector || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: "প্রয়োজনীয় তথ্য প্রদান করুন" },
        { status: 400 }
      );
    }

    const donation = await (prisma as any).donation.create({
      data: {
        name: isAnonymous ? null : name,
        phone: isAnonymous ? null : phone,
        address: isAnonymous ? null : address,
        sector,
        amount: parseFloat(amount),
        trxId: trxId || null,
        bankAccount: bankAccount || null,
        paymentMethod,
        isAnonymous: !!isAnonymous,
        status: "PENDING",
      },
    });

    return NextResponse.json(donation, { status: 201 });
  } catch (error) {
    console.error("Create donation error:", error);
    return NextResponse.json(
      { error: "অনুদান দাখিল করতে সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
}

// PATCH - Verify/Reject donation (admin only)
export async function PATCH(request: Request) {
  try {
    const tokenPayload = await verifyToken();
    if (!tokenPayload) {
      return NextResponse.json({ error: "অনুমতি নেই" }, { status: 401 });
    }

    const { id, status } = await request.json();

    if (!id || !["VERIFIED", "REJECTED", "PENDING"].includes(status)) {
      return NextResponse.json({ error: "সঠিক তথ্য প্রদান করুন" }, { status: 400 });
    }

    const updated = await (prisma as any).donation.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update donation error:", error);
    return NextResponse.json(
      { error: "আপডেট করতে সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
}
