import { eq } from "drizzle-orm";
import { schema, db } from "./db";

export async function getIsTournamentDirector(
  userId: string,
): Promise<boolean> {
  const result = await db
    .select({ isTournamentDirector: schema.users.isTournamentDirector })
    .from(schema.users)
    .where(eq(schema.users.id, userId));
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
    .select({ isAdmin: schema.users.isAdmin })
    .from(schema.users)
    .where(eq(schema.users.id, userId));
  if (result[0] === undefined) {
    throw new Error("User not found");
  }
  const { isAdmin } = result[0];
  if (isAdmin === undefined || isAdmin === null) {
    throw new Error("isAdmin field not found");
  }
  return isAdmin;
}
