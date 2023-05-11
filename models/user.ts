import generateApiKey from 'generate-api-key';
const prisma = require('../prisma/prisma.ts');

async function genAPIKey(){
    const key = generateApiKey({
        method: 'string',
        length: 32,
        prefix: 'cosmicarray_',
        pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
    });

    const user = await prisma.user.findFirst({
        where: {
            api_token: key
        }
    })

    if(user){
        genAPIKey();
    }else{
        return key;
    }
}

module.exports = {
    genAPIKey
}