import { describe, it, expect } from 'vitest';
import { createStdioServer, getCurrentTimeTool, getCurrentTimeToolWrapper } from '../server';

describe('server', () => {
  describe('createStdioServer', () => {
    it('should create a McpServer instance', () => {
      const server = createStdioServer();
      
      expect(server).toBeDefined();
      expect(typeof server.connect).toBe('function');
      expect(typeof server.close).toBe('function');
      expect(typeof server.tool).toBe('function');
    });
  });

  describe('getCurrentTime', () => {
    it('should return current time in Asia/Tokyo timezone with ISO format by default', async () => {
      const result = await getCurrentTimeTool({});
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.content).toBeDefined();
        expect(result.value.content[0]).toBeDefined();
        expect(result.value.content[0].type).toBe('text');
        expect(result.value.content[0].text).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+09:00$/);
      }
    });

    it('should return current time in UTC timezone', async () => {
      const result = await getCurrentTimeTool({ timezone: 'UTC' });
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.content[0].text).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+00:00$/);
      }
    });

    it('should return current time in RFC format', async () => {
      const result = await getCurrentTimeTool({ format: 'rfc' });
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.content[0].text).toMatch(/^\w{3},\s*\w{3}\s*\d{1,2},\s*\d{4},\s*\d{1,2}:\d{2}:\d{2}\s*GMT[+-]?\d*/);
      }
    });

    it('should return current time in custom format', async () => {
      const result = await getCurrentTimeTool({ 
        format: 'custom', 
        customFormat: 'YYYY-MM-DD' 
      });
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.content[0].text).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });

    it('should return current time with combined parameters', async () => {
      const result = await getCurrentTimeTool({ 
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
      const result = await getCurrentTimeTool({ timezone: 'Invalid/Zone' });
      
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_TIMEZONE');
        expect(result.error.message).toContain('指定されたタイムゾーンは無効です');
      }
    });

    it('should return error for invalid format', async () => {
      const result = await getCurrentTimeTool({ format: 'invalid' as any });
      
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_FORMAT');
        expect(result.error.message).toContain('無効なフォーマットが指定されました');
      }
    });

    it('should use default custom format when custom format is not specified', async () => {
      const result = await getCurrentTimeTool({ format: 'custom' });
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.content[0].text).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
      }
    });

    it('should work with empty parameters object', async () => {
      const result = await getCurrentTimeTool({});
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.content[0].text).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+09:00$/);
      }
    });
  });

  describe('getCurrentTimeToolWrapper', () => {
    it('should return success result from wrapper', async () => {
      const result = await getCurrentTimeToolWrapper({});
      
      expect(result.content).toBeDefined();
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+09:00$/);
      expect('isError' in result).toBe(false);
    });

    it('should return error result from wrapper for invalid timezone', async () => {
      const result = await getCurrentTimeToolWrapper({ timezone: 'Invalid/Zone' });
      
      expect(result.content[0].text).toContain('Error:');
      expect('isError' in result && result.isError).toBe(true);
    });

    it('should return error result from wrapper for invalid format', async () => {
      const result = await getCurrentTimeToolWrapper({ format: 'invalid' as any });
      
      expect(result.content[0].text).toContain('Error:');
      expect('isError' in result && result.isError).toBe(true);
    });
  });

  describe('Server Integration', () => {
    it('should have proper server structure', () => {
      const server = createStdioServer();
      
      expect(typeof server.connect).toBe('function');
      expect(typeof server.close).toBe('function');
      expect(typeof server.tool).toBe('function');
    });

    it('should start in disconnected state', () => {
      const server = createStdioServer();
      
      expect(server.isConnected()).toBe(false);
    });
  });

  describe('Additional Format Tests', () => {
    it('should handle different timezone formats', async () => {
      // Test EST timezone
      const result1 = await getCurrentTimeTool({ timezone: 'America/New_York' });
      expect(result1.isOk()).toBe(true);
      
      // Test PST timezone
      const result2 = await getCurrentTimeTool({ timezone: 'America/Los_Angeles' });
      expect(result2.isOk()).toBe(true);
      
      // Test GMT timezone
      const result3 = await getCurrentTimeTool({ timezone: 'GMT' });
      expect(result3.isOk()).toBe(true);
    });

    it('should handle different custom formats', async () => {
      const result1 = await getCurrentTimeTool({ 
        format: 'custom', 
        customFormat: 'YYYY/MM/DD HH:mm' 
      });
      expect(result1.isOk()).toBe(true);
      if (result1.isOk()) {
        expect(result1.value.content[0].text).toMatch(/^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}$/);
      }

      const result2 = await getCurrentTimeTool({ 
        format: 'custom', 
        customFormat: 'DD-MM-YYYY' 
      });
      expect(result2.isOk()).toBe(true);
      if (result2.isOk()) {
        expect(result2.value.content[0].text).toMatch(/^\d{2}-\d{2}-\d{4}$/);
      }
    });
  });

  describe('Error Handling Edge Cases', () => {
    it('should handle Date constructor errors gracefully', async () => {
      // Mock Date constructor to throw an error
      const originalDate = global.Date;
      global.Date = class extends Date {
        constructor(...args: any[]) {
          if (args.length === 0) {
            throw new Error('Mock Date error');
          }
          super(...args);
        }
      } as any;

      const result = await getCurrentTimeTool({});
      
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe('TIME_ERROR');
        expect(result.error.message).toContain('時刻取得中にエラーが発生しました');
      }

      // Restore original Date
      global.Date = originalDate;
    });

    it('should handle timezone offset calculation edge cases', async () => {
      // Test with a timezone that might trigger fallback offset calculation
      const result = await getCurrentTimeTool({ timezone: 'Pacific/Marquesas' });
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.content[0].text).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
      }
    });

    it('should handle formatToParts errors for timezone offset', async () => {
      // Mock Intl.DateTimeFormat to cause formatToParts to fail but constructor to succeed
      const originalIntl = global.Intl;
      global.Intl = {
        ...originalIntl,
        DateTimeFormat: class {
          constructor(locale: string, options: any) {
            if (options?.timeZone) {
              // Constructor succeeds for timezone validation
              return this;
            }
            return new originalIntl.DateTimeFormat(locale, options);
          }
          
          formatToParts() {
            throw new Error('formatToParts mock error');
          }
        } as any
      };

      const result = await getCurrentTimeTool({ timezone: 'Asia/Tokyo' });
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        // Should fall back to dynamic offset calculation
        expect(result.value.content[0].text).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
      }

      // Restore original Intl
      global.Intl = originalIntl;
    });

    it('should use shortOffset when formatToParts succeeds with valid offset', async () => {
      // Mock Intl.DateTimeFormat to return a valid shortOffset
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
              { type: 'month', value: '06' },
              { type: 'literal', value: '/' },
              { type: 'day', value: '18' },
              { type: 'literal', value: '/' },
              { type: 'year', value: '2025' },
              { type: 'literal', value: ', ' },
              { type: 'hour', value: '15' },
              { type: 'literal', value: ':' },
              { type: 'minute', value: '30' },
              { type: 'literal', value: ':' },
              { type: 'second', value: '45' },
              { type: 'literal', value: ' ' },
              { type: 'timeZoneName', value: '+09:00' }
            ];
          }
        } as any
      };

      const result = await getCurrentTimeTool({ timezone: 'Asia/Tokyo' });
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        // Should use the shortOffset from formatToParts
        expect(result.value.content[0].text).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+09:00$/);
      }

      // Restore original Intl
      global.Intl = originalIntl;
    });
  });
});