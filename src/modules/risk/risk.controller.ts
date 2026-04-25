import { FastifyReply, FastifyRequest } from "fastify"
import { RiskService } from "../../modules/risk/risk.service"

console.log("✅ RISK CONTROLLER LOADED")

export class RiskController {

  static async getRisk(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { targetId } = request.params as any
      const user = (request as any).user

      const result = await RiskService.calculateRisk(
        targetId,
        user.id
      )

      return reply.send(result)
    } catch (err: any) {
      console.error("Risk error:", err)
      return reply.status(500).send({ error: err.message })
    }
  }

  static async simulate(request: FastifyRequest, reply: FastifyReply) {
    try {
      console.log("🔥 SIMULATE ENDPOINT HIT")

      const { targetId } = request.params as any
      const user = (request as any).user
      const body = request.body as any || {}

      const excludeTitles = Array.isArray(body.excludeTitles)
        ? body.excludeTitles
        : []

      const result = await RiskService.simulate(
        targetId,
        user.id,
        excludeTitles
      )

      return reply.send(result)
    } catch (err: any) {
      console.error("Simulation error:", err)
      return reply.status(500).send({ error: err.message })
    }
  }
}
