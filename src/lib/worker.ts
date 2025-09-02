import { Worker } from "bullmq";
import { encryptCustomerBatch } from "@/lib/encryption";

const QUEUE_NAME = process.env.QUEUE_NAME || "encrypt-queue";

const connection = {
  host: "127.0.0.1",
  port: 6379,
};

const worker = new Worker(
  QUEUE_NAME,
  async (job) => {
    console.log("🔧 작업 실행:", job.name, job.data);

    try {
      // job.data에서 고객 배열 가져오기
      const { customers, batchId } = job.data;

      console.log(`📦 배치 ${batchId} 암호화 시작: ${customers.length}명`);

      // 실제 암호화 실행 (시뮬레이션 코드 대신)
      const encryptedCustomers = await encryptCustomerBatch(customers);

      // 성공한 고객 수 계산
      const successCount = encryptedCustomers.filter((c) => c.encrypted).length;
      const failCount = customers.length - successCount;

      console.log(`✅ 배치 ${batchId} 완료: 성공 ${successCount}명, 실패 ${failCount}명`);

      return {
        success: true,
        batchId,
        processedCount: successCount,
        failedCount: failCount,
        encryptedCustomers, // 결과 데이터
      };
    } catch (error) {
      console.error(`❌ 배치 ${job.data.batchId} 처리 실패:`, error);
      throw error;
    }
  },
  { connection },
);

worker.on("completed", (job) => {
  console.log(`✅ Job 완료: ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job 실패: ${job?.id}`, err);
});
