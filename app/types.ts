export type User = {
    uid: string,
    firstName: string,
    lastName: string,
    pastTournaments: []
    playerRating: number,
    statistics: {
        wins: number,
        loses: number
    }
}

export type Tournament = {
    name: string,
    dates: [],
    entryFee: number,
    tournamentData: {
    dayOne: {
            entries: []
        }
    }
}