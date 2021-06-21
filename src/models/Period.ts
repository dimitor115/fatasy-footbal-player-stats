export enum Period {
  WEEK = 'week',
  MONTH = 'month',
  SEASON = 'season',
}

export function isPeriod(input: string): input is Period {
  return Object.values(Period).includes(input as Period)
}
