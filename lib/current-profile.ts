import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const currentProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!profile) {
    return null;
  }

  return profile;
};
