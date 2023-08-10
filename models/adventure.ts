import prisma from '../prisma/prisma';

class AdventureModel {
    // * update adventures to complete
    async updateAdventures(dungeonsList: Array<{completingAt: Date, complete: boolean, id: string}>){
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