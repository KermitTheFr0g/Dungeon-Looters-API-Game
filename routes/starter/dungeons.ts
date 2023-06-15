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

// * user selects the starter dungeon
starterDungeonRouter.post('/select-dungeon', async (req: Request, res: Response) => {
    const dungeonName = req.query.dungeonName;
    const hunterName = req.query.hunterName;
    
    // * 

})


module.exports = starterDungeonRouter;