/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Marqeta API Error Codes and Messages
 */

export const MARQETA_ERROR_CODES: Record<string, { message: string; resolution: string }> = {
	// Authentication Errors (400100-400199)
	'400100': {
		message: 'Invalid credentials',
		resolution: 'Verify your Application Token and Admin Access Token are correct',
	},
	'400101': {
		message: 'Token expired',
		resolution: 'Regenerate your API credentials in the Marqeta Dashboard',
	},
	'400102': {
		message: 'Insufficient permissions',
		resolution: 'Ensure your API key has the required permissions for this operation',
	},
	
	// User Errors (400200-400299)
	'400200': {
		message: 'User not found',
		resolution: 'Verify the user token is correct',
	},
	'400201': {
		message: 'User already exists',
		resolution: 'A user with this identifier already exists. Use a different token.',
	},
	'400202': {
		message: 'Invalid user state transition',
		resolution: 'Check the current user state and valid transition states',
	},
	'400203': {
		message: 'User KYC required',
		resolution: 'Complete KYC verification before performing this operation',
	},
	
	// Card Errors (400300-400399)
	'400300': {
		message: 'Card not found',
		resolution: 'Verify the card token is correct',
	},
	'400301': {
		message: 'Card already active',
		resolution: 'This card has already been activated',
	},
	'400302': {
		message: 'Card terminated',
		resolution: 'This card has been terminated and cannot be used',
	},
	'400303': {
		message: 'Card suspended',
		resolution: 'This card is suspended. Reactivate before use.',
	},
	'400304': {
		message: 'Invalid card product',
		resolution: 'Verify the card product token is valid for your program',
	},
	'400305': {
		message: 'Card creation limit reached',
		resolution: 'Maximum cards per user limit reached. Contact support.',
	},
	
	// Transaction Errors (400400-400499)
	'400400': {
		message: 'Transaction not found',
		resolution: 'Verify the transaction token is correct',
	},
	'400401': {
		message: 'Insufficient funds',
		resolution: 'The GPA balance is insufficient for this transaction',
	},
	'400402': {
		message: 'Velocity limit exceeded',
		resolution: 'Transaction exceeds velocity control limits',
	},
	'400403': {
		message: 'MCC blocked',
		resolution: 'This merchant category is blocked by authorization controls',
	},
	'400404': {
		message: 'Transaction declined',
		resolution: 'Transaction was declined. Check response code for details.',
	},
	
	// Funding Errors (400500-400599)
	'400500': {
		message: 'Funding source not found',
		resolution: 'Verify the funding source token is correct',
	},
	'400501': {
		message: 'Invalid funding amount',
		resolution: 'Amount must be positive and within allowed limits',
	},
	'400502': {
		message: 'Funding source inactive',
		resolution: 'This funding source is not active',
	},
	'400503': {
		message: 'ACH verification required',
		resolution: 'Complete ACH micro-deposit verification first',
	},
	
	// KYC Errors (400600-400699)
	'400600': {
		message: 'KYC check failed',
		resolution: 'User did not pass identity verification',
	},
	'400601': {
		message: 'KYC already completed',
		resolution: 'KYC has already been performed for this user',
	},
	'400602': {
		message: 'Invalid identity document',
		resolution: 'Provide a valid identity document',
	},
	
	// Business Errors (400700-400799)
	'400700': {
		message: 'Business not found',
		resolution: 'Verify the business token is correct',
	},
	'400701': {
		message: 'Business already exists',
		resolution: 'A business with this identifier already exists',
	},
	
	// Velocity Control Errors (400800-400899)
	'400800': {
		message: 'Velocity control not found',
		resolution: 'Verify the velocity control token is correct',
	},
	'400801': {
		message: 'Invalid velocity window',
		resolution: 'Velocity window must be DAY, WEEK, MONTH, or LIFETIME',
	},
	'400802': {
		message: 'Conflicting velocity controls',
		resolution: 'This control conflicts with an existing control',
	},
	
	// Digital Wallet Errors (400900-400999)
	'400900': {
		message: 'Digital wallet token not found',
		resolution: 'Verify the digital wallet token is correct',
	},
	'400901': {
		message: 'Provisioning failed',
		resolution: 'Card could not be provisioned to the digital wallet',
	},
	'400902': {
		message: 'Wallet provider error',
		resolution: 'Error from Apple Pay, Google Pay, or Samsung Pay',
	},
	
	// Webhook Errors (401000-401099)
	'401000': {
		message: 'Webhook not found',
		resolution: 'Verify the webhook token is correct',
	},
	'401001': {
		message: 'Invalid webhook URL',
		resolution: 'Webhook endpoint must be a valid HTTPS URL',
	},
	'401002': {
		message: 'Webhook delivery failed',
		resolution: 'Check that your webhook endpoint is accessible',
	},
	
	// Rate Limiting
	'429000': {
		message: 'Rate limit exceeded',
		resolution: 'Too many requests. Implement exponential backoff.',
	},
	
	// Server Errors
	'500000': {
		message: 'Internal server error',
		resolution: 'Retry the request. If persistent, contact Marqeta support.',
	},
	'503000': {
		message: 'Service unavailable',
		resolution: 'Marqeta API is temporarily unavailable. Retry later.',
	},
};

export const HTTP_STATUS_MESSAGES: Record<number, string> = {
	200: 'Success',
	201: 'Created',
	204: 'No Content',
	400: 'Bad Request - Invalid parameters',
	401: 'Unauthorized - Invalid credentials',
	403: 'Forbidden - Insufficient permissions',
	404: 'Not Found - Resource does not exist',
	409: 'Conflict - Resource already exists',
	422: 'Unprocessable Entity - Validation failed',
	429: 'Too Many Requests - Rate limit exceeded',
	500: 'Internal Server Error',
	502: 'Bad Gateway',
	503: 'Service Unavailable',
	504: 'Gateway Timeout',
};

export function getErrorMessage(code: string): string {
	const error = MARQETA_ERROR_CODES[code];
	return error ? error.message : 'Unknown error';
}

export function getErrorResolution(code: string): string {
	const error = MARQETA_ERROR_CODES[code];
	return error ? error.resolution : 'Contact Marqeta support for assistance';
}

export function formatMarqetaError(
	statusCode: number,
	errorCode?: string,
	message?: string,
): string {
	const httpMessage = HTTP_STATUS_MESSAGES[statusCode] || 'Unknown HTTP error';
	
	if (errorCode && MARQETA_ERROR_CODES[errorCode]) {
		const error = MARQETA_ERROR_CODES[errorCode];
		return `${error.message}. ${error.resolution}`;
	}
	
	if (message) {
		return `${httpMessage}: ${message}`;
	}
	
	return httpMessage;
}
