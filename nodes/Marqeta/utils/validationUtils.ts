/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Input Validation Utilities for Marqeta API
 */

import { CURRENCY_CODES, type CurrencyCode } from '../constants/transactionTypes';
import { CARD_STATES, USER_STATES, BUSINESS_STATES } from '../constants/cardStates';

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Validate phone number format (E.164 or common formats)
 */
export function isValidPhone(phone: string): boolean {
	// Remove all non-digit characters for validation
	const digits = phone.replace(/\D/g, '');
	// Phone should be between 10 and 15 digits
	return digits.length >= 10 && digits.length <= 15;
}

/**
 * Format phone to E.164 format
 */
export function formatPhoneE164(phone: string, countryCode = '1'): string {
	const digits = phone.replace(/\D/g, '');
	if (digits.startsWith(countryCode)) {
		return `+${digits}`;
	}
	return `+${countryCode}${digits}`;
}

/**
 * Validate date of birth (YYYY-MM-DD format, age >= 18)
 */
export function isValidDateOfBirth(dob: string, minAge = 18): boolean {
	const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
	if (!dateRegex.test(dob)) {
		return false;
	}
	
	const birthDate = new Date(dob);
	const today = new Date();
	
	// Check if date is valid
	if (isNaN(birthDate.getTime())) {
		return false;
	}
	
	// Check minimum age
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();
	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}
	
	return age >= minAge;
}

/**
 * Validate SSN format (XXX-XX-XXXX or 9 digits)
 */
export function isValidSsn(ssn: string): boolean {
	const digits = ssn.replace(/\D/g, '');
	return digits.length === 9;
}

/**
 * Format SSN with dashes
 */
export function formatSsn(ssn: string): string {
	const digits = ssn.replace(/\D/g, '');
	if (digits.length !== 9) {
		return ssn;
	}
	return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}

/**
 * Validate US ZIP code
 */
export function isValidZipCode(zip: string): boolean {
	// 5 digits or 5+4 format
	const zipRegex = /^\d{5}(-\d{4})?$/;
	return zipRegex.test(zip);
}

/**
 * Validate US state code (2 letters)
 */
export function isValidStateCode(state: string): boolean {
	const validStates = [
		'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
		'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
		'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
		'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
		'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
		'DC', 'PR', 'VI', 'GU', 'AS', 'MP',
	];
	return validStates.includes(state.toUpperCase());
}

/**
 * Validate ISO country code (2 letters)
 */
export function isValidCountryCode(country: string): boolean {
	// Common ISO 3166-1 alpha-2 codes
	const validCountries = [
		'US', 'CA', 'GB', 'DE', 'FR', 'ES', 'IT', 'JP', 'AU', 'NZ',
		'MX', 'BR', 'IN', 'CN', 'KR', 'SG', 'HK', 'TW', 'NL', 'BE',
		'CH', 'AT', 'SE', 'NO', 'DK', 'FI', 'IE', 'PT', 'PL', 'CZ',
	];
	return validCountries.includes(country.toUpperCase());
}

/**
 * Validate currency code
 */
export function isValidCurrencyCode(currency: string): boolean {
	return Object.keys(CURRENCY_CODES).includes(currency.toUpperCase() as CurrencyCode);
}

/**
 * Validate monetary amount (positive, proper decimal places)
 */
export function isValidAmount(amount: number, currencyCode: CurrencyCode = 'USD'): boolean {
	if (amount < 0) {
		return false;
	}
	
	const currency = CURRENCY_CODES[currencyCode];
	const decimalPlaces = currency?.decimals ?? 2;
	
	// Check decimal places
	const amountStr = amount.toString();
	const decimalIndex = amountStr.indexOf('.');
	if (decimalIndex !== -1) {
		const actualDecimals = amountStr.length - decimalIndex - 1;
		if (actualDecimals > decimalPlaces) {
			return false;
		}
	}
	
	return true;
}

/**
 * Format amount to proper decimal places for currency
 */
export function formatAmount(amount: number, currencyCode: CurrencyCode = 'USD'): string {
	const currency = CURRENCY_CODES[currencyCode];
	const decimalPlaces = currency?.decimals ?? 2;
	return amount.toFixed(decimalPlaces);
}

/**
 * Validate Marqeta token format
 */
export function isValidToken(token: string): boolean {
	// Marqeta tokens are typically UUIDs or alphanumeric strings
	if (!token || token.length < 1 || token.length > 100) {
		return false;
	}
	// Allow alphanumeric, dashes, and underscores
	const tokenRegex = /^[a-zA-Z0-9_-]+$/;
	return tokenRegex.test(token);
}

/**
 * Validate card state
 */
export function isValidCardState(state: string): boolean {
	return Object.values(CARD_STATES).includes(state as typeof CARD_STATES[keyof typeof CARD_STATES]);
}

/**
 * Validate user state
 */
export function isValidUserState(state: string): boolean {
	return Object.values(USER_STATES).includes(state as typeof USER_STATES[keyof typeof USER_STATES]);
}

/**
 * Validate business state
 */
export function isValidBusinessState(state: string): boolean {
	return Object.values(BUSINESS_STATES).includes(state as typeof BUSINESS_STATES[keyof typeof BUSINESS_STATES]);
}

/**
 * Validate IP address (IPv4 or IPv6)
 */
export function isValidIpAddress(ip: string): boolean {
	// IPv4
	const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
	if (ipv4Regex.test(ip)) {
		const parts = ip.split('.');
		return parts.every(part => parseInt(part, 10) <= 255);
	}
	
	// IPv6 (simplified check)
	const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
	return ipv6Regex.test(ip);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
	try {
		const parsed = new URL(url);
		return ['http:', 'https:'].includes(parsed.protocol);
	} catch {
		return false;
	}
}

/**
 * Validate HTTPS URL (required for webhooks)
 */
export function isValidHttpsUrl(url: string): boolean {
	try {
		const parsed = new URL(url);
		return parsed.protocol === 'https:';
	} catch {
		return false;
	}
}

/**
 * Validate EIN (Employer Identification Number)
 */
export function isValidEin(ein: string): boolean {
	const digits = ein.replace(/\D/g, '');
	return digits.length === 9;
}

/**
 * Format EIN with dash
 */
export function formatEin(ein: string): string {
	const digits = ein.replace(/\D/g, '');
	if (digits.length !== 9) {
		return ein;
	}
	return `${digits.slice(0, 2)}-${digits.slice(2)}`;
}

/**
 * Sanitize string input (remove dangerous characters)
 */
export function sanitizeString(input: string): string {
	return input
		.replace(/[<>]/g, '') // Remove angle brackets
		.replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
		.trim();
}

/**
 * Validate and sanitize object keys/values for API submission
 */
export function sanitizeApiInput(obj: Record<string, unknown>): Record<string, unknown> {
	const sanitized: Record<string, unknown> = {};
	
	for (const [key, value] of Object.entries(obj)) {
		// Skip null/undefined values
		if (value === null || value === undefined) {
			continue;
		}
		
		// Sanitize string values
		if (typeof value === 'string') {
			const sanitizedValue = sanitizeString(value);
			if (sanitizedValue.length > 0) {
				sanitized[key] = sanitizedValue;
			}
		} else if (typeof value === 'object' && !Array.isArray(value)) {
			sanitized[key] = sanitizeApiInput(value as Record<string, unknown>);
		} else if (Array.isArray(value)) {
			sanitized[key] = value.map(item => 
				typeof item === 'string' ? sanitizeString(item) : item
			);
		} else {
			sanitized[key] = value;
		}
	}
	
	return sanitized;
}
