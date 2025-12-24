/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Marqeta Transaction Types and Related Constants
 */

export const TRANSACTION_TYPES = {
	// Authorization types
	AUTHORIZATION: 'authorization',
	AUTHORIZATION_ADVICE: 'authorization.advice',
	AUTHORIZATION_CLEARING: 'authorization.clearing',
	AUTHORIZATION_REVERSAL: 'authorization.reversal',
	AUTHORIZATION_INCREMENTAL: 'authorization.incremental',
	
	// Transaction types
	CLEARING: 'clearing',
	REFUND: 'refund',
	ORIGINAL_CREDIT: 'original.credit.authorization',
	ORIGINAL_CREDIT_CLEARING: 'original.credit.authorization.clearing',
	
	// Network types
	NETWORK_LOAD: 'network.load',
	
	// Fee types
	FEE: 'fee',
	
	// Balance types
	BALANCE_INQUIRY: 'balance.inquiry',
	
	// PIN types
	PIN_DEBIT: 'pindebit',
	
	// ATM types
	ATM_WITHDRAWAL: 'atm.withdrawal',
	
	// P2P types
	ACCOUNT_TO_ACCOUNT: 'account.to.account',
} as const;

export type TransactionType = typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES];

export const TRANSACTION_TYPE_OPTIONS = [
	{ name: 'Authorization', value: 'authorization' },
	{ name: 'Authorization Advice', value: 'authorization.advice' },
	{ name: 'Authorization Clearing', value: 'authorization.clearing' },
	{ name: 'Authorization Reversal', value: 'authorization.reversal' },
	{ name: 'Incremental Authorization', value: 'authorization.incremental' },
	{ name: 'Clearing', value: 'clearing' },
	{ name: 'Refund', value: 'refund' },
	{ name: 'Original Credit', value: 'original.credit.authorization' },
	{ name: 'Network Load', value: 'network.load' },
	{ name: 'Fee', value: 'fee' },
	{ name: 'Balance Inquiry', value: 'balance.inquiry' },
	{ name: 'PIN Debit', value: 'pindebit' },
	{ name: 'ATM Withdrawal', value: 'atm.withdrawal' },
	{ name: 'Account to Account', value: 'account.to.account' },
] as const;

export const TRANSACTION_STATES = {
	PENDING: 'PENDING',
	CLEARED: 'CLEARED',
	COMPLETION: 'COMPLETION',
	DECLINED: 'DECLINED',
	ERROR: 'ERROR',
	ALL: 'ALL',
} as const;

export type TransactionState = keyof typeof TRANSACTION_STATES;

export const TRANSACTION_STATE_OPTIONS = [
	{ name: 'Pending', value: 'PENDING' },
	{ name: 'Cleared', value: 'CLEARED' },
	{ name: 'Completion', value: 'COMPLETION' },
	{ name: 'Declined', value: 'DECLINED' },
	{ name: 'Error', value: 'ERROR' },
	{ name: 'All', value: 'ALL' },
] as const;

export const RESPONSE_CODES = {
	// Approval codes
	'0000': 'Approved',
	'1000': 'Approved (partial)',
	
	// Decline codes - General
	'0100': 'Decline - general',
	'0110': 'Decline - insufficient funds',
	'0120': 'Decline - amount limit exceeded',
	'0121': 'Decline - spending limit exceeded',
	'0122': 'Decline - velocity limit exceeded',
	'0130': 'Decline - card not active',
	'0140': 'Decline - card expired',
	'0150': 'Decline - invalid card number',
	'0160': 'Decline - merchant not allowed',
	'0170': 'Decline - MCC not allowed',
	
	// Decline codes - Security
	'0200': 'Decline - suspected fraud',
	'0210': 'Decline - invalid CVV',
	'0220': 'Decline - invalid PIN',
	'0230': 'Decline - PIN tries exceeded',
	'0240': 'Decline - AVS mismatch',
	
	// Error codes
	'0300': 'Error - card not found',
	'0310': 'Error - user not found',
	'0320': 'Error - business not found',
	'0330': 'Error - system error',
	
	// Special codes
	'0400': 'Decline - lost or stolen',
	'0410': 'Pickup card',
	'0420': 'Decline - do not honor',
} as const;

export const DECLINE_REASON_OPTIONS = [
	{ name: 'General Decline', value: '0100' },
	{ name: 'Insufficient Funds', value: '0110' },
	{ name: 'Amount Limit Exceeded', value: '0120' },
	{ name: 'Spending Limit Exceeded', value: '0121' },
	{ name: 'Velocity Limit Exceeded', value: '0122' },
	{ name: 'Card Not Active', value: '0130' },
	{ name: 'Card Expired', value: '0140' },
	{ name: 'Invalid Card Number', value: '0150' },
	{ name: 'Merchant Not Allowed', value: '0160' },
	{ name: 'MCC Not Allowed', value: '0170' },
	{ name: 'Suspected Fraud', value: '0200' },
	{ name: 'Invalid CVV', value: '0210' },
	{ name: 'Invalid PIN', value: '0220' },
	{ name: 'PIN Tries Exceeded', value: '0230' },
	{ name: 'AVS Mismatch', value: '0240' },
	{ name: 'Lost or Stolen', value: '0400' },
	{ name: 'Do Not Honor', value: '0420' },
] as const;

export const CURRENCY_CODES = {
	USD: { code: 'USD', name: 'US Dollar', symbol: '$', decimals: 2 },
	EUR: { code: 'EUR', name: 'Euro', symbol: '€', decimals: 2 },
	GBP: { code: 'GBP', name: 'British Pound', symbol: '£', decimals: 2 },
	CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', decimals: 2 },
	AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', decimals: 2 },
	JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', decimals: 0 },
	CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', decimals: 2 },
	MXN: { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', decimals: 2 },
	BRL: { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', decimals: 2 },
	INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', decimals: 2 },
} as const;

export type CurrencyCode = keyof typeof CURRENCY_CODES;

export const CURRENCY_OPTIONS = Object.entries(CURRENCY_CODES).map(([code, details]) => ({
	name: `${details.name} (${code})`,
	value: code,
}));

export const POI_TYPES = {
	CARD_PRESENT: 'CARD_PRESENT',
	CARD_NOT_PRESENT: 'CARD_NOT_PRESENT',
	ECOMMERCE: 'ECOMMERCE',
	MOTO: 'MOTO',
	ATM: 'ATM',
	RECURRING: 'RECURRING',
	INSTALLMENT: 'INSTALLMENT',
} as const;

export type PoiType = keyof typeof POI_TYPES;

export const POI_TYPE_OPTIONS = [
	{ name: 'Card Present', value: 'CARD_PRESENT' },
	{ name: 'Card Not Present', value: 'CARD_NOT_PRESENT' },
	{ name: 'E-Commerce', value: 'ECOMMERCE' },
	{ name: 'Mail Order / Telephone Order', value: 'MOTO' },
	{ name: 'ATM', value: 'ATM' },
	{ name: 'Recurring', value: 'RECURRING' },
	{ name: 'Installment', value: 'INSTALLMENT' },
] as const;
