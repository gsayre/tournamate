import { eq } from "drizzle-orm";
import { clientSchema, db } from "./db";

export async function getIsTournamentDirector(
  userId: string,
): Promise<boolean> {
  const result = await db
    .select({ isTournamentDirector: clientSchema.users.isTournamentDirector })
    .from(clientSchema.users)
    .where(eq(clientSchema.users.id, userId));
  if (result[0] === undefined) {
    throw new Error("User not found");
  }
  const { isTournamentDirector } = result[0];
  if (isTournamentDirector === undefined || isTournamentDirector === null) {
    throw new Error("isTournamentDirector field not found");
  }
  return isTournamentDirector;
}

export async function getIsAdmin(
  userId: string,
): Promise<boolean> {
  const result = await db
    .select({ isAdmin: clientSchema.users.isAdmin })
    .from(clientSchema.users)
    .where(eq(clientSchema.users.id, userId));
  if (result[0] === undefined) {
    throw new Error("User not found");
  }
  const { isAdmin } = result[0];
  if (isAdmin === undefined || isAdmin === null) {
    throw new Error("isAdmin field not found");
  }
  return isAdmin;
}
