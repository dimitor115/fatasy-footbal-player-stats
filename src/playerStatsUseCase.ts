import {useDatabase} from './database'
import {PlayerStats} from './models/PlayerStats'
import {Period} from './models/Period'
import {logger} from './logger'

export async function findPlayerStatistics(period: Period, periodId?: number): Promise<Array<PlayerStats>> {
  return useDatabase(async connection => {
    logger.info(`Finding player statistics for period [${period}] and periodId [${periodId}].`)
    const query = prepareQuery(period, periodId)
    logger.debug(query)
    const [result] = await connection.query<Array<PlayerStats>>(query)
    logger.info(`Found [${result.length}] matching entries.`)
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
        throw Error('Period Id must be specified for Period of type Month.')
    case Period.WEEK:
      if (periodId !== undefined)
        return `${playerStatsFragment}${weekIdPeriodFragment(periodId)}`
      else
        throw Error('Period Id must be specified for Period of type Week.')
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

const monthPeriodFragment = (monthId: number): string => `
LEFT JOIN monthPlayers period on player.id = period.playerId
WHERE period.monthId = ${monthId}
`

const weekIdPeriodFragment = (weekId: number): string => `
LEFT JOIN weekPlayers period on player.id = period.playerId
WHERE period.weekId = ${weekId}
`

