import { describe, it, expect } from 'vitest';
import type { TimeError, GetCurrentTimeArgs } from '../types';

describe('types', () => {
  describe('TimeError', () => {
    it('should have correct structure for INVALID_TIMEZONE error', () => {
      const error: TimeError = {
        type: 'INVALID_TIMEZONE',
        message: 'Invalid timezone specified'
      };

      expect(error.type).toBe('INVALID_TIMEZONE');
      expect(error.message).toBe('Invalid timezone specified');
    });

    it('should have correct structure for INVALID_FORMAT error', () => {
      const error: TimeError = {
        type: 'INVALID_FORMAT',
        message: 'Invalid format specified'
      };

      expect(error.type).toBe('INVALID_FORMAT');
      expect(error.message).toBe('Invalid format specified');
    });

    it('should have correct structure for TIME_ERROR error', () => {
      const error: TimeError = {
        type: 'TIME_ERROR',
        message: 'Time retrieval error'
      };

      expect(error.type).toBe('TIME_ERROR');
      expect(error.message).toBe('Time retrieval error');
    });
  });

  describe('GetCurrentTimeArgs', () => {
    it('should work with empty args', () => {
      const args: GetCurrentTimeArgs = {};
      
      expect(args).toBeDefined();
      expect(args.timezone).toBeUndefined();
      expect(args.format).toBeUndefined();
      expect(args.customFormat).toBeUndefined();
    });

    it('should work with timezone only', () => {
      const args: GetCurrentTimeArgs = {
        timezone: 'America/New_York'
      };
      
      expect(args.timezone).toBe('America/New_York');
      expect(args.format).toBeUndefined();
      expect(args.customFormat).toBeUndefined();
    });

    it('should work with format only', () => {
      const args: GetCurrentTimeArgs = {
        format: 'iso'
      };
      
      expect(args.timezone).toBeUndefined();
      expect(args.format).toBe('iso');
      expect(args.customFormat).toBeUndefined();
    });

    it('should work with all properties', () => {
      const args: GetCurrentTimeArgs = {
        timezone: 'Asia/Tokyo',
        format: 'custom',
        customFormat: 'YYYY-MM-DD HH:mm:ss'
      };
      
      expect(args.timezone).toBe('Asia/Tokyo');
      expect(args.format).toBe('custom');
      expect(args.customFormat).toBe('YYYY-MM-DD HH:mm:ss');
    });

    it('should accept iso format', () => {
      const args: GetCurrentTimeArgs = {
        format: 'iso'
      };
      
      expect(args.format).toBe('iso');
    });

    it('should accept rfc format', () => {
      const args: GetCurrentTimeArgs = {
        format: 'rfc'
      };
      
      expect(args.format).toBe('rfc');
    });

    it('should accept custom format', () => {
      const args: GetCurrentTimeArgs = {
        format: 'custom'
      };
      
      expect(args.format).toBe('custom');
    });

    it('should work with customFormat when format is custom', () => {
      const args: GetCurrentTimeArgs = {
        format: 'custom',
        customFormat: 'DD/MM/YYYY'
      };
      
      expect(args.format).toBe('custom');
      expect(args.customFormat).toBe('DD/MM/YYYY');
    });
  });
});