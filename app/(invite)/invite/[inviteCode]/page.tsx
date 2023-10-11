import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
};

const InviteCodePage = async ({
  params
}: InviteCodePageProps) => {
  // get the profile, if there is no profile redirect to signin with clerk
  const profile = await currentProfile();
  if(!profile) return redirectToSignIn();

  //if there is no invite code redirect to home
  if(!params.inviteCode) return redirect("/")

  // check if the invitee is already a member of the server and if he is send him to server 
  // directly no jon required
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });
  if(existingServer){
    console.log("sending to url", `/servers/${existingServer.id}`);
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          }
        ]
      },
    },
  });
  
  if(server){
    return redirect(`/servers/${server.id}`);
  }

  return null;
}
export default InviteCodePage