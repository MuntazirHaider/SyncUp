// lib
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
//
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    const { serverId } = await Promise.resolve(params);

    if (!profile) {
      return new NextResponse("Unauthorized User", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVERS_ID_LEAVE_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
