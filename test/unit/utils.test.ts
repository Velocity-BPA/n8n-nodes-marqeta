/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	maskPan,
	maskPanWithBin,
	maskCvv,
	maskSsn,
	isValidPan,
	identifyCardNetwork,
	sanitizeForLogging,
} from '../../nodes/Marqeta/utils/pciUtils';

import {
	isValidEmail,
	isValidPhone,
	isValidZipCode,
	isValidAmount,
	isValidToken,
	formatPhoneE164,
} from '../../nodes/Marqeta/utils/validationUtils';

import {
	parseWebhookPayload,
	isTimestampValid,
	categorizeEvent,
} from '../../nodes/Marqeta/utils/webhookUtils';

describe('PCI Utils', () => {
	describe('maskPan', () => {
		it('should mask PAN showing only last 4 digits', () => {
			expect(maskPan('4111111111111111')).toBe('************1111');
		});

		it('should handle short inputs', () => {
			expect(maskPan('123')).toBe('****');
		});

		it('should handle empty input', () => {
			expect(maskPan('')).toBe('****');
		});
	});

	describe('maskPanWithBin', () => {
		it('should show BIN and last 4 digits', () => {
			expect(maskPanWithBin('4111111111111111')).toBe('411111******1111');
		});

		it('should fall back to maskPan for short inputs', () => {
			expect(maskPanWithBin('12345678')).toBe('****5678');
		});
	});

	describe('maskCvv', () => {
		it('should mask CVV completely', () => {
			expect(maskCvv('123')).toBe('***');
			expect(maskCvv('1234')).toBe('****');
		});
	});

	describe('maskSsn', () => {
		it('should show only last 4 digits', () => {
			expect(maskSsn('123456789')).toBe('***-**-6789');
			expect(maskSsn('123-45-6789')).toBe('***-**-6789');
		});

		it('should handle invalid SSN', () => {
			expect(maskSsn('12345')).toBe('***-**-****');
		});
	});

	describe('isValidPan', () => {
		it('should validate correct PANs with Luhn algorithm', () => {
			expect(isValidPan('4111111111111111')).toBe(true);
			expect(isValidPan('5500000000000004')).toBe(true);
		});

		it('should reject invalid PANs', () => {
			expect(isValidPan('4111111111111112')).toBe(false);
			expect(isValidPan('1234')).toBe(false);
		});
	});

	describe('identifyCardNetwork', () => {
		it('should identify Visa', () => {
			expect(identifyCardNetwork('4111111111111111')).toBe('VISA');
		});

		it('should identify Mastercard', () => {
			expect(identifyCardNetwork('5500000000000004')).toBe('MASTERCARD');
		});

		it('should identify Amex', () => {
			expect(identifyCardNetwork('340000000000009')).toBe('AMEX');
		});
	});

	describe('sanitizeForLogging', () => {
		it('should mask sensitive fields', () => {
			const input = {
				user_token: 'abc123',
				pan: '4111111111111111',
				cvv: '123',
				name: 'John Doe',
			};
			const result = sanitizeForLogging(input);
			expect(result.pan).toBe('************1111');
			expect(result.cvv).toBe('***');
			expect(result.name).toBe('John Doe');
		});
	});
});

describe('Validation Utils', () => {
	describe('isValidEmail', () => {
		it('should validate correct emails', () => {
			expect(isValidEmail('test@example.com')).toBe(true);
			expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
		});

		it('should reject invalid emails', () => {
			expect(isValidEmail('notanemail')).toBe(false);
			expect(isValidEmail('@nodomain.com')).toBe(false);
		});
	});

	describe('isValidPhone', () => {
		it('should validate phone numbers', () => {
			expect(isValidPhone('1234567890')).toBe(true);
			expect(isValidPhone('+1-234-567-8901')).toBe(true);
		});

		it('should reject short numbers', () => {
			expect(isValidPhone('123')).toBe(false);
		});
	});

	describe('isValidZipCode', () => {
		it('should validate US ZIP codes', () => {
			expect(isValidZipCode('12345')).toBe(true);
			expect(isValidZipCode('12345-6789')).toBe(true);
		});

		it('should reject invalid formats', () => {
			expect(isValidZipCode('1234')).toBe(false);
			expect(isValidZipCode('ABCDE')).toBe(false);
		});
	});

	describe('isValidAmount', () => {
		it('should validate positive amounts', () => {
			expect(isValidAmount(100)).toBe(true);
			expect(isValidAmount(99.99)).toBe(true);
		});

		it('should reject negative amounts', () => {
			expect(isValidAmount(-10)).toBe(false);
		});
	});

	describe('isValidToken', () => {
		it('should validate alphanumeric tokens', () => {
			expect(isValidToken('abc123')).toBe(true);
			expect(isValidToken('user-token_123')).toBe(true);
		});

		it('should reject invalid tokens', () => {
			expect(isValidToken('')).toBe(false);
		});
	});

	describe('formatPhoneE164', () => {
		it('should format to E.164', () => {
			expect(formatPhoneE164('2345678901')).toBe('+12345678901');
			expect(formatPhoneE164('12345678901')).toBe('+12345678901');
		});
	});
});

describe('Webhook Utils', () => {
	describe('isTimestampValid', () => {
		it('should accept recent timestamps', () => {
			const now = new Date().toISOString();
			expect(isTimestampValid(now)).toBe(true);
		});

		it('should reject old timestamps', () => {
			const old = new Date(Date.now() - 600000).toISOString();
			expect(isTimestampValid(old, 300)).toBe(false);
		});
	});

	describe('categorizeEvent', () => {
		it('should categorize transaction events', () => {
			expect(categorizeEvent('transaction.authorization')).toBe('Transaction');
		});

		it('should categorize card events', () => {
			expect(categorizeEvent('card.created')).toBe('Card');
		});

		it('should categorize user events', () => {
			expect(categorizeEvent('user.created')).toBe('User');
		});
	});

	describe('parseWebhookPayload', () => {
		it('should parse valid JSON payload', () => {
			const payload = JSON.stringify({
				event_type: 'card.created',
				token: 'test123',
				created_time: new Date().toISOString(),
				data: {},
			});
			const result = parseWebhookPayload(payload);
			expect(result.event_type).toBe('card.created');
			expect(result.token).toBe('test123');
		});

		it('should throw on invalid JSON', () => {
			expect(() => parseWebhookPayload('invalid')).toThrow();
		});

		it('should throw on missing event_type', () => {
			expect(() => parseWebhookPayload(JSON.stringify({ token: 'test' }))).toThrow();
		});
	});
});
