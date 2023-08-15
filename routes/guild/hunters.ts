import express, { Request, Response } from 'express';
const hunterGuildRouter = express.Router();

import prisma from '../../prisma/prisma';
import verifyTokenIncluded from '../../middleware/verifyToken';

hunterGuildRouter.use(verifyTokenIncluded);

// get all of the user's owned hunters
hunterGuildRouter.get('/all', async (req: Request, res: Response) => {
    const apiToken = req.query.token;

    const allUserHunters = await prisma.userHunters.findMany({
        where: {
            user: {
                api_token: apiToken as string,
            }
        },
        select: {
            onMission: true,
            level: true,
            experience: true,
            hunter: {
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
            }
        }
    });

    if(!allUserHunters){
        return res.status(400).send({
            message: 'No hunters owned',
        })
    }

    return res.send({
        hunters: allUserHunters,
    })

})


// details for specific user hunter
hunterGuildRouter.get('/search', async (req: Request, res:Response) => {
    const apiToken = req.query.token;
    const hunterName = req.query.q;

    const hunterDetails = prisma.userHunters.findFirst({
        where: {
            user: {
                api_token: apiToken as string,
            },
            hunter: {
                name: hunterName as string, 
            }
        },
        select: {
            onMission: true,
            level: true,
            experience: true,
            hunter: {
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
            }
        }
    })

    if(!hunterDetails){
        return res.status(400).send({
            message: 'No hunter found',   
        })
    }   

    return res.send({
        hunter: hunterDetails,
    })
})


// retire a user's hunter
hunterGuildRouter.post('/retire', async (req: Request, res: Response) => {
    const apiToken = req.query.token;

    // retire hunter, a retired at column needs to be added into the db
    
    return res.send({
        message: 'Hunter has been retired'
    })
})

module.exports = hunterGuildRouter;