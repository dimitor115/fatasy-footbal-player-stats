import {RowDataPacket} from "mysql2";

export interface PlayerStats extends RowDataPacket {
    id: string
    firstName: string
    lastName: string
    teamName: string
    position: string //TODO: enum?
    goals: number
    assists: number
    subs: number
    motms: number
    concedes: number
    cleansheets: number
    penSaves: number
    penMisses: number
    redCards: number
    yellowCards: number
    savesTier1: number
    savesTier2: number
    shotsTier1: number
    shortsTier2: number
    tacklesTier1: number
    tacklesTier2: number
    passesTier1: number
    passesTier2: number
}
