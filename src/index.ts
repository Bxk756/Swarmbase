import Fastify from "fastify"
import cookie from "@fastify/cookie"
import { targetsRoutes } from "./modules/targets/targets.routes"
import { AuthController } from "./modules/auth/auth.controller"

const app = Fastify()

app.register(cookie)

// Auth
app.post("/auth/register", AuthController.register)
app.post("/auth/login", AuthController.login)
app.post("/auth/logout", AuthController.logout)

// Targets
app.register(targetsRoutes)

app.listen({ port: 3000 }, () => {
  console.log("Server running on http://localhost:3000")
})
