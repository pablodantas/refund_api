import { UserRole } from "@prisma/client"
import { prisma } from "@/database/prisma"
import { Request, Response, NextFunction } from "express"
import { z } from "zod"
import { AppError } from "@/utils/AppError"
import { hash } from "bcrypt"


class UsersController{
    async create(request: Request,response:Response, next:NextFunction){
        const bodySchame = z.object({
            name: z.string().trim().min(2, {message: "Nome é obrigatório"}),
            email:z.string().trim().email({message:"email invalido"}),
            password:z.string().min(6, {message:"A senha não pode conter menos que 6 caracteres"}),
            role:z.enum([UserRole.employee, UserRole.manager]).default(UserRole.employee)
        })

        const { name, email, password, role } = bodySchame.parse(request.body)

        const userWithSameEmail = await prisma.user.findFirst({ where: { email } })

        if(userWithSameEmail){
            throw new AppError("Ja existe um usuario com esse email cadastrado")
        }

        const hashedPassword = await hash(password,8)

        await prisma.user.create({
            data:{
                name,
                email,
                password: hashedPassword,
                role,
            }
        })

        return response.status(201).json()
    }
}
export { UsersController }