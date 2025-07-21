import "express-async-errors"
import express from "express";
import cors from "cors"
import { ErrorHandling } from "./middlewares/error-handling";
import { AppError } from "./utils/AppError";
import { routes } from "./routes";
import uploadConfig from "@/configs/upload"

const app = express()

app.use(express.json())
app.use(cors())

app.use("/uploads", express.static(uploadConfig.UPLOADS_FOLDER))

app.use(routes)

app.use(ErrorHandling)

export { app }