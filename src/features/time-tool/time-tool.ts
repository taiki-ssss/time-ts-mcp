import { Result, ok, err } from 'neverthrow';
import debug from 'debug';
import { TimeError, GetCurrentTimeArgs } from './types';

const log = debug('mcp:time-tool');

export async function getCurrentTime(
  args: GetCurrentTimeArgs
): Promise<Result<{ content: Array<{ type: 'text'; text: string }> }, TimeError>> {
  const timezone = args.timezone || 'Asia/Tokyo';
  const format = args.format || 'iso';
  const customFormat = args.customFormat || 'YYYY-MM-DD HH:mm:ss';

  log('getCurrentTime called with timezone=%s, format=%s', timezone, format);

  try {
    const now = new Date();
    let formattedTime: string;

    try {
      new Intl.DateTimeFormat('en-US', { timeZone: timezone });
    } catch (error) {
      log('Invalid timezone: %s', timezone);
      return err({
        type: 'INVALID_TIMEZONE',
        message: `指定されたタイムゾーンは無効です: ${timezone}`
      });
    }

    switch (format) {
      case 'iso':
        const isoDateString = now.toLocaleString('sv-SE', {
          timeZone: timezone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });

        const getTimezoneOffset = (date: Date, tz: string): string => {
          try {
            const formatter = new Intl.DateTimeFormat('en', {
              timeZone: tz,
              timeZoneName: 'shortOffset'
            });
            const parts = formatter.formatToParts(date);
            const offsetPart = parts.find(part => part.type === 'timeZoneName');

            if (offsetPart && offsetPart.value.match(/^[+-]\d{2}:\d{2}$/)) {
              return offsetPart.value;
            }
          } catch (e) {
            // フォールバック処理
          }
          const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
          const tzDate = new Date(date.toLocaleString('en-US', { timeZone: tz }));
          const offsetMinutes = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60);
          const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
          const offsetMins = Math.abs(offsetMinutes) % 60;
          const sign = offsetMinutes >= 0 ? '+' : '-';
          return `${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetMins).padStart(2, '0')}`;
        };

        const offset = getTimezoneOffset(now, timezone);
        formattedTime = `${isoDateString.replace(' ', 'T')}${offset}`;
        break;

      case 'rfc':
        formattedTime = now.toLocaleString('en-US', {
          timeZone: timezone,
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short',
          hour12: false
        });
        break;

      case 'custom':
        const dateInTimezone = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
        formattedTime = customFormat
          .replace('YYYY', dateInTimezone.getFullYear().toString())
          .replace('MM', String(dateInTimezone.getMonth() + 1).padStart(2, '0'))
          .replace('DD', String(dateInTimezone.getDate()).padStart(2, '0'))
          .replace('HH', String(dateInTimezone.getHours()).padStart(2, '0'))
          .replace('mm', String(dateInTimezone.getMinutes()).padStart(2, '0'))
          .replace('ss', String(dateInTimezone.getSeconds()).padStart(2, '0'));
        break;

      default:
        return err({
          type: 'INVALID_FORMAT',
          message: `無効なフォーマットが指定されました: ${format}`
        });
    }

    log('Time formatted successfully: %s', formattedTime);

    return ok({
      content: [
        {
          type: "text" as const,
          text: formattedTime,
        }
      ]
    });
  } catch (error) {
    log('Unexpected error in getCurrentTime: %O', error);
    return err({
      type: 'TIME_ERROR',
      message: `時刻取得中にエラーが発生しました: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
}

export async function getCurrentTimeWrapper(args: GetCurrentTimeArgs) {
  const result = await getCurrentTime(args);

  return result.match(
    (success) => success,
    (error) => {
      log('Get current time tool error: %O', error);
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${error.message}`,
          }
        ],
        isError: true
      };
    }
  );
}