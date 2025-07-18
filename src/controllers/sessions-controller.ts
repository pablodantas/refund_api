import { Request, Response, NextFunction } from "express"
import { z } from "zod"
import { compare } from "bcrypt"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { authConfig } from "@/configs/auth"
import { sign } from "jsonwebtoken"

class SessionsController {
    async create(request: Request, response: Response, next: NextFunction) {
        const bodySchame = z.object({
            email: z.string().trim().email({ message: "email invalido" }),
            password: z.string()
        })

        const { email, password } = bodySchame.parse(request.body)

        const user = await prisma.user.findFirst({ where: {email} })

        if(!user){
            throw new AppError("Email ou senha invalida", 401)
        }

        const passwordMatched = await compare(password, user.password)

        if(!passwordMatched){
            throw new AppError("Email ou senha invalida", 401)
        }

        const { secret, expiresIn } = authConfig.jwt

        const token = sign({role: user.role}, secret,{ subject: user.id, expiresIn})

        const { password:_, ...userWi } = user

        return response.status(201).json({token, userWi})
    }

}
export { SessionsController }