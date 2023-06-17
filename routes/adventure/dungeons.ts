import express, { Request, Response, NextFunction } from 'express';
const adventureDungeonRouter = express.Router();

import prisma from '../../prisma/prisma';
import updateAdventures from '../../models/adventure';
import verifyToken from '../../middleware/verifyToken';


adventureDungeonRouter.use(verifyToken);

// * returns back to the user all of the active active dungeon adventures
adventureDungeonRouter.get('/active', async (req: Request, res: Response) => {
    const apiToken = req.query.token;

    // * get all of the user's active dungeon adventures
    let activeDungeonAdventures = await prisma.adventure.findMany({
        where: {
            user: {
                api_token: apiToken as string
            },
            debriefed: false,
        },
        select: {
            id: true,
            dungeon: {
                select: {
                    name: true,
                    level: true
                }
            },
            hunter: {
                select: {
                    hunter: {
                        select: {
                            name: true, 
                            health: true,
                            attack: true,
                            defense: true,
                            speed: true,
                            overallLevel: true,
                        }
                    }
                }
            },
            completingAt: true,
            complete: true,
        }
    });

    if(activeDungeonAdventures.length === 0){
        return res.json({
            message: 'No active dungeon adventures!',
            tip: "Start a dungeon adventure!"
        })
    }

    // * check the active dungeon adventures to see if any are complete
    const checkAdventures = await updateAdventures(activeDungeonAdventures);

    // todo test this works with another adventure added that is not complete

    // * returns back to user active dungeons
    return res.json({
        activeDungeonAdventures: activeDungeonAdventures,
        checkedAdventures: checkAdventures
    });
});


// * debrief hunter from a dungeon adventure
adventureDungeonRouter.post('/debrief', async (req: Request, res: Response) => {
    // * get dungeon id
    const adventureID = req.body.adventureID;

    if(adventureID == undefined || adventureID == null){
        return res.status(400).json({
            message: 'No dungeon ID provided!'
        })
    }

    // * check dungeon id is valid and dungeon exists
    const adventureExists = await prisma.adventure.findFirst({
        where: {
            id: adventureID as string,
            debriefed: false,
        },
        select: {
            complete: true,
            debriefed: true,
        }
    });

    if(!adventureExists){
        return res.status(400).json({
            message: 'Dungeon Advneture does not exist!'
        })
    }
})


// * show previous historic dungeon adventures



module.exports = adventureDungeonRouter;