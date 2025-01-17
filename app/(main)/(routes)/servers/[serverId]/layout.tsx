// lib
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
// route
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
// components
import ServerSidebar from "@/components/server/server-sidebar";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile = await currentProfile();
  const { serverId } = await Promise.resolve(params);

  if (!profile) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="xs:hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={serverId}/>
      </div>
      <main className="md:pl-60 h-full">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
