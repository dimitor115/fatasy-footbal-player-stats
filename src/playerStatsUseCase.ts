import {useDatabase} from "./database";
import {PlayerStats} from "./models/PlayerStats";
import {Period} from "./models/Period";

export async function findPlayerStatistics(period: Period, periodId?: number): Promise<PlayerStats[]> {
    return useDatabase(async connection => {
        const query = prepareQuery(period, periodId)
        console.log(query)
        const [result] = await connection.query<PlayerStats[]>(query)
        return result
    })
}

function prepareQuery(period: Period, periodId?: number): string {
    switch (period) {
        case Period.SEASON:
            return `${playerStatsFragment}${seasonPeriodFragment}`
        case Period.MONTH:
            if (periodId !== undefined)
                return `${playerStatsFragment}${monthPeriodFragment(periodId)}`
            else
                throw Error("Period Id must be specified for Period of type Month.")
        case Period.WEEK:
            if (periodId !== undefined)
                return `${playerStatsFragment}${weekIdPeriodFragment(periodId)}`
            else
                throw Error("Period Id must be specified for Period of type Week.")
    }
}

const playerStatsFragment = `
SELECT
player.id,
player.firstName,
player.lastName,
player.position,
team.name,
period.starts,
period.points,
period.goals,
period.ownGoals,
period.assists,
period.subs,
period.motms,
period.concedes,
period.cleansheets,
period.penSaves,
period.penMisses,
period.redCards,
period.yellowCards,
period.savesTier1,
period.savesTier2,
period.shotsTier1,
period.shotsTier2,
period.tacklesTier1,
period.tacklesTier2,
period.passesTier1,
period.passesTier2
FROM players player
LEFT JOIN teams team on player.teamId = team.id`

const seasonPeriodFragment = `
LEFT JOIN seasonPlayers period on player.id = period.playerId
`

const monthPeriodFragment = (monthId: number) => `
LEFT JOIN monthPlayers period on player.id = period.playerId
WHERE period.monthId = ${monthId}
`

const weekIdPeriodFragment = (weekId: number) => `
LEFT JOIN weekPlayers period on player.id = period.playerId
WHERE period.weekId = ${weekId}
`

