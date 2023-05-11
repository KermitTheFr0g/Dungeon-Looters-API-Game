import {Express, Request, Response, NextFunction} from 'express';
import prisma from '../prisma/prisma';

// Your custom "middleware" function:
async function verifyTokenIncluded(req: Request, res: Response, next: NextFunction) {
    const apiToken = req.query.token;
    
    // * checks if api token is included in the request
    // * returns error if not included
    if(!apiToken){
        return res.status(400).json({
            error: 'API token is required'
        })
    }

    // * checks if api token is valid
    const getUser = await prisma.user.findFirst({
        where: {
            api_token: apiToken as string
        }
    })

    // * return error if api token is invalid
    if(!getUser){
        return res.status(400).json({
            error: 'Invalid API token'
        })
    }

    return next();
}

export default verifyTokenIncluded;