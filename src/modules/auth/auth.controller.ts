import { FastifyRequest, FastifyReply } from "fastify"
import { AuthService } from "./auth.service"

export class AuthController {
  static async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { email, password, name } = request.body as any

      const user = await AuthService.register(email, password, name)

      return reply.status(201).send(user)
    } catch (err: any) {
      return reply.status(400).send({ error: err.message })
    }
  }

  static async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { email, password } = request.body as any

      const data = await AuthService.login(email, password)

      reply.setCookie("refreshToken", data.refreshToken, {
        httpOnly: true,
        secure: true, // ⚠️ set false if testing locally without HTTPS
        sameSite: "strict",
        path: "/"
      })

      return reply.send({
        user: data.user,
        accessToken: data.accessToken
      })
    } catch (err: any) {
      return reply.status(401).send({ error: err.message })
    }
  }

  static async logout(request: FastifyRequest, reply: FastifyReply) {
    const refreshToken = (request.cookies as any).refreshToken

    if (refreshToken) {
      await AuthService.logout(refreshToken)
    }

    reply.clearCookie("refreshToken", { path: "/" })

    return reply.send({ message: "Logged out successfully" })
  }
}
