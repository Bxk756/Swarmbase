import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash("password123", 10)

  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      password,
      name: "Brian"
    }
  })

  console.log("User created:", user.email)
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
