import { redirect } from "next/navigation";
import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { InitialModal } from "@/components/modals/initial-modal";


const SetupPage = async () => {
  // get the profile
  const profile = await initialProfile();

  // get any server this user is a member of and redirect to that server page
  const server = await db.server.findFirst({
      where: {
          members: {
              some: {
                  profileId: profile?.id
              }
          }
      }
  })
  if(server){
      return redirect(`/servers/${server.id}`)
  }

  // if the profile id is not a member of any servers prompt the user to create a server
  return <InitialModal />
}
export default SetupPage;