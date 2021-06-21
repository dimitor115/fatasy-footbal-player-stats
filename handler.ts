import * as dotenv from 'dotenv'
import {Handler} from 'aws-lambda';

import {findPlayerStatistics} from "./src/playerStatsUseCase";
import {isPeriod, Period} from "./src/models/Period";
import { logger } from './src/logger';

dotenv.config()
export const stats: Handler<Event> = async (event: Event) => {
    try {
        logger.debug(`Input path params: [${JSON.stringify(event.pathParameters)}], query params: [${JSON.stringify(event.queryStringParameters)}]`)
        const period = getPeriod(event)
        const periodId = getPeriodId(event, period)
        const result = await findPlayerStatistics(period, periodId)
        const response = {
            statusCode: 200,
            body: JSON.stringify(
                {
                    message: result,
                    input: event,
                },
                null,
                2
            ),
        };
        return response
    } catch (e) {
        logger.error(e)
        return {
            statusCode: 500,
            body: JSON.stringify(
                {
                    message: e.message,
                    input: event,
                },
                null,
                2
            ),
        };
    }

}

type Event = {
    pathParameters: {
        period: string
    }
    queryStringParameters: {
        weekId?: number
        monthId?: number
    }
}

function getPeriod(event: Event): Period {
    const periodInput = event.pathParameters.period
    if (isPeriod(periodInput)) {
        return periodInput
    } else {
        throw Error(`Invalid period type: [${periodInput}]`)
    }
}

function getPeriodId(event: Event, period: Period): number | undefined {
    switch (period) {
        case Period.WEEK:
            return getWeekId(event)
        case Period.MONTH:
            return getMonthId(event)
        default:
            return undefined
    }
}

function getMonthId(event: Event): number {
    const maybeMonthId = event.queryStringParameters.monthId
    if (maybeMonthId === undefined || maybeMonthId === null)
        throw Error("Parameter monthId cannot be null.")
    if (1 > maybeMonthId || maybeMonthId > 37)
        throw Error("Parameter monthId should be in range [1-37]")
    else
        return maybeMonthId
}

function getWeekId(event: Event): number {
    const maybeWeekId = event.queryStringParameters.weekId
    if (maybeWeekId === undefined || maybeWeekId === null)
        throw Error("Parameter weekId cannot be null.")
    if (1 > maybeWeekId || maybeWeekId > 12)
        throw Error("Parameter monthId should be in range [1-12]")
    else
        return maybeWeekId
}
