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
                    level: true,
                    lootPool: {
                        select: {
                           item: {
                                select: {
                                    name: true
                                }
                            },
                            dropChance: true,
                        }
                    }
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
            message: "No active dungeon adventures!",
            tip: "Start a dungeon adventure!"
        })
    }

    // * check the active dungeon adventures to see if any are complete
    const checkedAdventures = await updateAdventures(activeDungeonAdventures);

    // * this returns back to the user the updates dungeons

    // * returns back to user active dungeons
    return res.json({
        activeDungeonAdventures: checkedAdventures,
    });
});


// * debrief hunter from a dungeon adventure
adventureDungeonRouter.post('/debrief', async (req: Request, res: Response) => {
    // * get dungeon id
    const apiToken = req.query.token;
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
            dungeonId: true,
            hunterId: true,
        }
    });

    if(!adventureExists){
        return res.status(400).json({
            message: 'Dungeon Advneture does not exist!'
        })
    }

    // * check if dungeon adventure is complete and ready for debrief
    if(!adventureExists.complete || adventureExists.debriefed){
        return res.status(400).json({
            message: 'Dungeon Adventure not ready for debrief!'
        })
    }

    // * get dungeon adventure details
    // todo to be used below
    const dungeonDetails = await prisma.dungeon.findFirst({
        where: {
            id: adventureExists.dungeonId as string,
        },
        select: {
            name: true,
            level: true,
            lootPool: true,
        }
    });


    // ! get rewards
    // todo add xp / levels to hunter

    // todo add xp / levels to user

    // * get random loot from loot pool
    const lootPool = dungeonDetails?.lootPool;
    console.log(lootPool);

    // * get random gold from level of dungeon
    let randomGold = Math.floor(Math.random() * (dungeonDetails?.level || 1)) * 100;


    // * change details to say debriefed
    const updateAdventure = await prisma.adventure.update({
        where: {
            id: adventureID as string,
        },
        data: {
            debriefed: true,
        }
    })

    // ! the user hunter is not being updated

    // * update hunter stats and level
    const updatedHunter = await prisma.userHunters.updateMany({
        where: {
            hunter: {
                id: adventureExists.hunterId as string,
            },
            user: {
                api_token: apiToken as string
            }
        }, 
        data: {
            onMission: false,
            experience: {
                increment: 100
            },
            level: { 
                increment: 1
            }
        }
    })

    // ! the user hunter is not being updated
    
    // * update user gold
    const updatedUser = await prisma.user.update({
        where: {
            api_token: apiToken as string
        },
        data: {
            gold: {
                increment: randomGold
            }
        }
    })

    return res.json({
        message: 'Dungeon Adventure Debriefed!',
        rewards: {
            xp: 100,
            gold: randomGold,
            loot: 'list here',
        }
    })
})


// * show previous historic dungeon adventures
adventureDungeonRouter.get('/historic', async (req: Request, res: Response) => {
    // * get all historic dungeons
    const apiToken = req.query.token;

    const historicDungeons = await prisma.adventure.findMany({
        where: {
            user: {
                api_token: apiToken as string
            },
            debriefed: true,
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
        }
    })

    // * check if there are any historic dungeons
    if(historicDungeons.length === 0){
        return res.json({
            message: "No historic dungeon adventures!",
            tip: "Start a dungeon adventure!"
        })
    }

    return res.json({
        historicDungeonAdventures: historicDungeons,
    })
})


module.exports = adventureDungeonRouter;