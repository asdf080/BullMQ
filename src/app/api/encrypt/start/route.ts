import { encryptQueue } from "@/lib/queue";
import fs from "fs";
import path from "path";

//process.cwd() == node 명령 호출한 디렉토리의 절대경로(루트경로)
const filePath = path.join(process.cwd(), "customer_data.json");
const customerData = JSON.parse(fs.readFileSync(filePath, "utf8"));

export async function POST() {
  try {
    // 20,000명을 100명씩 나누어 200개 Job 생성
    // 100명씩 잘라서 Job에 포함
    for (let i = 0; i < 200; i++) {
      const startIdx = i * 100;
      const endIdx = Math.min((i + 1) * 100, customerData.length);
      const customerBatch = customerData.slice(startIdx, endIdx);

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
