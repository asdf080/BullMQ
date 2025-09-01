- nextjs 프로젝트 생성
- redis 이미지 다운로드 및 컨테이너 실행

```bash
docker pull redis
docker run --name myredis -d redis
```

- BullMQ와 Redis 연결용 라이브러리 다운

```bash
npm install bullmq ioredis
```

- lib/queue.ts에 Redis로 Queue 생성
