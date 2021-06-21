import { Handler } from 'aws-lambda';
import {findPlayerStatistics} from "./src/PlayerStatsUseCase";


export const stats: Handler = async (event: any) => {
  const result = await findPlayerStatistics()
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
}
