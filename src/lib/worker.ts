import { Worker } from "bullmq";

const QUEUE_NAME = process.env.QUEUE_NAME || "encrypt-queue";

const connection = {
  host: "127.0.0.1",
  port: 6379,
};

const worker = new Worker(
  QUEUE_NAME,
  async (job) => {
    console.log("🔧 작업 실행:", job.name, job.data);
    // TODO: 여기서 AES 암호화 로직 실행

    // 시뮬레이션: 2-5초 걸리는 암호화 작업
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 3000 + 2000));

    return { success: true };
  },
  { connection },
);

worker.on("completed", (job) => {
  console.log(`✅ Job 완료: ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job 실패: ${job?.id}`, err);
});
