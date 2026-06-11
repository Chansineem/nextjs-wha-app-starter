---
name: deploy
description: Guides deploying this Next.js 16 app to production via Docker (multi-stage build → standalone output, run with .env.production). Use when someone asks how to deploy, build the Docker image, run the production container, ship to prod, or troubleshoots a build/deploy failure — e.g. "deploy ยังไง", "build docker image", "ขึ้น production", "รัน container".
compatibility: Requires Docker Desktop running, and a reachable MySQL/MariaDB instance (the app container connects via host.docker.internal)
license: MIT
metadata:
  author: Chansinee Mueangnu
  version: "1.0"
---

# Deploy (Docker)

แอปนี้ deploy ด้วย **Docker multi-stage build** → Next.js `standalone` output แล้วรันเป็น container
ทำตามลำดับนี้ทุกครั้ง อย่าข้ามขั้นตอน pre-flight

## ก่อน build — Pre-flight checklist

ทำ 4 อย่างนี้ให้ครบก่อนเสมอ (กันพังตอน build / ขึ้น prod แล้วค่าผิด):

| # | ขั้นตอน | คำสั่ง / สิ่งที่เช็ค |
|---|---------|---------------------|
| 1 | **เช็ค `.env.production`** | ค่า `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` ครบและตรง prod — ดู [§ .env.production](#envproduction) |
| 2 | **Lint** | `npm run lint` — ต้องผ่านไม่มี error |
| 3 | **Build ทดสอบในเครื่อง** | `npm run build` — เช็คว่า build ผ่านก่อนเอาเข้า Docker (เร็วกว่า debug ใน image) |
| 4 | **Commit & push** | commit งานที่จะ deploy ให้เรียบร้อย (`git add <files>` เฉพาะที่เกี่ยว แล้ว commit + push) |

> ถ้าแก้ `schema.prisma` มาก่อน อย่าลืม `npx prisma generate` แล้ว build ทดสอบใหม่ — ไม่งั้น import พัง

## Build & Run

```bash
# 1. Build image (Dockerfile มี ARG DATABASE_URL dummy default ไว้แล้ว — ไม่ต้องส่ง --build-arg)
docker build -t wha-app .

# 2. รัน container ด้วยค่า prod จาก .env.production
docker run --rm --env-file .env.production -p 3000:3000 wha-app

#    หรือรันเบื้องหลังแบบตั้งชื่อ container
docker run -d --name wha-app --env-file .env.production -p 3000:3000 wha-app

# 3. เปิด http://localhost:3000 เช็คว่าแอปขึ้น และล็อกอิน/ต่อ DB ได้
```

จัดการ container:

```bash
docker logs -f wha-app      # ดู log
docker stop wha-app         # หยุด
docker rm wha-app           # ลบ (ก่อน build+run รอบใหม่ที่ใช้ชื่อเดิม)
```

Deploy เวอร์ชันใหม่: `docker stop wha-app && docker rm wha-app` → `docker build -t wha-app .` → `docker run -d ...` ซ้ำ

## .env.production

ไฟล์นี้ **ไม่ถูก commit** (ดู `.dockerignore` / `.gitignore`) และ **ไม่ถูก bake เข้า image** — ส่งเข้าตอน `docker run` ผ่าน `--env-file` เท่านั้น

| ตัวแปร | หมายเหตุ |
|--------|----------|
| `DATABASE_URL` | ใช้ `host.docker.internal` แทน `localhost` เพราะ DB อยู่บน host ไม่ใช่ใน container — เช่น `mysql://root:...@host.docker.internal:3306/wha_ecommerce?connection_limit=5&pool_timeout=30` |
| `BETTER_AUTH_SECRET` | secret ของ better-auth — prod ต้องเป็นค่าจริง อย่าใช้ค่า dev |
| `BETTER_AUTH_URL` | URL ที่ผู้ใช้เข้าถึงจริง (ตอนรันในเครื่องคือ `http://localhost:3000`; ถ้าขึ้นโดเมนจริงต้องเปลี่ยน) |

## ทำไม Dockerfile ถึงเป็นแบบนี้ (จุดที่พังบ่อย)

- **Dummy `DATABASE_URL` ตอน build** (`ARG`/`ENV` ใน builder stage): Prisma 7 config validate env ตอน `prisma generate` / build ถ้าไม่มีจะพัง — ใส่ค่าหลอกไว้ build ผ่าน ค่าจริงค่อยส่งตอน run
- **`output: 'standalone'`** ใน `next.config.ts`: ทำให้ runner stage คัดลอกแค่ `.next/standalone` + `.next/static` + `public` ได้ image เล็ก รันด้วย `node server.js`
- **คัดลอก `generated/` + `prisma/`** เข้า runner: เพราะ Prisma client gen ไปที่ `generated/prisma` (ไม่ใช่ `node_modules`) — ขาดอันนี้ runtime หา client ไม่เจอ
- รันเป็น **non-root user (`nextjs`)** — ปกติ ไม่ต้องแก้

## Troubleshooting

| อาการ | สาเหตุ / วิธีแก้ |
|-------|------------------|
| Build พังที่ `prisma generate` | env validate fail — เช็คว่า `ARG DATABASE_URL` dummy ใน Dockerfile ยังอยู่ |
| Container รันแล้วต่อ DB ไม่ได้ | `DATABASE_URL` ใช้ `localhost` แทน `host.docker.internal` / DB บน host ไม่ได้เปิด / port ไม่ตรง |
| ล็อกอินไม่ได้บน prod | `BETTER_AUTH_URL` ไม่ตรงโดเมนจริง หรือ `BETTER_AUTH_SECRET` ไม่ถูกส่งเข้า container |
| แก้โค้ดแล้วแต่ container ยังเป็นของเก่า | ลืม rebuild — ต้อง `docker build` ใหม่ทุกครั้ง (image ไม่ auto-reload เหมือน dev) |
| Port ชน | มี process ใช้ 3000 อยู่ — เปลี่ยน host port: `-p 8080:3000` |

## Response Format

ถ้าถูกถามเรื่อง deploy ให้ไล่ตาม **Pre-flight → Build → Run** เป็นลำดับ และเตือน pre-flight ทุกครั้ง อย่าข้ามไป build เลย
