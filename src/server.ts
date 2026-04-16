import Fastify from "fastify"
import cors from "@fastify/cors"
import cookie from "@fastify/cookie"
import dotenv from "dotenv"
import targetsRoutes from "./modules/targets/targets.routes"
import authRoutes from "./modules/auth/auth.routes"

dotenv.config()

const app = Fastify({
  logger: true
})

async function start() {

  await app.register(cors, {
    origin: true,
    credentials: true
  })
  await app.register(targetsRoutes)
  await app.register(cookie)

  await app.register(authRoutes, {
    prefix: "/auth"
  })

  const port = 3000

  try {
    await app.listen({ port, host: "0.0.0.0" })
    console.log(`Server running on http://localhost:${port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }

}

start()
