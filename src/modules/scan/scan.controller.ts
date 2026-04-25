import { FastifyRequest, FastifyReply } from "fastify"
import { ScanService } from "./scan.service"

export class ScanController {

  static async start(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (request as any).user
      const { targetId } = request.body as any

      const scan = await ScanService.createScan(user.id, targetId)

      // async run
      ScanService.runScan(scan.id)

      return reply.send({
        message: "Scan started",
        scanId: scan.id
      })

    } catch (err: any) {
      return reply.status(400).send({ error: err.message })
    }
  }

  static async results(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { scanId } = request.params as any

      const results = await ScanService.getResults(scanId)

      return reply.send(results)

    } catch (err: any) {
      return reply.status(400).send({ error: err.message })
    }
  }
}
