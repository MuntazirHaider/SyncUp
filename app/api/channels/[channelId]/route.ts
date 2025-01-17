// lib
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
// prisma
import { MemberRole } from "@prisma/client";
//
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const { name, type } = await req.json();

    const serverId = searchParams.get("serverId");
    const { channelId } = await Promise.resolve(params);

    if (!profile) {
      return new NextResponse("Unauthorized User", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }
    if (!channelId) {
      return new NextResponse("Member ID Missing", { status: 400 });
    }
    if(name === "general"){
      return new NextResponse("Name Cannot Be general", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
       channels: {
        update: {
          where: {
            id: channelId,
            NOT: {
              name: "general",
            },
          },
          data: {
            name,
            type
          }
        }
       }
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("CHANNEL_ID_PATCH", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    const { channelId } = await Promise.resolve(params);

    if (!profile) {
      return new NextResponse("Unauthorized User", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }
    if (!channelId) {
      return new NextResponse("Channel ID Missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          deleteMany: {
            id: channelId,
            name: {
              not: "general",
            },
          },
        },
      },
      include: {
        channels: {
          include: {
            profile: true,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("CHANNEL_ID_DELETE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
