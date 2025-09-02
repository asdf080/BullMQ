import { encryptQueue } from "@/lib/queue";

export async function GET() {
  const completed = await encryptQueue.getCompleted();
  const failed = await encryptQueue.getFailed();
  const waiting = await encryptQueue.getWaiting();

  return Response.json({
    total: 200,
    completed: completed.length,
    failed: failed.length,
    waiting: waiting.length,
    progress: (completed.length / 200) * 100,
  });
}
