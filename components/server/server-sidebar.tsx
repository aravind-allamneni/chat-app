import { redirect } from "next/navigation";
import { ChannelType } from "@prisma/client";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { ServerHeader } from "./server-header";


interface ServerSideBarProps{
  serverId: string;
}

const ServerSideBar = async ({ serverId }: ServerSideBarProps ) => {
  // get the profile or redirect to signin
  const profile = await currentProfile();
  if(!profile) return redirect("/");

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        }
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        }
      }
    }
  });

  if(!server) return redirect("/");

  // divide channels based on type
  const textChannels = server?.channels.filter((channel) => channel.type===ChannelType.TEXT);
  const audioChannels = server?.channels.filter((channel) => channel.type===ChannelType.AUDIO);
  const videoChannels = server?.channels.filter((channel) => channel.type===ChannelType.VIDEO);

  // filterout our profile from all members
  const members = server?.members.filter((member) => member.profileId!==profile.id);

  // get the role of current profile
  const role = server?.members.find((member) => member.profileId===profile.id)?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader 
        server={server}
        role={role}
      />
      <p>COntetnt</p>
    </div>
  )
}
export default ServerSideBar;