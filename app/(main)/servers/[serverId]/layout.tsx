import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";

import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import ServerSideBar from "@/components/server/server-sidebar";

const ServerIdLayout = async ({ 
  children,
  params, 
} : { 
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  // get the user profile or send back to signin
  const profile = await currentProfile();
  if(!profile) return redirectToSignIn();

  // find a server with serverId and profile.id is a member or else redirect to home
  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });
  if(!server) return redirect("/");

  return (
    <div className="h-full">
      <div 
        className="hiddel md:flex h-full w-60 z-20 flex-col fixed insert-y-0"
      >
        <ServerSideBar serverId={params.serverId} />
      </div>
      <main className="h-full md:pl-60">
        { children }
      </main>
    </div>
  )
}
export default ServerIdLayout