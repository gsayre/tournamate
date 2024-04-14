import { AppRouter } from "./router/_app";
import { inferRouterOutputs } from "@trpc/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
type Modify<T, R> = Omit<T, keyof R> & R;

//Tournament Types
export type InferredTournamentDataType =
  RouterOutputs["tournament"]["getTournament"];

//My Pool Types
export type InferredGetMyPoolType = RouterOutputs["tournament"]["getMyPool"];
export type InferredSingleTeamType =
  InferredGetMyPoolType["myPool"]["teams"][0];
export type InferredMyPoolType = Pick<InferredGetMyPoolType["myPool"], "teams">;

//My Schedule Types
export type InferredGetMyScheduleType =
  RouterOutputs["tournament"]["getMyScheudule"];

//Division Types
export type InferredDivisionByType =
  RouterOutputs["tournament"]["getDivisionsByType"];
export type InferredDivisionSingle = ArrayElement<InferredDivisionByType>;

//Pools Types
export type InferredPoolsForDivisionType =
  RouterOutputs["tournament"]["getPoolsByDivision"];
export type InferredPoolsForDivisionSingleType = ArrayElement<
  InferredPoolsForDivisionType["poolsForDivision"]
>;
export type InferredSingleTeamFromPoolsType =
  InferredPoolsForDivisionSingleType["teams"][0];
export type InferredTeamsArrayFromPoolsType =
  InferredPoolsForDivisionSingleType["teams"];

//Bracket Types
export type InferredGetBracketByDivisionType =
  RouterOutputs["bracket"]["getBracketByDivision"];
export type bracketGames = Pick<
  NonNullable<InferredGetBracketByDivisionType>,
  "games"
>;
export type singleBracketGame = ArrayElement<bracketGames["games"]>;
export type nullableBracketGames = Modify<
  bracketGames,
  {
    games: Array<singleBracketGame | null>;
  }
>;

//Game Types
type gamesPickType = Pick<
  InferredPoolsForDivisionType["poolsForDivision"][number],
  "games"
>;
export type InferredGameSingleType = ArrayElement<gamesPickType["games"]>;
export type gameArrayType = InferredGetMyScheduleType["mySchedule"][0]["games"];
export type gameArrayOtherType =
  InferredPoolsForDivisionType["poolsForDivision"][0]["games"];
