import express, { Request, Response } from 'express';
const starterHunterRouter = express.Router();

import prisma from '../../prisma/prisma';
import verifyToken from '../../middleware/verifyToken';

starterHunterRouter.use(verifyToken);

starterHunterRouter.get('/check', async (req: Request, res: Response) => {
    const apiToken = req.query.token

    const getUser = await prisma.user.findFirst({
        where: {
            api_token: apiToken as string
        },
        include: {
            hunters: true,
        }
    })

    return res.json({
        success: true,
        user: getUser
    })
})

module.exports = starterHunterRouter;