import { auth } from "@clerk/nextjs/server"

const adminIds = [
    "user_2z30tZ6KqFMh5N6QdDsjY328eB5",
];

export const isAdmin = async () => {
    const {userId} = await auth();

    if(!userId){
        return false;
    }

    return adminIds.indexOf(userId) !== -1;

}