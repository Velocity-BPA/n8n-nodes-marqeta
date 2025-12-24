/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import * as crypto from 'crypto';
import { WEBHOOK_EVENTS, type WebhookEventType } from '../constants/endpoints';

/**
 * Webhook Signature Verification and Event Handling Utilities
 */

export interface WebhookPayload {
	event_type: string;
	created_time: string;
	token: string;
	user_token?: string;
	card_token?: string;
	business_token?: string;
	transaction_token?: string;
	data: Record<string, unknown>;
}

export interface WebhookHeaders {
	'x-marqeta-signature'?: string;
	'x-marqeta-timestamp'?: string;
	'content-type'?: string;
}

/**
 * Verify webhook signature from Marqeta
 * Marqeta uses HMAC-SHA256 for webhook signatures
 */
export function verifyWebhookSignature(
	payload: string,
	signature: string,
	signatureKey: string,
	timestamp?: string,
): boolean {
	if (!signatureKey) {
		// If no signature key configured, skip verification
		return true;
	}
	
	try {
		// Marqeta signature format: timestamp.payload
		const signedPayload = timestamp ? `${timestamp}.${payload}` : payload;
		
		const expectedSignature = crypto
			.createHmac('sha256', signatureKey)
			.update(signedPayload)
			.digest('hex');
		
		// Compare signatures using timing-safe comparison
		return crypto.timingSafeEqual(
			Buffer.from(signature),
			Buffer.from(expectedSignature),
		);
	} catch {
		return false;
	}
}

/**
 * Parse and validate webhook payload
 */
export function parseWebhookPayload(body: string | Buffer): WebhookPayload {
	const payload = typeof body === 'string' ? body : body.toString('utf-8');
	
	try {
		const parsed = JSON.parse(payload) as WebhookPayload;
		
		if (!parsed.event_type) {
			throw new Error('Missing event_type in webhook payload');
		}
		
		return parsed;
	} catch (error) {
		throw new Error(`Failed to parse webhook payload: ${(error as Error).message}`);
	}
}

/**
 * Get human-readable description for webhook event type
 */
export function getEventDescription(eventType: string): string {
	return WEBHOOK_EVENTS[eventType as WebhookEventType] || 'Unknown event type';
}

/**
 * Categorize webhook event into broader categories
 */
export function categorizeEvent(eventType: string): string {
	const prefix = eventType.split('.')[0];
	
	const categories: Record<string, string> = {
		transaction: 'Transaction',
		card: 'Card',
		user: 'User',
		gpa: 'Funding',
		ach: 'Funding',
		directdeposit: 'Funding',
		fundingsource: 'Funding',
		digitalwallet: 'Digital Wallet',
		dispute: 'Dispute',
		chargeback: 'Dispute',
		business: 'Business',
		velocity: 'Velocity',
		commandomode: 'Commando Mode',
	};
	
	return categories[prefix] || 'Other';
}

/**
 * Check if event should trigger specific handlers
 */
export function shouldTrigger(eventType: string, subscribedEvents: string[]): boolean {
	if (subscribedEvents.includes('*') || subscribedEvents.includes('all')) {
		return true;
	}
	
	// Check exact match
	if (subscribedEvents.includes(eventType)) {
		return true;
	}
	
	// Check wildcard matches (e.g., 'transaction.*' matches 'transaction.authorization')
	const eventPrefix = eventType.split('.')[0];
	return subscribedEvents.some(sub => {
		if (sub.endsWith('.*')) {
			const subPrefix = sub.slice(0, -2);
			return eventPrefix === subPrefix;
		}
		return false;
	});
}

/**
 * Extract key tokens from webhook payload for routing
 */
export function extractRoutingTokens(payload: WebhookPayload): {
	userToken?: string;
	cardToken?: string;
	businessToken?: string;
	transactionToken?: string;
} {
	return {
		userToken: payload.user_token || (payload.data?.user_token as string),
		cardToken: payload.card_token || (payload.data?.card_token as string),
		businessToken: payload.business_token || (payload.data?.business_token as string),
		transactionToken: payload.transaction_token || (payload.data?.transaction_token as string),
	};
}

/**
 * Build webhook response for Marqeta
 */
export function buildWebhookResponse(success: boolean, message?: string): {
	statusCode: number;
	body: string;
} {
	if (success) {
		return {
			statusCode: 200,
			body: JSON.stringify({ received: true }),
		};
	}
	
	return {
		statusCode: 400,
		body: JSON.stringify({ error: message || 'Webhook processing failed' }),
	};
}

/**
 * Check if timestamp is within acceptable window (prevent replay attacks)
 */
export function isTimestampValid(timestamp: string, toleranceSeconds = 300): boolean {
	try {
		const webhookTime = new Date(timestamp).getTime();
		const currentTime = Date.now();
		const difference = Math.abs(currentTime - webhookTime);
		
		return difference <= toleranceSeconds * 1000;
	} catch {
		return false;
	}
}

/**
 * Generate idempotency key from webhook data
 */
export function generateIdempotencyKey(payload: WebhookPayload): string {
	const data = `${payload.event_type}:${payload.token}:${payload.created_time}`;
	return crypto.createHash('sha256').update(data).digest('hex');
}
