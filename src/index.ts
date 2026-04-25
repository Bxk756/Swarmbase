import Fastify from "fastify"
import cookie from "@fastify/cookie"
import path from "path"
import fastifyStatic from "@fastify/static"

import { targetsRoutes } from "./modules/targets/targets.routes"
import { scanRoutes } from "./modules/scan/scan.routes"
import { findingsRoutes } from "./modules/findings/findings.routes"
import { riskRoutes } from "./modules/risk/risk.routes"
import { AuthController } from "./modules/auth/auth.controller"

const app = Fastify({
  logger: true
})

// ------------------
// STATIC FILES
// ------------------

app.register(fastifyStatic, {
  root: path.join(__dirname, "../public"),
  prefix: "/", // important
})

// ------------------
// PAGE ROUTES (CLEAN URLS)
// ------------------

app.get("/", async (req, reply) => {
  return reply.sendFile("index.html")
})

app.get("/login", async (req, reply) => {
  return reply.sendFile("login.html")
})

app.get("/dashboard", async (req, reply) => {
  return reply.sendFile("dashboard.html")
})

// ------------------
// AUTH
// ------------------

app.post("/auth/register", AuthController.register)
app.post("/auth/login", AuthController.login)
app.post("/auth/logout", AuthController.logout)

// ------------------
// API ROUTES
// ------------------

app.register(targetsRoutes)
app.register(scanRoutes)
app.register(findingsRoutes)
app.register(riskRoutes)

// ------------------
// START SERVER
// ------------------

const start = async () => {
  try {
    await app.listen({ port: 3000, host: "0.0.0.0" })
    console.log("🚀 Server running on http://localhost:3000")
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
