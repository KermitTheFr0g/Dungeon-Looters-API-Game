import express, {Request, Response} from 'express';
const userAccountRouter = express.Router();

const userModels = require('../../models/user.ts');
const prisma = require('../../prisma/prisma.ts');

userAccountRouter.post('/signup', async (req: Request, res: Response) => {
    const userDetails = {
        username: req.body.username,
        name: req.body.name,
    }

    // * check if user username is taken
    const user = await prisma.user.findFirst({
        where: {
            username: userDetails.username
        }
    })

    if(user){
        return res.status(400).json({
            message: 'Username is already taken'
        })
    }

    // * generate API token
    const api_token = await userModels.genAPIKey();

    // * create user
    await prisma.user.create({
        data: {
            username: userDetails.username,
            name: userDetails.name,
            api_token: api_token
        }
    })

    return res.json({
        success: true,
        message: 'User created successfully',
        api_token: api_token
    });
})

module.exports = userAccountRouter;