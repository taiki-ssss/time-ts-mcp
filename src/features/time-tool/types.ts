export type TimeError = {
  type: 'INVALID_TIMEZONE' | 'INVALID_FORMAT' | 'TIME_ERROR';
  message: string;
};

export interface GetCurrentTimeArgs {
  timezone?: string;
  format?: 'iso' | 'rfc' | 'custom';
  customFormat?: string;
}