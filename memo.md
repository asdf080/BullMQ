# BullMQ

- next 프로젝트 생성
- redis 이미지 다운로드 및 컨테이너 실행

```bash
docker pull redis
docker run --name myredis -d -p 6379:6379 redis
```

- BullMQ와 Redis 연결용 라이브러리 다운

```bash
npm install bullmq ioredis
```

- lib/queue.ts에 Redis로 Queue 생성

- app/api/encrypt/start/route.ts에 큐에 job넣는 api 생성

- app/api/encrypt/status/route.ts에 작업 상태 조회하는 api 생성

- lib/worker.ts에 job실행하는 worker 생성

- lib/encryption에 암호화/복호화 메서드 추가

- lib/script와 lib에 data generate 관련 메서드 추가

- 데이터 생성기 실행(실행 후 루트에 customer_data.json 파일 생성됨)

```bash
pnpx tsx src/scripts/generate-data.ts
```

- 워커 실제 실행

```bash
pnpx tsx src/lib/worker.ts
```

- pnpm dev로 nextjs 실행

- 포스트맨에서 api/encrypt/start 주소로 post 요청

- 암호화 작업 완료

```bash
# tsx 설치 (ts-node 대신)
pnpm add -D tsx

# 실행
pnpx tsx src/scripts/generate-data.ts
```

- Queue 흐름

```bash
Producer (API) → Queue (Redis) → Worker (별도 프로세스)
     ↓              ↓              ↓
   Job 생성      Job 저장       Job 처리
```

---

```bash
npm install sqlite3
npm install prisma
npx prisma init --datasource-provider sqlite
```

- prisma.schema 파일에 모델 작성 후 pnpx prisma db push

- data generate, api 라우트, worker에 실제 파일관련 코드를 prisma 코드로 수정
