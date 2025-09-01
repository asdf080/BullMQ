import { NextResponse } from "next/server";
import { encryptQueue } from "@/lib/queue";

export async function POST() {
  // 테스트용 Job
  await encryptQueue.add("encrypt-job", { message: "Hello BullMQ" });

  return NextResponse.json({ status: "job added" });
}
