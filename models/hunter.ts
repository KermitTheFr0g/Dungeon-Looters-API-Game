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
        })

        // mod the experience by 100 to find what is left to calculate
        const totalExperience = hunterExperience.experience + additionalExperience;

        const experience = totalExperience % 100;
        const additionalLevels = additionalExperience - experience;

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

        // return if success
    }
}

export default new hunterUtils;