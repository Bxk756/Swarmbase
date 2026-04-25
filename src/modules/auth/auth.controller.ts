import { FastifyRequest, FastifyReply } from "fastify"
import { prisma } from "../../lib/prisma"
import jwt from "jsonwebtoken"

console.log("🔐 AUTH CONTROLLER LOADED")

export class AuthController {

  // -----------------------------
  // REGISTER
  // -----------------------------
  static async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any || {}

      console.log("REGISTER BODY:", body)
      console.log("PRISMA USER:", (prisma as any).user)

      if (!(prisma as any).user) {
        throw new Error("Prisma client missing 'user'")
      }

      const { email, password, name } = body

      if (!email || !password) {
        return reply.status(400).send({
          error: "Email and password required"
        })
      }

      const existing = await prisma.user.findUnique({
        where: { email }
      })

      if (existing) {
        return reply.status(400).send({
          error: "User already exists"
        })
      }

      const user = await prisma.user.create({
        data: {
          email,
          password,
          name: name || "User"
        }
      })

      return {
        id: user.id,
        email: user.email
      }

    } catch (err: any) {
      console.error("REGISTER ERROR:", err)
      return reply.status(500).send({
        error: err.message
      })
    }
  }

  // -----------------------------
  // LOGIN
  // -----------------------------
  static async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any || {}

      console.log("LOGIN BODY:", body)
      console.log("PRISMA USER:", (prisma as any).user)

      if (!(prisma as any).user) {
        throw new Error("Prisma client missing 'user'")
      }

      const { email, password } = body

      if (!email || !password) {
        return reply.status(400).send({
          error: "Email and password required"
        })
      }

      const user = await prisma.user.findUnique({
        where: { email }
      })

      if (!user || user.password !== password) {
        return reply.status(401).send({
          error: "Invalid credentials"
        })
      }

      const token = jwt.sign(
        { id: user.id },
        "secret",
        { expiresIn: "1d" }
      )

      return {
        accessToken: token
      }

    } catch (err: any) {
      console.error("LOGIN ERROR:", err)
      return reply.status(500).send({
        error: err.message
      })
    }
  }

  // -----------------------------
  // LOGOUT
  // -----------------------------
  static async logout() {
    return { success: true }
  }
}
