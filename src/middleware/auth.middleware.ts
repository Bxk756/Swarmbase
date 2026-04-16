import { FastifyReply, FastifyRequest } from "fastify"
import jwt from "jsonwebtoken"

const ACCESS_SECRET = process.env.JWT_SECRET!

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {

  try {

    const authHeader = request.headers.authorization

    if (!authHeader) {
      return reply.status(401).send({ error: "No token provided" })
    }

    const token = authHeader.split(" ")[1]

    const payload = jwt.verify(token, ACCESS_SECRET) as any

    ;(request as any).user = {
      id: payload.userId
    }

  } catch (err) {
    return reply.status(401).send({ error: "Invalid token" })
  }

}
