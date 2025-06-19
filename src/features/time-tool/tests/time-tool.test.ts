import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCurrentTime, getCurrentTimeWrapper } from '../time-tool';
import type { GetCurrentTimeArgs } from '../types';

describe('time-tool', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('getCurrentTime', () => {
    it('should return current time in Asia/Tokyo timezone with ISO format by default', async () => {
      const result = await getCurrentTime({});
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.content).toBeDefined();
        expect(result.value.content[0]).toBeDefined();
        expect(result.value.content[0].type).toBe('text');
        expect(result.value.content[0].text).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
      }
    });

    it('should return current time in UTC timezone', async () => {
      const result = await getCurrentTime({ timezone: 'UTC' });
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.content[0].text).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+00:00$/);
      }
    });

    it('should return current time in RFC format', async () => {
      const result = await getCurrentTime({ format: 'rfc' });
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.content[0].text).toMatch(/^\w{3}, \w{3} \d{1,2}, \d{4}, \d{2}:\d{2}:\d{2} GMT[+-]?\d*/);
      }
    });

    it('should return current time in custom format', async () => {
      const result = await getCurrentTime({ 
        format: 'custom', 
        customFormat: 'YYYY-MM-DD' 
      });
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.content[0].text).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });

    it('should use default custom format when custom format is not specified', async () => {
      const result = await getCurrentTime({ format: 'custom' });
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.content[0].text).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
      }
    });

    it('should return current time with combined parameters', async () => {
      const result = await getCurrentTime({ 
        timezone: 'America/New_York',
        format: 'custom',
        customFormat: 'HH:mm:ss'
      });
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.content[0].text).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      }
    });

    it('should return error for invalid timezone', async () => {
      const result = await getCurrentTime({ timezone: 'Invalid/Zone' });
      
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_TIMEZONE');
        expect(result.error.message).toContain('指定されたタイムゾーンは無効です');
      }
    });

    it('should return error for invalid format', async () => {
      const result = await getCurrentTime({ format: 'invalid' as any });
      
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_FORMAT');
        expect(result.error.message).toContain('無効なフォーマットが指定されました');
      }
    });

    it('should handle different timezone formats', async () => {
      const timezones = ['America/New_York', 'America/Los_Angeles', 'GMT', 'Europe/London'];
      
      for (const timezone of timezones) {
        const result = await getCurrentTime({ timezone });
        expect(result.isOk()).toBe(true);
      }
    });

    it('should handle different custom formats', async () => {
      const formats = [
        'YYYY/MM/DD HH:mm',
        'DD-MM-YYYY',
        'HH:mm:ss',
        'YYYY年MM月DD日'
      ];
      
      for (const customFormat of formats) {
        const result = await getCurrentTime({ format: 'custom', customFormat });
        expect(result.isOk()).toBe(true);
      }
    });

    it('should handle timezone offset calculation with fallback', async () => {
      // Mock Intl.DateTimeFormat to trigger fallback
      const originalIntl = global.Intl;
      global.Intl = {
        ...originalIntl,
        DateTimeFormat: class {
          constructor(locale: string, options: any) {
            if (options?.timeZone) {
              return this;
            }
            return new originalIntl.DateTimeFormat(locale, options);
          }
          
          formatToParts() {
            return [
              { type: 'timeZoneName', value: 'invalid-offset' }
            ];
          }
        } as any
      };

      const result = await getCurrentTime({ timezone: 'Asia/Tokyo' });
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.content[0].text).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
      }

      global.Intl = originalIntl;
    });

    it('should handle formatToParts throwing error', async () => {
      const originalIntl = global.Intl;
      global.Intl = {
        ...originalIntl,
        DateTimeFormat: class {
          constructor(locale: string, options: any) {
            if (options?.timeZone) {
              return this;
            }
            return new originalIntl.DateTimeFormat(locale, options);
          }
          
          formatToParts() {
            throw new Error('formatToParts error');
          }
        } as any
      };

      const result = await getCurrentTime({ timezone: 'Asia/Tokyo' });
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.content[0].text).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
      }

      global.Intl = originalIntl;
    });

    it('should use shortOffset when formatToParts returns valid offset', async () => {
      const originalIntl = global.Intl;
      global.Intl = {
        ...originalIntl,
        DateTimeFormat: class {
          constructor(locale: string, options: any) {
            if (options?.timeZone) {
              return this;
            }
            return new originalIntl.DateTimeFormat(locale, options);
          }
          
          formatToParts() {
            return [
              { type: 'timeZoneName', value: '+09:00' }
            ];
          }
        } as any
      };

      const result = await getCurrentTime({ timezone: 'Asia/Tokyo' });
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.content[0].text).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+09:00$/);
      }

      global.Intl = originalIntl;
    });

    it('should handle Date constructor errors', async () => {
      const originalDate = global.Date;
      global.Date = class extends Date {
        constructor(...args: any[]) {
          if (args.length === 0) {
            throw new Error('Date constructor error');
          }
          super(...args);
        }
      } as any;

      const result = await getCurrentTime({});
      
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe('TIME_ERROR');
        expect(result.error.message).toContain('時刻取得中にエラーが発生しました');
      }

      global.Date = originalDate;
    });

    it('should handle unexpected errors', async () => {
      const originalDate = global.Date;
      global.Date = class extends Date {
        toLocaleString() {
          throw new Error('toLocaleString error');
        }
      } as any;

      const result = await getCurrentTime({});
      
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe('TIME_ERROR');
        expect(result.error.message).toContain('時刻取得中にエラーが発生しました');
      }

      global.Date = originalDate;
    });

    it('should handle non-Error objects in catch block', async () => {
      const originalDate = global.Date;
      global.Date = class extends Date {
        constructor(...args: any[]) {
          if (args.length === 0) {
            throw 'String error';
          }
          super(...args);
        }
      } as any;

      const result = await getCurrentTime({});
      
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe('TIME_ERROR');
        expect(result.error.message).toContain('Unknown error');
      }

      global.Date = originalDate;
    });
  });

  describe('getCurrentTimeWrapper', () => {
    it('should return success result from wrapper', async () => {
      const result = await getCurrentTimeWrapper({});
      
      expect(result.content).toBeDefined();
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
      expect('isError' in result).toBe(false);
    });

    it('should return error result from wrapper for invalid timezone', async () => {
      const result = await getCurrentTimeWrapper({ timezone: 'Invalid/Zone' });
      
      expect(result.content[0].text).toContain('Error:');
      expect('isError' in result && result.isError).toBe(true);
    });

    it('should return error result from wrapper for invalid format', async () => {
      const result = await getCurrentTimeWrapper({ format: 'invalid' as any });
      
      expect(result.content[0].text).toContain('Error:');
      expect('isError' in result && result.isError).toBe(true);
    });

    it('should handle all error types in wrapper', async () => {
      const originalDate = global.Date;
      global.Date = class extends Date {
        constructor(...args: any[]) {
          if (args.length === 0) {
            throw new Error('Wrapper test error');
          }
          super(...args);
        }
      } as any;

      const result = await getCurrentTimeWrapper({});
      
      expect(result.content[0].text).toContain('Error:');
      expect('isError' in result && result.isError).toBe(true);

      global.Date = originalDate;
    });
  });
});