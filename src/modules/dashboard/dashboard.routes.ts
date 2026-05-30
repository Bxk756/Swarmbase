import { FastifyInstance } from "fastify"
import { DashboardController } from "./dashboard.controller"
import { authMiddleware } from "../../middleware/auth.middleware"

export async function dashboardRoutes(
  app: FastifyInstance
) {

  app.get(
    "/dashboard/intelligence",
    {
      preHandler: [authMiddleware]
    },
    DashboardController.intelligence
  )

}
