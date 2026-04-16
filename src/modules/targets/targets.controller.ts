import { FastifyRequest, FastifyReply } from "fastify"
import prisma from "../../lib/prisma"

export class TargetsController {
  static async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { domain } = request.body as any

      // ✅ Validate domain
      const domainRegex =
        /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/

      if (!domain || !domainRegex.test(domain)) {
        return reply.status(400).send({ error: "Invalid domain" })
      }

      // ✅ Normalize
      const normalizedDomain = domain
        .toLowerCase()
        .replace(/^https?:\/\//, "")
        .replace(/\/$/, "")

      const userId = request.user.id

      // ✅ Prevent duplicates
      const existing = await prisma.target.findFirst({
        where: {
          domain: normalizedDomain,
          userId
        }
      })

      if (existing) {
        return reply.status(400).send({
          error: "Target already exists"
        })
      }

      const target = await prisma.target.create({
        data: {
          domain: normalizedDomain,
          userId
        }
      })

      return reply.send(target)
    } catch (err: any) {
      return reply.status(500).send({
        error: err.message
      })
    }
  }
}
