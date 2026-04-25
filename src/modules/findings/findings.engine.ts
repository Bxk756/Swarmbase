import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export class FindingsEngine {

  static async generate(scanId: string) {

    const scan = await prisma.scan.findUnique({
      where: { id: scanId },
      include: { results: true }
    })

    if (!scan) return

    const findings: any[] = []

    for (const result of scan.results) {

      // ================= HTTP =================
      if (result.type === "http") {

        const headers = result.data.headers || {}

        if (!headers["strict-transport-security"]) {
          findings.push({
            category: "http",
            title: "Missing HTTPS protection (HSTS)",
            description: "Your site does not enforce HTTPS connections.",
            severity: "medium",
            weight: 6,
            exposure: 1.2,
            mitigation: 0,
            confidence: "high",
            impact: "privacy",
            evidence: result.data
          })
        }

        if (!headers["content-security-policy"]) {
          findings.push({
            category: "http",
            title: "Missing Content Security Policy",
            description: "Increases risk of XSS attacks.",
            severity: "medium",
            weight: 6,
            exposure: 1.1,
            mitigation: 0,
            confidence: "high",
            impact: "takeover",
            evidence: result.data
          })
        }
      }

      // ================= PORTS =================
      if (result.type === "ports") {

        const ports = result.data.openPorts || []

        if (ports.includes(3389)) {
          findings.push({
            category: "ports",
            title: "Remote Desktop exposed",
            description: "RDP is publicly accessible.",
            severity: "high",
            weight: 9,
            exposure: 1.4,
            mitigation: 0,
            confidence: "high",
            impact: "takeover",
            evidence: ports
          })
        }

        if (ports.includes(22)) {
          findings.push({
            category: "ports",
            title: "SSH exposed",
            description: "SSH accessible from internet.",
            severity: "medium",
            weight: 6,
            exposure: 1.2,
            mitigation: 0,
            confidence: "high",
            impact: "exposure",
            evidence: ports
          })
        }
      }
    }

    // SAVE
    for (const f of findings) {
      await prisma.finding.create({
        data: {
          scanId: scan.id,
          targetId: scan.targetId,
          userId: scan.userId,
          ...f
        }
      })
    }
  }
}
