//
import { auth } from "@clerk/nextjs/server";
// lib
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
// route
import { redirect } from "next/navigation";
import ChatHeader from "@/components/chat/chat-header";

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
}

const MemberIdPage = async ({ params }: MemberIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }

  const { serverId, memberId } = await Promise.resolve(params);

  const currentMember = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    memberId
  );

  if (!conversation) {
    return redirect(`/servers/${serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={otherMember.profile.name}
        imageUrl={otherMember.profile.imageUrl}
        serverId={serverId}
        type="conversation"
      />
    </div>
  );
};

export default MemberIdPage;
