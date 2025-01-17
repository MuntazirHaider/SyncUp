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
    const { name, imageUrl } = await req.json();
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
      },
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVERS_ID_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
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

    const server = await db.server.delete({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVERS_DELETE_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
