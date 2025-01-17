"use client";

// prisma
import { Member, MemberRole, Profile, Server } from "@prisma/client";
// icons
import { ShieldAlert, ShieldCheck } from "lucide-react";
// route
import { useParams, useRouter } from "next/navigation";
// lib
import { cn } from "@/lib/utils";
// components
import UserAvatar from "@/components/user-avatar";

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />,
};

const ServerMember = ({ member, server }: ServerMemberProps) => {
  const params = useParams();
  const router = useRouter();

  const icon = roleIconMap[member.role];

  const onClick = () => {
    router.push(`/servers/${server.id}/conversations/${member.id}`);
  };

  return (
    <button
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.memberId === member.id && "dark:bg-zinc-700 bg-zinc-700/20"
      )}
      onClick={onClick}
    >
      <UserAvatar src={member.profile.imageUrl} />
      {icon}
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.memberId === member.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {member.profile.name}
      </p>
    </button>
  );
};

export default ServerMember;
