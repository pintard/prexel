const NEUTRAL_GRAY_FG: string = "#8d8d8d";
const NEUTRAL_BLACK_FG: string = "#000000";
const ACTIVE_BLUE_FG: string = "#7d87e2";

export const theme: StringHash = {
  NEUTRAL_GRAY_FG,
  ACTIVE_BLUE_FG,
  NEUTRAL_BLACK_FG,
};

export interface PagePosition {
  left: number;
  top: number;
}

export interface StringHash {
  [key: string]: string | undefined;
}
