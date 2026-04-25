import Fastify from "fastify"
import cookie from "@fastify/cookie"
import path from "path"
import fastifyStatic from "@fastify/static"

import { targetsRoutes } from "./modules/targets/targets.routes"
import { scanRoutes } from "./modules/scan/scan.routes"
import { findingsRoutes } from "./modules/findings/findings.routes"
import { riskRoutes } from "./modules/risk/risk.routes"
import { AuthController } from "./modules/auth/auth.controller"

const app = Fastify({ logger: true })

// SERVE PUBLIC FILES
app.register(fastifyStatic, {
  root: path.join(__dirname, "../public"),
})

// AUTH
app.post("/auth/register", AuthController.register)
app.post("/auth/login", AuthController.login)

// ROUTES
app.register(targetsRoutes)
app.register(scanRoutes)
app.register(findingsRoutes)
app.register(riskRoutes)

// START
app.listen({ port: 3000, host: "0.0.0.0" })
