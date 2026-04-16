import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import prisma from "../../lib/prisma"

const ACCESS_SECRET = process.env.JWT_SECRET!
const REFRESH_SECRET = process.env.REFRESH_SECRET!

export class AuthService {
  static async register(email: string, password: string, name: string) {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw new Error("User already exists")
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hash,
        name
      }
    })

    return user
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      throw new Error("Invalid credentials")
    }

    const valid = await bcrypt.compare(password, user.password)

    if (!valid) {
      throw new Error("Invalid credentials")
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      ACCESS_SECRET,
      { expiresIn: "15m" }
    )

    const refreshToken = jwt.sign(
      { id: user.id },
      REFRESH_SECRET,
      { expiresIn: "7d" }
    )

    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex")

    const tokenFamily = crypto.randomUUID()

    await prisma.refreshToken.create({
      data: {
        tokenHash,
        userId: user.id,
        tokenFamily
      }
    })

    return {
      user,
      accessToken,
      refreshToken
    }
  }

  static async logout(refreshToken: string) {
    const hash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex")

    await prisma.refreshToken.deleteMany({
      where: { tokenHash: hash }
    })
  }
}
