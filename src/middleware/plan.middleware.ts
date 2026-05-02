import { FastifyRequest, FastifyReply } from "fastify"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const PLAN_LIMITS: any = {
  pro: { domains: 5 },
  business: { domains: 20 },
  enterprise: { domains: Infinity }
}

export async function enforcePlanLimit(request: FastifyRequest, reply: FastifyReply) {
  const { userId } = request.body as any

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { targets: true }
  })

  if (!user) {
    return reply.status(401).send({ error: "User not found" })
  }

  const limit = PLAN_LIMITS[user.plan]

  if (user.targets.length >= limit.domains) {
    return reply.status(403).send({
      error: "Plan limit reached. Upgrade your plan."
    })
  }
}
