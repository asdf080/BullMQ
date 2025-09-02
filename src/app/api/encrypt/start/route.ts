import { prisma } from "@/lib/prisma";
import { encryptQueue } from "@/lib/queue";

export async function POST() {
  const customerData = await prisma.customer.findMany({ where: { encrypted: false } });

  try {
    // 20,000명을 100명씩 나누어 200개 Job 생성
    // 100명씩 잘라서 Job에 포함
    for (let i = 0; i < Math.ceil(customerData.length / 100); i++) {
      const startIdx = i * 100;
      const endIdx = Math.min((i + 1) * 100, customerData.length);
      const customerBatch = customerData.slice(startIdx, endIdx);
      // for (let i = 0; i < 10; i++) {
      //   const customerBatch = customerData.slice(1, 10);

      await encryptQueue.add("encrypt-batch", {
        batchId: i + 1,
        customers: customerBatch,
        totalCustomers: customerData.length,
      });
    }

    return Response.json({ message: "암호화 작업 시작됨" });
  } catch (error) {
    return Response.json({ error: "작업 생성 실패" }, { status: 500 });
  }
}
