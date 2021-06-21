import * as mysql from 'mysql2/promise'

export async function useDatabase<Result>(use: (connection: mysql.Connection) => Promise<Result>): Promise<Result> {
    let connection: mysql.Connection | null = null
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: 'practical'
        });
        await connection.connect()
        const result = await use(connection)
        await connection.end()
        return result
    } catch (e) {
        if(connection) {
            await connection.end()
        }
        throw e
    }
}
