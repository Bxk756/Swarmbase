import { FastifyReply, FastifyRequest } from "fastify"
import { prisma } from "../../lib/prisma"

export class DashboardController {

  static async intelligence(
    request: FastifyRequest,
    reply: FastifyReply
  ) {

    try {

      const user = (request as any).user

      const openFindings = await prisma.finding.count({
        where: {
          userId: user.id,
          status: "open"
        }
      })

      const resolvedFindings = await prisma.finding.count({
        where: {
          userId: user.id,
          status: "resolved"
        }
      })

      const protectedTargets = await prisma.target.count({
        where: {
          userId: user.id
        }
      })

      const findings = await prisma.finding.findMany({
        where: {
          userId: user.id,
          status: "open"
        }
      })

      let riskScore = 100

      findings.forEach(f => {

        switch (f.severity) {

          case "critical":
            riskScore -= 25
            break

          case "high":
            riskScore -= 15
            break

          case "medium":
            riskScore -= 8
            break

          case "low":
            riskScore -= 3
            break
        }

      })

      if (riskScore < 0) riskScore = 0

      const severity = {
        critical: findings.filter(f => f.severity === "critical").length,
        high: findings.filter(f => f.severity === "high").length,
        medium: findings.filter(f => f.severity === "medium").length,
        low: findings.filter(f => f.severity === "low").length
      }

      const recentFindings = await prisma.finding.findMany({
        where: {
          userId: user.id
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 10,
        select: {
          title: true,
          severity: true,
          status: true,
          createdAt: true
        }
      })

      return reply.send({
        riskScore,
        openFindings,
        resolvedFindings,
        protectedTargets,
        severity,
        recentFindings
      })

    } catch (err: any) {

      console.error(err)

      return reply.status(500).send({
        error: err.message
      })

    }
  }
}
