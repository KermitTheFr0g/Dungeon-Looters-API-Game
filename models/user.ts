import prisma from '../prisma/prisma';

class UserModel {
    // * check applicable for start hunter
    async applicableStarterHunter(api_token: string){
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

    // * add experience to the user
    async addExperience(apiToken: string, additionalExperience: number){
        // ! THIS LOGIC NEEDS TO BE TESTED
        // every level is going to have 100 exerience points to make it easy   
        
        // get current experience to user
        const userExperience = await prisma.user.findFirst({
            where: {
                api_token: apiToken as string,
            },
            select: {
                experience: true
            }
        })

        if(!userExperience){
            return {
                error: true,
                message: "No user has been found!"
            }
        }

        // mod the experience by 100 to find what is left to calculate
        const totalExperience = userExperience.experience + additionalExperience;

        const experience = totalExperience % 100;
        const additionalLevels = (totalExperience - experience) / 100;

        // increment user level and set their current experience points
        await prisma.user.update({
            where: {
                api_token: apiToken as string,
            },
            data: {
                experience: experience,
                level: {
                    increment: additionalLevels
                }
            }
        })

        // todo maybe return the new level of the user

        // return if success
        return {
            success: true,
        }
    }
}


export default new UserModel();