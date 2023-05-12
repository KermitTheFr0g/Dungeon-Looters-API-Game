import generateApiKey from 'generate-api-key';
import prisma from '../prisma/prisma';

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

module.exports = {
    genAPIKey
}