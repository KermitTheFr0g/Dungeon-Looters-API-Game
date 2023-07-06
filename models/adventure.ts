import prisma from '../prisma/prisma';

// * update adventures to complete
async function updateAdventures(dungeonsList: Array<{completingAt: Date, complete: boolean, id: string}>){
    let completeDungeonAdventures: Array<string> = [];
    dungeonsList.map((adventure) => {
        if(new Date(adventure.completingAt) < new Date()){
            adventure.complete = true;
            completeDungeonAdventures.push(adventure.id);
        }

    })
    
    await prisma.adventure.updateMany({
        where: {
            id: {
                in: completeDungeonAdventures
            }
        },
        data: {
            complete: true
        }
    })

    return dungeonsList;
}

export default {
    updateAdventures
}