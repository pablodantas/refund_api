import { Request, Response } from "express";
import z, { ZodError } from "zod";

import uploadConfig from "@/configs/upload"
import { DiskStorage } from "@/providers/disk-storage";
import { AppError } from "@/utils/AppError";

const diskStorage = new DiskStorage()


class UploadsController {

    async create(request: Request, response: Response) {
        try {
            const fileSchema = z.object({
                filename: z.string().min(1, "Arquivo é obrigatório"),
                mimetype: z.string().refine((type) => uploadConfig.ACCEPTED_IMAGE_TYPES.includes(type), "Formato de arquivo inválido"),
                size: z.number().positive().refine((size) => size <= uploadConfig.MAX_FILE_SIZE, "tamanho do arquivo excede o tamanho maximo de 3mb"),
            }).passthrough()

            const file = fileSchema.parse(request.file)

            const filename = await diskStorage.saveFile(file.filename)

            response.json({ filename })
        } catch (error) {
            if (error instanceof ZodError) {
                if (request.file) {
                    await diskStorage.deleteFile(request.file.filename, "tmp")
                }
                throw new AppError(error.issues[0].message)
            }
            throw error
        }

    }
}
export { UploadsController }