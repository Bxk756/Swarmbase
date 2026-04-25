import { FastifyInstance } from "fastify"
import { RiskController } from "./risk.controller"
import { authMiddleware } from "../../middleware/auth.middleware"

export async function riskRoutes(app: FastifyInstance) {
  console.log("✅ RISK ROUTES REGISTERED")

  app.get(
    "/targets/:targetId/risk",
    { preHandler: [authMiddleware] },
    RiskController.getRisk
  )

  app.post(
    "/targets/:targetId/risk/simulate",
    { preHandler: [authMiddleware] },
    RiskController.simulate
  )
}
