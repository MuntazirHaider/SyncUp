// lib
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
// route
import { redirect } from "next/navigation";
// db
import {
  Channel,
  ChannelType,
  Member,
  MemberRole,
  Profile,
} from "@prisma/client";
// components
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ServerHeader from "./server-header";
import ServerSearch from "./server-search";
import ServerSection from "./server-section";
import ServerChannel from "./server-channel";
// icons
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import ServerMember from "./server-member";

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-indigo-500" />,
};

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();
  if (!profile) {
    redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

  const textChannels: Channel[] = [];
  const audioChannels: Channel[] = [];
  const videoChannels: Channel[] = [];
  let role: MemberRole | undefined;
  const members: (Member & { profile: Profile })[] = [];

  server?.channels.forEach((channel) => {
    switch (channel.type) {
      case ChannelType.TEXT:
        textChannels.push(channel);
        break;
      case ChannelType.AUDIO:
        audioChannels.push(channel);
        break;
      case ChannelType.VIDEO:
        videoChannels.push(channel);
        break;
    }
  });

  server?.members.forEach((member) => {
    if (member.profileId !== profile.id) {
      members.push(member);
    } else {
      role = member.role;
    }
  });

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Text Channels"
            />
            {textChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                role={role}
                server={server}
              />
            ))}
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Audio Channels"
            />
            {audioChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                role={role}
                server={server}
              />
            ))}
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Video Channels"
            />
            {videoChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                role={role}
                server={server}
              />
            ))}
          </div>
        )}
        {!!members?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              role={role}
              label="Members"
              server={server}
            />
            {members.map((member) => (
              <ServerMember key={member.id} member={member} server={server} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
