import express, { Request, Response } from 'express';
const playerMarketRouter = express.Router();

import prisma from '../../prisma/prisma';
import verifyTokenIncluded from '../../middleware/verifyToken';

playerMarketRouter.use(verifyTokenIncluded);

// * returns items from the player market
playerMarketRouter.get('/', async (req: Request, res: Response) => {
    // * get queries
    const { search, limit } = req.query;

    

})

// * buy an item from the player market
playerMarketRouter.post('/purchase', (req: Request, res: Response) => {
    const apiToken = req.query.token;
    const listingID = req.query.listingID;

    // * need to alter database take this

})

module.exports = playerMarketRouter;