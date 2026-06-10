---
name: project-onboarding
description: Guides new developers through this project's setup, architecture, and tech stack. Use when someone asks how to set up or run the project, how to get started, what technologies are used, or any orientation question from someone unfamiliar with the codebase — e.g. "โปรเจกต์นี้ตั้งค่าอย่างไร", "เริ่มต้นพัฒนาอย่างไร", "ใช้ tech stack อะไรบ้าง".
compatibility: Requires Node.js 22+ and a running MySQL/MariaDB instance
license: MIT
metadata:
  author: Chansinee Mueangnu
  version: "1.1"
---

# Project Onboarding

A Thai-language e-commerce / course app on **Next.js 16 (App Router) + React 19**.

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19
- **Database**: MySQL/MariaDB via **Prisma 7** with the MariaDB driver adapter
  (client is generated to `./generated/prisma`, NOT `node_modules`)
- **Auth**: better-auth (email/password)
- **State**: Zustand (cart, persisted to localStorage)
- **Forms**: react-hook-form + Zod
- **UI**: shadcn/ui + Tailwind CSS v4

## First-Time Setup

```bash
# 1. Install deps
npm install

# 2. Create .env with a MySQL/MariaDB connection string
#    (there is no .env.example — create the file yourself)
#    DATABASE_URL="mysql://user:password@localhost:3306/dbname"

# 3. Generate the Prisma client (output goes to ./generated/prisma)
#    REQUIRED — imports break without this
npx prisma generate

# 4. Start the dev server (http://localhost:3000)
npm run dev
```

## Gotchas

- **เปิด Docker Desktop ค้างไว้** ตลอดที่พัฒนา — ฐานข้อมูล (MySQL/MariaDB) รันใน Docker container ถ้าปิด แอปจะต่อ DB ไม่ได้
- ทุกครั้งที่แก้ `schema.prisma` ต้องรัน `npx prisma generate` ใหม่ ไม่งั้น import จะพัง
- Prisma client อยู่ที่ `generated/prisma` ไม่ใช่ `@prisma/client` — import จาก `src/lib/prisma.ts` (singleton) เท่านั้น อย่า `new PrismaClient()` เอง
- `npx prisma db pull` จะ **เขียนทับ** `schema.prisma` จาก DB ปัจจุบัน — ใช้เฉพาะตอนตั้งใจ introspect เท่านั้น อย่ารันตอน setup ครั้งแรก

## Response Format

ถ้าถูกถามเรื่องการ Setup ให้ตอบเป็น **ตาราง** (ขั้นตอน / คำสั่ง / คำอธิบาย) ให้อ่านง่าย
