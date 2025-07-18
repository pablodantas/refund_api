import { Router } from "express"
import { RefundsController } from "@/controllers/refunds-controller"
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization"

const refundsRoutes = Router()
const refundsController = new RefundsController()

refundsRoutes.get("/",verifyUserAuthorization(["maneger","employee"]), refundsController.index)
refundsRoutes.get("/:id",verifyUserAuthorization(["maneger","employee"]), refundsController.show)
refundsRoutes.post("/",verifyUserAuthorization(["employee"]), refundsController.create)

export { refundsRoutes }