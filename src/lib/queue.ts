// lib/queue.ts
import { Queue } from "bullmq";

const connection = {
  host: "127.0.0.1", // Docker Redis 주소
  port: 6379,
};

export const encryptQueue = new Queue("encrypt-queue", { connection });
// encrypt-queue라는 이름의 큐 생성
// connection 옵션을 통해 Redis 서버와 연결
