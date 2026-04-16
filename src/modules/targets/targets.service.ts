import { prisma } from "../../lib/prisma"

export class TargetsService {

  static async createTarget(userId: string, domain: string) {

    const target = await prisma.target.create({
      data: {
        domain,
        userId
      }
    })

    return target

  }

  static async getTargets(userId: string) {

    const targets = await prisma.target.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return targets

  }

}
