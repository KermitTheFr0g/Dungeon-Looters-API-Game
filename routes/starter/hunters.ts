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

    
    // todo
    // check if hunter is valid and is starter hunter


})

module.exports = starterHunterRouter;