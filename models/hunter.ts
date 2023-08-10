import prisma from "../prisma/prisma";

class hunterUtils {
    async addExperience(userHunterId: string, additionalExperience: number){
        // ! THIS LOGIC NEEDS TO BE TESTED
        // every level is going to have 100 exerience points to make it easy   

        // get current experience to user's hunter
        const hunterExperience = await prisma.userHunters.findFirst({
            where: {
                id: userHunterId as string,
            },
            select: {
                experience: true
            }
        });

        if(!hunterExperience){
            return {
                error: true,
                message: "No user hunter has been found!"
            }
        }

        // mod the experience by 100 to find what is left to calculate
        const totalExperience = hunterExperience.experience + additionalExperience;

        const experience = totalExperience % 100;
        const additionalLevels = (totalExperience - experience) / 100;

        // increment hunter level and set their current experience points
        await prisma.userHunters.update({
            where: {
                id: userHunterId as string,
            },
            data: {
                experience: experience,
                level: {
                    increment: additionalLevels
                }
            }
        })

        // todo maybe return the new level of the hunter

        // return if success
        return {
            success: true,
        }
    }
}

export default new hunterUtils;