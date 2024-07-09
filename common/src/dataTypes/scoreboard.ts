import { Stats } from "./stats";

export interface Scoreboard {
    stats: Stats,
    win: number,
    loss: number,
    tie: number,
    Opp: string
}