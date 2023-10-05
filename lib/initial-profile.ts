import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "./db";

export const initialProfile = async () => {
    const user = await currentUser();

    // if no user is logged in redirect to signin
    if(!user){
        redirectToSignIn();
    }

    // find profile of current logged in user
    const profile = await db.profile.findUnique({
        where: {
            userId: user?.id
        }
    })

    // if you find a profile means the user is already signedup just return the profile
    if(profile) {
        return profile
    }

    // if profile is not found need tocreate new Profile
    const newProfile = await db.profile.create({
        data: {
            userId: user?.id,
            name: `${user?.firstName} ${user?.lastName}`,
            imageUrl: user?.imageUrl,
            email: user?.emailAddresses[0].emailAddress
        }
    });
    return newProfile;
}