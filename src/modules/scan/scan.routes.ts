import { FastifyInstance } from "fastify"
import { ScanController } from "./scan.controller"
import { authMiddleware } from "../../middleware/auth.middleware"

export async function scanRoutes(app: FastifyInstance) {

  app.post(
    "/scan/start",
    { preHandler: [authMiddleware] },
    ScanController.start
  )

  app.get(
    "/scan/results/:scanId",
    { preHandler: [authMiddleware] },
    ScanController.results
  )
}
