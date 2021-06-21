import {useDatabase} from "./database";
import {PlayerStats} from "./models/PlayerStats";

export async function findPlayerStatistics(): Promise<PlayerStats[]> {
    return useDatabase(async connection => {
        const [result] = await connection.query<PlayerStats[]>(select)
        return result
    })
}

const select = `
SELECT
player.id,
player.firstName,
player.lastName,
player.position,
team.name,
season.starts,
season.points,
season.goals,
season.ownGoals,
season.assists,
season.subs,
season.motms,
season.concedes,
season.cleansheets,
season.penSaves,
season.penMisses,
season.redCards,
season.yellowCards,
season.savesTier1,
season.savesTier2,
season.shotsTier1,
season.shotsTier2,
season.tacklesTier1,
season.tacklesTier2,
season.passesTier1,
season.passesTier2
FROM players player
LEFT JOIN teams team on player.teamId = team.id
LEFT JOIN seasonPlayers season on player.id = season.playerId
`
