import { prisma } from "../../lib/prisma"

console.log("🔥 RISK SERVICE LOADED")

// =========================================
// SEVERITY SCORE
// =========================================

function severityToScore(severity: string) {

  switch (severity) {

    case "critical":
      return 40

    case "high":
      return 25

    case "medium":
      return 12

    case "low":
      return 5

    default:
      return 1

  }

}

// =========================================
// LETTER GRADE
// =========================================

function grade(score: number) {

  if (score < 15) return "A"

  if (score < 30) return "B"

  if (score < 50) return "C"

  if (score < 70) return "D"

  return "F"

}

// =========================================
// HELPERS
// =========================================

function normalizeNumber(v: any, fallback: number) {

  return typeof v === "number" && v > 0
    ? v
    : fallback

}

function normalizeTitle(title: any) {

  if (!title || typeof title !== "string") {
    return ""
  }

  return title.trim().toLowerCase()

}

function safeFindings(input: any[]): any[] {

  if (!Array.isArray(input)) {
    return []
  }

  return input.filter(f =>
    f &&
    typeof f === "object" &&
    typeof f.title === "string" &&
    typeof f.severity === "string"
  )

}

// =========================================
// CALCULATE RISK
// =========================================

function calculate(findings: any[]) {

  let score = 0

  const safe = safeFindings(findings)

  const enriched = safe.map(f => {

    const base = severityToScore(f.severity)

    const exposure = normalizeNumber(
      f.exposure,
      1
    )

    const mitigation = normalizeNumber(
      f.mitigation,
      1
    )

    const impact = Math.round(
      base *
      exposure *
      mitigation
    )

    return {

      title: f.title,

      severity: f.severity,

      impact

    }

  })

  for (const f of enriched) {

    score += f.impact

  }

  score = Math.min(
    100,
    Math.round(score)
  )

  return {

    score,

    grade: grade(score),

    enriched

  }

}

// =========================================
// RISK SERVICE
// =========================================

export class RiskService {

  // =========================================
  // CURRENT RISK
  // =========================================

  static async calculateRisk(
    targetId: string,
    userId: string
  ) {

    console.log("📊 calculateRisk HIT")

    const findings = await prisma.finding.findMany({

      where: {

        targetId,

        userId,

        status: "open"

      },

      select: {

        title: true,

        severity: true,

        exposure: true,

        mitigation: true

      }

    })

    const result = calculate(findings)

    return {

      score: result.score,

      grade: result.grade,

      findings: result.enriched.length

    }

  }

  // =========================================
  // SIMULATION
  // =========================================

  static async simulate(
    targetId: string,
    userId: string,
    excludeTitles: string[]
  ) {

    console.log("🧠 simulate HIT")

    const findings = await prisma.finding.findMany({

      where: {

        targetId,

        userId,

        status: "open"

      },

      select: {

        title: true,

        severity: true,

        exposure: true,

        mitigation: true

      }

    })

    const current = calculate(findings)

    const excludes = (
      excludeTitles || []
    ).map(normalizeTitle)

    const filtered = safeFindings(findings)
      .filter(f =>
        !excludes.includes(
          normalizeTitle(f.title)
        )
      )

    const next = calculate(filtered)

    return {

      currentScore: current.score,

      newScore: next.score,

      improvement:
        next.score - current.score

    }

  }

  // =========================================
  // DASHBOARD INTELLIGENCE
  // =========================================

  static async getDashboardIntelligence(
    userId: string
  ) {

    console.log("🛡️ dashboard intelligence HIT")

    // OPEN FINDINGS

    const openFindings =
      await prisma.finding.count({

        where: {
          userId,
          status: "open"
        }

      })

    // RESOLVED FINDINGS

    const resolvedFindings =
      await prisma.finding.count({

        where: {
          userId,
          status: "resolved"
        }

      })

    // HIGH

    const high =
      await prisma.finding.count({

        where: {

          userId,

          severity: "high",

          status: "open"

        }

      })

    // MEDIUM

    const medium =
      await prisma.finding.count({

        where: {

          userId,

          severity: "medium",

          status: "open"

        }

      })

    // LOW

    const low =
      await prisma.finding.count({

        where: {

          userId,

          severity: "low",

          status: "open"

        }

      })

    // TARGETS

    const targets =
      await prisma.target.count({

        where: { userId }

      })

    // SCANS

    const scans =
      await prisma.scan.count({

        where: { userId }

      })

    // RECENT FINDINGS

    const recentFindings =
      await prisma.finding.findMany({

        where: { userId },

        orderBy: {
          createdAt: "desc"
        },

        take: 5

      })

    // RISK SCORE

    const findings =
      await prisma.finding.findMany({

        where: {

          userId,

          status: "open"

        },

        select: {

          title: true,

          severity: true,

          exposure: true,

          mitigation: true

        }

      })

    const risk = calculate(findings)

    return {

      riskScore: risk.score,

      grade: risk.grade,

      openFindings,

      resolvedFindings,

      targets,

      scans,

      severityBreakdown: {

        high,

        medium,

        low

      },

      recentFindings

    }

  }

}
