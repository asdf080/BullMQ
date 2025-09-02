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
    try {
      // job.data에서 고객 배열 가져오기
      const { customers, batchId } = job.data;

      console.log(`📦 배치 ${batchId} 암호화 시작: ${customers.length}명`);

      // 실제 암호화 실행
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

// Redis 연결 이벤트
worker.on("ready", () => {
  console.log("✅ Worker가 Redis에 연결되었습니다!");
});

worker.on("error", (error) => {
  console.error("❌ Worker 에러:", error);
});

worker.on("completed", (job) => {
  console.log(`✅ Job 완료: ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job 실패: ${job?.id}`, err);
});
