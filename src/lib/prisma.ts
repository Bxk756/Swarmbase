import { PrismaClient } from "@prisma/client"

console.log("🧠 PRISMA CLIENT INIT")

export const prisma = new PrismaClient()

// 🔍 DEBUG: show available models
console.log("🧠 PRISMA MODELS:", Object.keys(prisma))
