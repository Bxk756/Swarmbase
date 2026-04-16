import { FastifyInstance } from "fastify"
import { TargetsController } from "./targets.controller"
import { authMiddleware } from "../../middleware/auth"

export async function targetsRoutes(app: FastifyInstance) {
  app.post(
    "/targets",
    { preHandler: authMiddleware },
    TargetsController.create
  )
}
