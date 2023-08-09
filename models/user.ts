import generateApiKey from 'generate-api-key';
import prisma from '../prisma/prisma';

// * generate an api key for the user
async function genAPIKey(){
    const key = await generateApiKey({
        method: 'string',
        length: 32,
        prefix: 'cosmicarray_',
        pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
    });

    const users = await prisma.user.findFirst({
        where: {
            api_token: key as string
        },
        select: {
            id: true
        }
    })

    if(users !== null){
        genAPIKey();
    }else{
        return key;
    }
}


// * check if the user already has a hunter
async function applicableStarterHunter(api_token: string){
    // get all user's hunters
    const getUser = await prisma.user.findFirst({
        where: {
            api_token: api_token
        },
        select: {
            hunters: {
                select: {
                    id: true
                }
            }
        }
    })

    const userHunters = getUser?.hunters;

    return userHunters?.length == 0;
}

async function addExperience(userID: string, additionalExperience: number){
    // every level is going to have 100 exerience points to make it easy

    // get current experience to user

    // mod the experience by 100 to find what is left to calculate

    // increment user level and set their current experience points

    // return if success
}

export default {
    genAPIKey,
    applicableStarterHunter,
    addExperience,
}