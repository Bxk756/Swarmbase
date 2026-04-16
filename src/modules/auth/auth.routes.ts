import { FastifyInstance } from "fastify"
import { AuthController } from "./auth.controller"

export default async function authRoutes(app: FastifyInstance) {

  app.post("/register", AuthController.register)

  app.post("/login", AuthController.login)

  app.post("/refresh", AuthController.refresh)

  app.post("/logout", AuthController.logout)

}
