import prisma from "../prisma/prisma";



// * get user's items
async function getAllItems(){
    // get all user's items and return

    return {
        items: []
    }
}

async function addAdditionalItems(items: Array<string>){
    // needs to take the array of items and add these to the user's items
    
    
    return {
        success: true
    }
}

export default {
    getAllItems,
    addAdditionalItems,
}