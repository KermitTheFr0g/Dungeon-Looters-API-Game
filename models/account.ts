import prisma from "../prisma/prisma";
import generateApiKey from 'generate-api-key';

class AccountModel {
    // * generate an api key for the user
    async genAPIKey(){
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
            this.genAPIKey();
        }else{
            return key;
        }
    }
}

export default new AccountModel();