/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Marqeta Card States and Transitions
 */

export const CARD_STATES = {
	UNACTIVATED: 'UNACTIVATED',
	ACTIVE: 'ACTIVE',
	SUSPENDED: 'SUSPENDED',
	TERMINATED: 'TERMINATED',
	LIMITED: 'LIMITED',
} as const;

export type CardState = keyof typeof CARD_STATES;

export const CARD_STATE_OPTIONS = [
	{ name: 'Unactivated', value: 'UNACTIVATED' },
	{ name: 'Active', value: 'ACTIVE' },
	{ name: 'Suspended', value: 'SUSPENDED' },
	{ name: 'Terminated', value: 'TERMINATED' },
	{ name: 'Limited', value: 'LIMITED' },
] as const;

export const CARD_TRANSITION_REASONS = {
	// Activation
	NEW: { code: '00', description: 'New card issued' },
	
	// Suspension reasons
	LOST: { code: '01', description: 'Card lost' },
	STOLEN: { code: '02', description: 'Card stolen' },
	FRAUD: { code: '03', description: 'Suspected fraud' },
	CUSTOMER_REQUEST: { code: '04', description: 'Customer request' },
	ADMIN_REQUEST: { code: '05', description: 'Administrative action' },
	
	// Termination reasons
	EXPIRED: { code: '10', description: 'Card expired' },
	REPLACED: { code: '11', description: 'Card replaced' },
	CLOSED: { code: '12', description: 'Account closed' },
	DAMAGED: { code: '13', description: 'Card damaged' },
	
	// Reactivation
	FOUND: { code: '20', description: 'Card found' },
	FRAUD_CLEARED: { code: '21', description: 'Fraud investigation cleared' },
} as const;

export const CARD_TRANSITION_REASON_OPTIONS = [
	{ name: 'New Card Issued', value: 'NEW' },
	{ name: 'Lost', value: 'LOST' },
	{ name: 'Stolen', value: 'STOLEN' },
	{ name: 'Suspected Fraud', value: 'FRAUD' },
	{ name: 'Customer Request', value: 'CUSTOMER_REQUEST' },
	{ name: 'Administrative Action', value: 'ADMIN_REQUEST' },
	{ name: 'Card Expired', value: 'EXPIRED' },
	{ name: 'Card Replaced', value: 'REPLACED' },
	{ name: 'Account Closed', value: 'CLOSED' },
	{ name: 'Card Damaged', value: 'DAMAGED' },
	{ name: 'Card Found', value: 'FOUND' },
	{ name: 'Fraud Investigation Cleared', value: 'FRAUD_CLEARED' },
] as const;

export const VALID_CARD_TRANSITIONS: Record<string, string[]> = {
	UNACTIVATED: ['ACTIVE', 'SUSPENDED', 'TERMINATED'],
	ACTIVE: ['SUSPENDED', 'TERMINATED', 'LIMITED'],
	SUSPENDED: ['ACTIVE', 'TERMINATED'],
	LIMITED: ['ACTIVE', 'SUSPENDED', 'TERMINATED'],
	TERMINATED: [], // Terminal state
};

export const USER_STATES = {
	UNVERIFIED: 'UNVERIFIED',
	LIMITED: 'LIMITED',
	ACTIVE: 'ACTIVE',
	SUSPENDED: 'SUSPENDED',
	CLOSED: 'CLOSED',
} as const;

export type UserState = keyof typeof USER_STATES;

export const USER_STATE_OPTIONS = [
	{ name: 'Unverified', value: 'UNVERIFIED' },
	{ name: 'Limited', value: 'LIMITED' },
	{ name: 'Active', value: 'ACTIVE' },
	{ name: 'Suspended', value: 'SUSPENDED' },
	{ name: 'Closed', value: 'CLOSED' },
] as const;

export const BUSINESS_STATES = {
	UNVERIFIED: 'UNVERIFIED',
	LIMITED: 'LIMITED',
	ACTIVE: 'ACTIVE',
	SUSPENDED: 'SUSPENDED',
	CLOSED: 'CLOSED',
} as const;

export type BusinessState = keyof typeof BUSINESS_STATES;

export const BUSINESS_STATE_OPTIONS = [
	{ name: 'Unverified', value: 'UNVERIFIED' },
	{ name: 'Limited', value: 'LIMITED' },
	{ name: 'Active', value: 'ACTIVE' },
	{ name: 'Suspended', value: 'SUSPENDED' },
	{ name: 'Closed', value: 'CLOSED' },
] as const;

export const DIGITAL_WALLET_TOKEN_STATES = {
	REQUESTED: 'REQUESTED',
	REQUEST_DECLINED: 'REQUEST_DECLINED',
	ACTIVE: 'ACTIVE',
	SUSPENDED: 'SUSPENDED',
	TERMINATED: 'TERMINATED',
} as const;

export type DigitalWalletTokenState = keyof typeof DIGITAL_WALLET_TOKEN_STATES;

export const DIGITAL_WALLET_TOKEN_STATE_OPTIONS = [
	{ name: 'Requested', value: 'REQUESTED' },
	{ name: 'Request Declined', value: 'REQUEST_DECLINED' },
	{ name: 'Active', value: 'ACTIVE' },
	{ name: 'Suspended', value: 'SUSPENDED' },
	{ name: 'Terminated', value: 'TERMINATED' },
] as const;

export const DIGITAL_WALLET_PROVIDERS = {
	APPLE_PAY: 'APPLE_PAY',
	GOOGLE_PAY: 'GOOGLE_PAY',
	SAMSUNG_PAY: 'SAMSUNG_PAY',
} as const;

export const DIGITAL_WALLET_PROVIDER_OPTIONS = [
	{ name: 'Apple Pay', value: 'APPLE_PAY' },
	{ name: 'Google Pay', value: 'GOOGLE_PAY' },
	{ name: 'Samsung Pay', value: 'SAMSUNG_PAY' },
] as const;
