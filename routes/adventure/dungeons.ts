import express, { Request, Response, NextFunction } from 'express';
const adventureDungeonRouter = express.Router();

import prisma from '../../prisma/prisma';
import adventureModel from '../../models/adventure';
import userModel from '../../models/user';
import verifyToken from '../../middleware/verifyToken';

adventureDungeonRouter.use(verifyToken);

// * returns back to the user all of the active active dungeon adventures
adventureDungeonRouter.get('/active', async (req: Request, res: Response) => {
    const apiToken = req.query.token;

    // * calls the update adventures function to update all of the user's active dungeon adventures
    await adventureModel.updateAdventures(apiToken as string);

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

    // * returns back to user active dungeons
    return res.json({
        activeDungeonAdventures: activeDungeonAdventures,
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

    // * calls the update adventures function to update all of the user's active dungeon adventures
    await adventureModel.updateAdventures(apiToken as string);

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
            hunter: {
                select: {
                    hunterId: true
                }
            }
        }
    });

    if(!adventureExists){
        return res.status(400).json({
            message: 'Dungeon Adventure does not exist!'
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
            lootPool: {
                select: {
                    id: true,
                    itemId: true,
                    dropChance: true,
                    item: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    });

    // ! get rewards
    // * add xp / levels to user
    // todo calculate the amount of xp for the user
    await userModel.addExperience(apiToken as string, 20);

    // add xp / levels to hunter
    // todo calculate the amount of xp for the user hunter
    // todo need to get the userhunterid from somewhere
    // ! await hunterUtils.addExperience(userHunterID as string, 100)
    

    // * get random loot from loot pool
    const lootPool = dungeonDetails?.lootPool;
    let earntItems;

    if(typeof lootPool != 'undefined'){
        earntItems = adventureModel.collectItemPool(lootPool);
    }

    console.log(earntItems);

    // todo add these earnt items to user
    
    // todo check the items that the user has

    // todo add to the quantity of items already owned

    // todo add new items which are not already owned


    // * get random gold from level of dungeon
    let randomGold = Math.floor(Math.random() * (dungeonDetails?.level || 1)) * 100;

    // * change details to say debriefed
    await prisma.adventure.update({
        where: {
            id: adventureID as string,
        },
        data: {
            debriefed: true,
        }
    })

    // * update hunter stats and level
    await prisma.userHunters.updateMany({
        where: {
            hunter: {
                id: adventureExists.hunter.hunterId as string,
            },
            user: {
                api_token: apiToken as string
            }
        }, 
        data: {
            onMission: false,
        }
    })
    
    // * update user gold
    await prisma.user.update({
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
            loot: earntItems,
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
        },
        take: 10,
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