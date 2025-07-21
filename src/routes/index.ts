import { Router } from "express"
import { usersRouter } from "./user-routes"
import { sessionsRoutes } from "./sessions-routes"
import { refundsRoutes } from "./refunds-routes"
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { uploadsRoutes } from "./uploads-routes"

const routes = Router()

//rotas publicas
routes.use("/users",usersRouter)
routes.use("/sessions",sessionsRoutes)

//rotas publicas
routes.use(ensureAuthenticated)
routes.use("/refunds", refundsRoutes)
routes.use("/uploads", uploadsRoutes)

export { routes }