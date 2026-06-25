import { NextResponse } from "next/server";
import { addServerOrder, getOrders } from "@/lib/db/serverDb";
import { isOrder } from "@/lib/db/validators";

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!isOrder(body)) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }
    await addServerOrder(body);
    return NextResponse.json({ success: true, order: body });
  } catch (error) {
    console.error("Failed to add order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
