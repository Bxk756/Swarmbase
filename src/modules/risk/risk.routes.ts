import { FastifyInstance } from "fastify"

import { RiskController } from "./risk.controller"

import { authMiddleware } from "../../middleware/auth.middleware"

export async function riskRoutes(app: FastifyInstance) {

  console.log("✅ RISK ROUTES REGISTERED")

  // =========================================
  // TARGET RISK
  // =========================================

  app.get(

    "/targets/:targetId/risk",

    {
      preHandler: [authMiddleware]
    },

    RiskController.getRisk

  )

  // =========================================
  // RISK SIMULATION
  // =========================================

  app.post(

    "/targets/:targetId/risk/simulate",

    {
      preHandler: [authMiddleware]
    },

    RiskController.simulate

  )

  // =========================================
  // DASHBOARD INTELLIGENCE
  // =========================================

  app.get(

    "/risk/intelligence",

    {
      preHandler: [authMiddleware]
    },

    RiskController.intelligence

  )

}
