---
name: project-onboarding
description: Guides new developers through this project's setup, architecture, and tech stack. Use when someone asks how to set up or run the project, how to get started, what technologies are used, or any orientation question from someone unfamiliar with the codebase — e.g. "โปรเจกต์นี้ตั้งค่าอย่างไร", "เริ่มต้นพัฒนาอย่างไร", "ใช้ tech stack อะไรบ้าง".
compatibility: Requires Node.js 22+
license: MIT
metadata: 
  author: Chansinee Mueangnu
  version: "1.0"
---

## First-Time Setup

```bash
# 1. Install deps
npm install

# 2. Copy env
cp .env.example .env

# 3. Pull DB Schema (Prisma ORM)
npx prisma db pull

#4. Generate Prisma Client
npx prisma generate

#5. Check lint 
npm run lint


## Gotchas
- ต้องติดตั้ง และปิด docker desktop ไว้

## Output
- ถ้าถามการ Setup ให้ตอบเป็นในรูปแบบของตาราง และอ่านง่าย

```
