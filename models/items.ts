import prisma from "../prisma/prisma";

class ItemsModel {
    // * get item stats
    async getItemStats(itemID: string){
        const itemStats = await prisma.item.findFirst({
            where: {
                id: itemID as string,
            }, 
            select: {
                name: true,
                description: true,
                image: true,
            }
        })

        if(!itemStats){
            return {
                error: true,
                message: 'Item not found',
                itemID: itemID,
            }
        }

        return {
            itemStats: itemStats
        };
    }

    

}

export default new ItemsModel();