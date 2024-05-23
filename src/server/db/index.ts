import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import { env } from "@/env";
import * as user from "./schema/user";
import * as tournament from "./schema/tournament";
import * as stats from "./schema/stats";
import * as team from "./schema/team";
import { mysqlTableCreator } from "drizzle-orm/mysql-core";

export * from "drizzle-orm";

export const schema = { ...user, ...tournament, ...stats, ...team };

export const createTable = mysqlTableCreator((name) => `tournamate_${name}`);

export const db = drizzle(
  new Client({
    url: env.DATABASE_URL,
  }),
  { schema },
);
