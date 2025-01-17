import { Member, Profile, Server } from "@prisma/client";

export type ServerWithProfileAndMember = Server & {
  members: (Member & { profile: Profile })[];
};
