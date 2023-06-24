import express, { Request, Response } from 'express';
const starterDungeonRouter = express.Router();

import prisma from '../../prisma/prisma';
import verifyToken from '../../middleware/verifyToken';

starterDungeonRouter.use(verifyToken);

// * returns back to the user the dungeons which can be selected
starterDungeonRouter.get('/get-dungeons', async (req: Request, res: Response) => {
    // * get starter dungeons
    const getDungeons = await prisma.dungeon.findMany({
        where: {
            starter: true
        },
        select: {
            name: true,
            description: true,
            image: true,
            level: true,
        }
    });

    return res.json({
        starterDungeons: getDungeons
    })
});

// * returns back details about a specific dungeon
starterDungeonRouter.get('/dungeon-details', async (req: Request, res: Response) => {
    const dungeonName = req.query.dungeonName;

    // * get dungeon details
    const getDungeon = await prisma.dungeon.findFirst({
        where: {
            starter: true,
            name: dungeonName as string
        },
        select: {
            name: true,
            description: true,
            image: true,
            level: true,
            lootPool: {
                select: {
                    item: true,
                    dropChance: true,
                }
            }
        }
    });

    return res.json({
        dungeon: getDungeon
    });
})

// todo some end point to get information about the dungeon user wants to complete
// todo gives info about loot pool, level, etc

// * user selects the starter dungeon
starterDungeonRouter.post('/select-dungeon', async (req: Request, res: Response) => {
    const dungeonName = req.body.dungeonName;
    const hunterName = req.body.hunterName;
    
    // * check if the hunter can be sent
    const userHunters = await prisma.userHunters.findFirst({
        where: {
            user: {
                api_token: req.query.token as string
            },
            hunter: {
                name: hunterName as string
            }
        },
        select: {
            id: true,
            onMission: true,
            hunter: {
                select: {
                    starter: true
                }
            }
        }
    }); 

    // * check if user owns the hunter they selected
    if(!userHunters){
        return res.status(400).json({
            error: 'Hunter not found',
            tip: 'Check if the hunter name is correct and you own hunter!'
        })
    }

    // * check if user already has a hunter on a mission
    if(userHunters.onMission){
        return res.status(400).json({
            error: 'Hunter already on a mission',
            tip: 'Wait for the hunter to return before sending them on another adventure!'
        })
    }

    // * get dungeon details
    const starterDungeons = await prisma.dungeon.findFirst({
        where: {
            starter: true,
            name: dungeonName as string,
        },
        select: {
            starter: true,
        }
    })
    
    // * check if dungeon exists and is a starter dungeon
    if(!starterDungeons){
        return res.status(400).json({
            error: 'Starter Dungeon not found',
            tip: 'Check if the dungeon name is correct! Potentially not a starter dungeon!'
        })
    }

    // ! need to come up with the algorithm for time to complete dungeon
    // ! for now 5 minutes are added to the current time
    // however this might not change for starter dungeons

    // * send hunter on adventure
    await prisma.adventure.create({
        data: {
            user: {
                connect: {
                    api_token: req.query.token as string
                }
            },
            dungeon: { 
                connect: { 
                    name: dungeonName as string
                }
            },

            hunter: {
                connect: {
                    id: userHunters.id
                }
            },

            // ! this is what needs to be changed
            completingAt: new Date(Date.now() + (1000 * 60 * 5))
        }
    })


    // * update hunter to be on a mission
    await prisma.userHunters.update({
        where: {
            id: userHunters.id
        }, 
        data: {
            onMission: true
        }
    })

    // todo return back to the user that the adventure has begun
    return res.json({
        adventureStarted: true,
        dungeonSelected: dungeonName,
        hunterSelected: hunterName,
        returningAt: new Date(Date.now() + (1000 * 60 * 5)),
        tip: "You have begun a starter Dungeon!"
    })
});

module.exports = starterDungeonRouter;