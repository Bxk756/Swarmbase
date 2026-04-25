import { PrismaClient } from "@prisma/client"
import { FindingsEngine } from "../findings/findings.engine"

const prisma = new PrismaClient()

export class ScanService {

  static async createScan(userId: string, targetId: string) {

    const target = await prisma.target.findFirst({
      where: { id: targetId, userId }
    })

    if (!target) {
      throw new Error("Target not found")
    }

    return prisma.scan.create({
      data: {
        userId,
        targetId,
        status: "pending"
      }
    })
  }

  static async runScan(scanId: string) {

    setTimeout(async () => {

      await prisma.scan.update({
        where: { id: scanId },
        data: { status: "running" }
      })

      // fake HTTP
      await prisma.scanResult.create({
        data: {
          scanId,
          type: "http",
          data: {
            status: 200,
            headers: {}
          }
        }
      })

      // fake ports
      await prisma.scanResult.create({
        data: {
          scanId,
          type: "ports",
          data: {
            openPorts: [80, 22, 3389]
          }
        }
      })

      await prisma.scan.update({
        where: { id: scanId },
        data: { status: "completed" }
      })

      // 🔥 generate findings
      await FindingsEngine.generate(scanId)

    }, 2000)
  }

  static async getResults(scanId: string) {
    return prisma.scanResult.findMany({
      where: { scanId }
    })
  }
}
