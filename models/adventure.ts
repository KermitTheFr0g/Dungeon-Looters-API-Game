import prisma from '../prisma/prisma';

class AdventureModel {
    // * taking an input from the user
    // * returning the dungeon list back from function
    // * update adventures to complete
    async completeAdventures(dungeonsList: Array<{completingAt: Date, complete: boolean, id: string}>){
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
    }

    // * doesn't return anything
    // * doesn't take any input of dungeons
    async updateAdventures(apiToken: string){
        // * takes users api token to get their active dungeon adventures
        const activeDungeonAdventures = await prisma.adventure.findMany({
            where: {
                user: {
                    api_token: apiToken as string,
                },
                debriefed: false,
            },
            select: {
                id: true,
                completingAt: true,
                complete: true,
            },
        })

        if(activeDungeonAdventures.length === 0){
            return
        }

        await this.completeAdventures(activeDungeonAdventures);
    }

    // * collect items from item pool
    async collectItemPool(itemList: Array<{id: string, itemId: string, dropChance: number, item: {name: string}}>){
        let earntItems: Array<{id: string, name: string, dropChance: number}> = [];
        itemList.map(item => {
            const chance = Math.floor(Math.random() * 100) + 1;
            if(chance <= item.dropChance){
    
                const itemObject = {
                    id: item.itemId, 
                    name: item.item.name,
                    dropChance: item.dropChance
                }
                earntItems.push(itemObject);
            }
        })
    
        return earntItems;
    }
}

export default new AdventureModel();