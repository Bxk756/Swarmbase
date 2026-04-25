import { FastifyInstance } from "fastify"
import { ScanController } from "./scan.controller"
import { authMiddleware } from "../../middleware/auth.middleware"

export async function scanRoutes(app: FastifyInstance) {

  // Start scan
  app.post(
    "/scan/start",
    { preHandler: [authMiddleware] },
    ScanController.start
  )

  // Get results
  app.get(
    "/scan/results/:scanId",
    { preHandler: [authMiddleware] },
    ScanController.results
  )

}
