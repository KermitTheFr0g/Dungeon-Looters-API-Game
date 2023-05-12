import express, { Request, Response } from 'express';
const starterHunterRouter = express.Router();

import prisma from '../../prisma/prisma';
import verifyToken from '../../middleware/verifyToken';

const userModels = require('../../models/user.ts');

starterHunterRouter.use(verifyToken);

// * returns back to the user if they're applicable for a starter hunter
starterHunterRouter.get('/check-applicable', async (req: Request, res: Response) => {
    const apiToken = req.query.token

    const applicable = await userModels.applicableStarterHunter(apiToken as string);

    if(!applicable){
        return res.status(400).json({
            message: 'User already has starter hunter'
        })
    }

    return res.json({
        starterHunterApplicable: applicable
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

//! read through this function again
// * user selects the starter hunter
starterHunterRouter.post('/select-hunter', async (req: Request, res: Response) => {
    const hunterName = req.body.hunterName;

    // * check if user is applicable for starter hunter
    const applicable = await userModels.applicableStarterHunter(req.query.token as string);
    if(!applicable){
        return res.status(400).json({
            message: 'User already has starter hunter'
        })
    }


    // * check if hunter is valid and is starter hunter
    const getHunter = await prisma.hunter.findFirst({
        where: {
            name: hunterName as string,
            starter: true
        }
    })

    if(!getHunter){
        return res.status(400).json({
            message: 'Invalid starter hunter',
            tip: 'Make sure you are selecting a starter hunter / hunter exists using /starter/hunter/get-hunters'
        })
    }


    //todo add new hunter to user
    await prisma.userHunters.create({
        data: {
            user: {
                connect: {
                    api_token: req.query.token as string
                }
            },
            hunter: { 
                connect: {
                    name: hunterName as string
                }
            }
        }
    })


    // * returns back to user
    return res.json({
        success: true,
        message: 'Starter hunter selected successfully!',
        hunterName: hunterName
    })
})

module.exports = starterHunterRouter;