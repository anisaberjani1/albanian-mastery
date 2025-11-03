import { adminIds } from "@/constants";
import { auth } from "@clerk/nextjs/server"

export const isAdmin = async () => {
    const {userId} = await auth();

    if(!userId){
        return false;
    }

    return adminIds.indexOf(userId) !== -1;

}