import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mysql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: false,
        minPasswordLength: 8
    },
    user: {
        additionalFields: {
            // ผูกกับคอลัมน์ role ใน User เพื่อให้ session.user.role ใช้งานได้
            // input: false → กันไม่ให้ client ตั้ง role ตอนสมัครเอง
            role: {
                type: "string",
                required: false,
                defaultValue: "user",
                input: false,
            },
        },
    },
});