export type TimesPlayedPerPlayer = Record<number, number>;
export type TimesWinnedPerPlayer = Record<number, number>;

export interface Stats {
    timesPlayedPerPlayer: TimesPlayedPerPlayer;
    timesWinnedPerPlayer: TimesWinnedPerPlayer;
}
