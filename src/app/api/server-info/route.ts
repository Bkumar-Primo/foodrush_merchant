import os from "node:os";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  await headers();
  try {
    const interfaces = os.networkInterfaces();
    let localIp = "localhost";

    for (const name of Object.keys(interfaces)) {
      const netList = interfaces[name];
      if (netList) {
        for (const net of netList) {
          // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
          if (net.family === "IPv4" && !net.internal) {
            localIp = net.address;
            break;
          }
        }
      }
      if (localIp !== "localhost") break;
    }

    return NextResponse.json({
      localIp,
      port: process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000,
    });
  } catch (error) {
    console.error("Failed to get server info:", error);
    return NextResponse.json({ localIp: "localhost", port: 3000 });
  }
}
