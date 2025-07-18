import { Request, Response, NextFunction } from "express"
import { z } from "zod"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"

const CategoriesEnum = z.enum(["food", "others", "services", "transport", "accommodation"])

class RefundsController {
    async create(request: Request, response: Response, next: NextFunction) {
        const bodySchame = z.object({
            name: z.string().trim().min(1, { message: "informe o nome da solicitacao" }),
            category: CategoriesEnum,
            amount: z.number().positive({ message: "o valor precisa ser positivo" }),
            filename: z.string().min(20)
        })

        const { name, category, amount, filename, } = bodySchame.parse(request.body)

        if (!request.user?.id) {
            throw new AppError("Unauthorized", 401)
        }

        const refund = await prisma.refunds.create({
            data: {
                name,
                category,
                amount,
                filename,
                userId: request.user.id,
            }
        })

        return response.status(201).json({ refund })
    }
    async index(request: Request, response: Response, next: NextFunction) {
        const querySchema = z.object({
            name: z.string().optional().default(""),
            page: z.coerce.number().optional().default(1),
            perPage: z.coerce.number().optional().default(10)
        })

        const { name, page, perPage } = querySchema.parse(request.query)

        //calcular os valores de skip
        const skip = (page - 1) * perPage

        const refunds = await prisma.refunds.findMany({
            skip,
            take: perPage,
            where: {
                user: {
                    name: {
                        contains: name.trim()
                    }
                }
            },
            include: {
                user: true
            },
            orderBy: {
                createdAt: "asc"
            }
        })

        const totalReacords = await prisma.refunds.count({
            where: {
                user: {
                    name: {
                        contains: name.trim()
                    }
                }
            },
        })

        const totalPages = Math.ceil(totalReacords/perPage)

        response.json({
            refunds,
            pagination:{
                page,
                perPage,
                totalReacords,
                totalPages : totalPages > 0 ? totalPages: 1,

            }
        })

        response.json({ refunds })
    }
    async show(request: Request, response: Response, next: NextFunction) {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = paramsSchema.parse(request.params)

        const refaund = await prisma.refunds.findFirst({
            where:{id},
            include:{ user:true}
        })

        response.json(refaund)
    }
}
export { RefundsController }