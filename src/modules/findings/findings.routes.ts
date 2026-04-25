import { FastifyInstance } from "fastify"
import { PrismaClient } from "@prisma/client"
import { authMiddleware } from "../../middleware/auth.middleware"

const prisma = new PrismaClient()

export async function findingsRoutes(app: FastifyInstance) {

  app.get(
    "/scan/findings/:scanId",
    { preHandler: [authMiddleware] },
    async (request: any) => {

      const { scanId } = request.params

      return prisma.finding.findMany({
        where: {
          scanId,
          userId: request.user.id
        }
      })
    }
  )
}
