import { prisma } from "../../lib/prisma"

console.log("🔥 RISK SERVICE LOADED")

function severityToScore(severity: string) {
  switch (severity) {
    case "critical": return 40
    case "high": return 25
    case "medium": return 12
    case "low": return 5
    default: return 1
  }
}

function grade(score: number) {
  if (score < 15) return "A"
  if (score < 30) return "B"
  if (score < 50) return "C"
  if (score < 70) return "D"
  return "F"
}

function normalizeNumber(v: any, fallback: number) {
  return typeof v === "number" && v > 0 ? v : fallback
}

function normalizeTitle(title: any) {
  if (!title || typeof title !== "string") return ""
  return title.trim().toLowerCase()
}

function safeFindings(input: any[]): any[] {
  if (!Array.isArray(input)) return []

  return input.filter(f =>
    f &&
    typeof f === "object" &&
    typeof f.title === "string" &&
    typeof f.severity === "string"
  )
}

function calculate(findings: any[]) {
  let score = 0

  const safe = safeFindings(findings)

  const enriched = safe.map(f => {
    const base = severityToScore(f.severity)
    const exposure = normalizeNumber(f.exposure, 1)
    const mitigation = normalizeNumber(f.mitigation, 1)

    const impact = Math.round(base * exposure * mitigation)

    return {
      title: f.title,
      severity: f.severity,
      impact
    }
  })

  for (const f of enriched) {
    score += f.impact
  }

  score = Math.min(100, Math.round(score))

  return {
    score,
    grade: grade(score),
    enriched
  }
}

export class RiskService {

  static async calculateRisk(targetId: string, userId: string) {
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

    const excludes = (excludeTitles || []).map(normalizeTitle)

    const filtered = safeFindings(findings).filter(f =>
      !excludes.includes(normalizeTitle(f.title))
    )

    const next = calculate(filtered)

    return {
      currentScore: current.score,
      newScore: next.score,
      improvement: next.score - current.score
    }
  }
}
