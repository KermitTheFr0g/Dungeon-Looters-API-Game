import express, {Request, Response} from 'express';
const userAccountRouter = express.Router();

import prisma from '../../prisma/prisma';
const userModels = require('../../models/user.ts');

// * user signs up with username and name
// * they are added to the db and given an api token
userAccountRouter.post('/signup', async (req: Request, res: Response) => {
    const userDetails = {
        username: req.body.username,
        name: req.body.name,
    }

    // * check if user api token is taken
    const users = await prisma.user.findUnique({
        where: {
            username: userDetails.username
        },
        select: {
            id: true,
            username: true
        }
    })


    // * return error if username is taken
    if(users !== null){
        return res.status(400).json({
            message: 'Username is already taken'
        })
    }

    // * generate API token
    const api_token = await userModels.genAPIKey();

    // * create user
    await prisma.user.create({
        data: {
            username: userDetails.username.toLowerCase(),
            name: userDetails.name,
            api_token: api_token
        }
    })

    return res.json({
        success: true,
        message: 'User created successfully, keep your token secret!',
        api_token: api_token
    });
})


// * user searches for a user
userAccountRouter.get('/get-user', async (req: Request, res: Response) => {
    const username = req.query.username;

    if(!username){
        return res.status(400).json({
            message: 'Username is required'
        })
    }

    const user = await prisma.user.findFirst({
        where: {
            username: username as string
        },
        select: {
            username: true,
            name: true,
            gold: true,
            level: true,
            experience: true,
            hunters: {
                select: {
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
                        },
                    },
                    level: true,
                    onMission: true,
                    adventure: true
                }
            },
            items: true,
            adventures: true,
            createdAt: true,
        }
    });

    // * return error if user doesn't exist
    if(!user){
        return res.status(400).json({
            message: 'User does not exist'
        })
    }

    return res.json({
        user: user
    })
})

module.exports = userAccountRouter;