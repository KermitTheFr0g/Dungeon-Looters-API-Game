import express, { Request, Response } from 'express';
const starterHunterRouter = express.Router();

import prisma from '../../prisma/prisma';
import verifyToken from '../../middleware/verifyToken';

starterHunterRouter.use(verifyToken);

// * returns back to the user if they're applicable for a starter hunter
starterHunterRouter.get('/check-applicable', async (req: Request, res: Response) => {
    const apiToken = req.query.token

    const getUser = await prisma.user.findFirst({
        where: {
            api_token: apiToken as string
        },
        include: {
            hunters: true,
        }
    })

    const userHunters = getUser?.hunters;

    // * check if user already has a hunter
    if(userHunters?.length !== 0){
        return res.status(400).json({
            message: 'User already has starter hunter'                           
        })
    }

    return res.json({
        starterHunterApplicable: true
    })
});

// * returns back to user the starter hunters
starterHunterRouter.get('/get-hunters', async (req: Request, res: Response) => {
    // * get starter hunters
    const getHunters = await prisma.hunter.findMany({
        where: {
            starter: true
        },
        select: {
            name: true,
            description: true,
            image: true,
            health: true,
            attack: true,
            defense: true,
            speed: true,
            overallLevel: true,
        }
    })

    return res.json({
        starterHunters: getHunters
    })
});

module.exports = starterHunterRouter;