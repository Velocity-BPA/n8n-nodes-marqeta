/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * PCI-DSS Compliance Utilities
 * 
 * These utilities help ensure PCI-compliant handling of sensitive card data.
 * IMPORTANT: Never log, store, or transmit full PAN, CVV, or PIN values.
 */

/**
 * Mask a PAN (Primary Account Number) for safe display/logging
 * Shows only the last 4 digits
 */
export function maskPan(pan: string): string {
	if (!pan || pan.length < 4) {
		return '****';
	}
	const lastFour = pan.slice(-4);
	const masked = '*'.repeat(pan.length - 4);
	return `${masked}${lastFour}`;
}

/**
 * Mask a PAN showing first 6 (BIN) and last 4 digits
 * Standard display format for card numbers
 */
export function maskPanWithBin(pan: string): string {
	if (!pan || pan.length < 10) {
		return maskPan(pan);
	}
	const bin = pan.slice(0, 6);
	const lastFour = pan.slice(-4);
	const masked = '*'.repeat(pan.length - 10);
	return `${bin}${masked}${lastFour}`;
}

/**
 * Format a masked PAN with spaces for display
 */
export function formatMaskedPan(maskedPan: string): string {
	return maskedPan.replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Validate PAN format (basic Luhn check)
 */
export function isValidPan(pan: string): boolean {
	const digits = pan.replace(/\D/g, '');
	
	if (digits.length < 13 || digits.length > 19) {
		return false;
	}
	
	// Luhn algorithm
	let sum = 0;
	let isEven = false;
	
	for (let i = digits.length - 1; i >= 0; i--) {
		let digit = parseInt(digits[i], 10);
		
		if (isEven) {
			digit *= 2;
			if (digit > 9) {
				digit -= 9;
			}
		}
		
		sum += digit;
		isEven = !isEven;
	}
	
	return sum % 10 === 0;
}

/**
 * Mask CVV/CVC for logging (should never store or log actual CVV)
 */
export function maskCvv(cvv: string): string {
	if (!cvv) {
		return '***';
	}
	return '*'.repeat(cvv.length);
}

/**
 * Mask PIN for logging (should never store or log actual PIN)
 */
export function maskPin(pin: string): string {
	if (!pin) {
		return '****';
	}
	return '*'.repeat(pin.length);
}

/**
 * Mask SSN for safe display (show last 4 only)
 */
export function maskSsn(ssn: string): string {
	if (!ssn) {
		return '***-**-****';
	}
	const digits = ssn.replace(/\D/g, '');
	if (digits.length !== 9) {
		return '***-**-****';
	}
	return `***-**-${digits.slice(-4)}`;
}

/**
 * Mask email address for safe display
 */
export function maskEmail(email: string): string {
	if (!email || !email.includes('@')) {
		return '***@***.***';
	}
	const [local, domain] = email.split('@');
	const maskedLocal = local.length > 2 
		? `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}`
		: '**';
	return `${maskedLocal}@${domain}`;
}

/**
 * Mask phone number for safe display
 */
export function maskPhone(phone: string): string {
	if (!phone) {
		return '***-***-****';
	}
	const digits = phone.replace(/\D/g, '');
	if (digits.length < 4) {
		return '***-***-****';
	}
	return `***-***-${digits.slice(-4)}`;
}

/**
 * Sanitize an object for logging by masking sensitive fields
 */
export function sanitizeForLogging(obj: Record<string, unknown>): Record<string, unknown> {
	const sensitiveFields = [
		'pan', 'card_number', 'cardNumber', 'account_number', 'accountNumber',
		'cvv', 'cvv2', 'cvc', 'cvc2', 'security_code', 'securityCode',
		'pin', 'pin_block', 'pinBlock',
		'ssn', 'social_security_number', 'socialSecurityNumber',
		'password', 'secret', 'token', 'access_token', 'accessToken',
	];
	
	const sanitized: Record<string, unknown> = {};
	
	for (const [key, value] of Object.entries(obj)) {
		const lowerKey = key.toLowerCase();
		
		if (sensitiveFields.some(field => lowerKey.includes(field.toLowerCase()))) {
			if (typeof value === 'string') {
				if (lowerKey.includes('pan') || lowerKey.includes('card') || lowerKey.includes('account')) {
					sanitized[key] = maskPan(value);
				} else if (lowerKey.includes('cvv') || lowerKey.includes('cvc') || lowerKey.includes('security')) {
					sanitized[key] = maskCvv(value);
				} else if (lowerKey.includes('pin')) {
					sanitized[key] = maskPin(value);
				} else if (lowerKey.includes('ssn') || lowerKey.includes('social')) {
					sanitized[key] = maskSsn(value);
				} else {
					sanitized[key] = '***REDACTED***';
				}
			} else {
				sanitized[key] = '***REDACTED***';
			}
		} else if (typeof value === 'object' && value !== null) {
			sanitized[key] = sanitizeForLogging(value as Record<string, unknown>);
		} else {
			sanitized[key] = value;
		}
	}
	
	return sanitized;
}

/**
 * Extract BIN (Bank Identification Number) from PAN
 */
export function extractBin(pan: string): string {
	const digits = pan.replace(/\D/g, '');
	return digits.slice(0, 6);
}

/**
 * Identify card network from BIN
 */
export function identifyCardNetwork(pan: string): string {
	const bin = extractBin(pan);
	const firstDigit = bin[0];
	const firstTwo = bin.slice(0, 2);
	const firstFour = bin.slice(0, 4);
	
	// Visa
	if (firstDigit === '4') {
		return 'VISA';
	}
	
	// Mastercard
	if (['51', '52', '53', '54', '55'].includes(firstTwo) ||
		(parseInt(firstFour, 10) >= 2221 && parseInt(firstFour, 10) <= 2720)) {
		return 'MASTERCARD';
	}
	
	// American Express
	if (['34', '37'].includes(firstTwo)) {
		return 'AMEX';
	}
	
	// Discover
	if (firstFour === '6011' || firstTwo === '65' ||
		(parseInt(bin.slice(0, 6), 10) >= 622126 && parseInt(bin.slice(0, 6), 10) <= 622925)) {
		return 'DISCOVER';
	}
	
	// JCB
	if (parseInt(firstFour, 10) >= 3528 && parseInt(firstFour, 10) <= 3589) {
		return 'JCB';
	}
	
	return 'UNKNOWN';
}
