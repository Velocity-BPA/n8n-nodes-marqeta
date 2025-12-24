/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IWebhookFunctions,
	IWebhookResponseData,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';
import {
	verifyWebhookSignature,
	parseWebhookPayload,
	isTimestampValid,
	type WebhookPayload,
} from '../utils/webhookUtils';
import type { MarqetaCredentials } from '../utils/authUtils';

/**
 * Webhook Handler for Marqeta Events
 * Processes incoming webhook requests from Marqeta
 */

export interface WebhookHandlerOptions {
	verifySignature?: boolean;
	checkTimestamp?: boolean;
	timestampTolerance?: number;
	eventFilter?: string[];
}

/**
 * Process incoming webhook from Marqeta
 */
export async function handleWebhook(
	this: IWebhookFunctions,
	options: WebhookHandlerOptions = {},
): Promise<IWebhookResponseData> {
	const req = this.getRequestObject();
	const credentials = await this.getCredentials('marqetaApi') as unknown as MarqetaCredentials;
	
	// Get raw body for signature verification
	const rawBody = req.rawBody?.toString() || JSON.stringify(req.body);
	
	// Verify signature if configured
	if (options.verifySignature && credentials.webhookSignatureKey) {
		const signature = req.headers['x-marqeta-signature'] as string;
		const timestamp = req.headers['x-marqeta-timestamp'] as string;
		
		if (!signature) {
			return {
				webhookResponse: {
					status: 401,
					body: JSON.stringify({ error: 'Missing signature header' }),
				},
			};
		}
		
		const isValid = verifyWebhookSignature(
			rawBody,
			signature,
			credentials.webhookSignatureKey,
			timestamp,
		);
		
		if (!isValid) {
			return {
				webhookResponse: {
					status: 401,
					body: JSON.stringify({ error: 'Invalid signature' }),
				},
			};
		}
		
		// Check timestamp to prevent replay attacks
		if (options.checkTimestamp && timestamp) {
			const tolerance = options.timestampTolerance || 300;
			if (!isTimestampValid(timestamp, tolerance)) {
				return {
					webhookResponse: {
						status: 401,
						body: JSON.stringify({ error: 'Timestamp outside acceptable range' }),
					},
				};
			}
		}
	}
	
	// Parse webhook payload
	let payload: WebhookPayload;
	try {
		payload = parseWebhookPayload(rawBody);
	} catch (error) {
		return {
			webhookResponse: {
				status: 400,
				body: JSON.stringify({ error: (error as Error).message }),
			},
		};
	}
	
	// Filter events if specified
	if (options.eventFilter && options.eventFilter.length > 0) {
		if (!options.eventFilter.includes(payload.event_type) && 
			!options.eventFilter.includes('*')) {
			// Event not in filter, acknowledge but don't process
			return {
				webhookResponse: {
					status: 200,
					body: JSON.stringify({ received: true, processed: false }),
				},
			};
		}
	}
	
	// Build output data
	const outputData: INodeExecutionData = {
		json: {
			event_type: payload.event_type,
			created_time: payload.created_time,
			token: payload.token,
			user_token: payload.user_token,
			card_token: payload.card_token,
			business_token: payload.business_token,
			transaction_token: payload.transaction_token,
			data: payload.data,
			headers: {
				'x-marqeta-timestamp': req.headers['x-marqeta-timestamp'],
				'x-marqeta-request-id': req.headers['x-marqeta-request-id'],
			},
		} as IDataObject,
	};
	
	return {
		workflowData: [[outputData]],
		webhookResponse: {
			status: 200,
			body: JSON.stringify({ received: true }),
		},
	};
}

/**
 * Get webhook event categories for UI selection
 */
export function getWebhookEventCategories(): { name: string; value: string }[] {
	return [
		{ name: 'All Events', value: '*' },
		{ name: 'Transaction Events', value: 'transaction.*' },
		{ name: 'Card Events', value: 'card.*' },
		{ name: 'User Events', value: 'user.*' },
		{ name: 'Funding Events', value: 'gpa.*' },
		{ name: 'Digital Wallet Events', value: 'digitalwallet.*' },
		{ name: 'Dispute Events', value: 'dispute.*' },
		{ name: 'Business Events', value: 'business.*' },
		{ name: 'Velocity Events', value: 'velocity.*' },
		{ name: 'Commando Mode Events', value: 'commandomode.*' },
	];
}

/**
 * Get specific webhook events for UI selection
 */
export function getWebhookEvents(): { name: string; value: string }[] {
	return [
		// Transaction
		{ name: 'Authorization Created', value: 'transaction.authorization' },
		{ name: 'Authorization Cleared', value: 'transaction.authorization.clearing' },
		{ name: 'Authorization Reversed', value: 'transaction.authorization.reversal' },
		{ name: 'Transaction Clearing', value: 'transaction.clearing' },
		{ name: 'Refund Processed', value: 'transaction.refund' },
		
		// Card
		{ name: 'Card Created', value: 'card.created' },
		{ name: 'Card Activated', value: 'card.activated' },
		{ name: 'Card Suspended', value: 'card.suspended' },
		{ name: 'Card Terminated', value: 'card.terminated' },
		{ name: 'PIN Changed', value: 'card.pin.changed' },
		
		// User
		{ name: 'User Created', value: 'user.created' },
		{ name: 'User Updated', value: 'user.updated' },
		{ name: 'User Status Changed', value: 'user.transition' },
		{ name: 'KYC Completed', value: 'user.kyc.completed' },
		{ name: 'KYC Failed', value: 'user.kyc.failed' },
		
		// Funding
		{ name: 'GPA Credit', value: 'gpa.credit' },
		{ name: 'GPA Debit', value: 'gpa.debit' },
		{ name: 'ACH Transfer Completed', value: 'ach.transfer.completed' },
		{ name: 'Direct Deposit Received', value: 'directdeposit.received' },
		
		// Digital Wallet
		{ name: 'Wallet Token Created', value: 'digitalwallet.token.created' },
		{ name: 'Wallet Token Activated', value: 'digitalwallet.token.activated' },
		{ name: 'Provisioning Completed', value: 'digitalwallet.provision.completed' },
		
		// Dispute
		{ name: 'Dispute Created', value: 'dispute.created' },
		{ name: 'Chargeback Initiated', value: 'chargeback.initiated' },
		{ name: 'Chargeback Resolved', value: 'chargeback.resolved' },
		
		// Velocity
		{ name: 'Velocity Limit Reached', value: 'velocity.limit.reached' },
		{ name: 'Transaction Declined (Velocity)', value: 'transaction.declined.velocity' },
		
		// Commando Mode
		{ name: 'Commando Mode Enabled', value: 'commandomode.enabled' },
		{ name: 'Commando Mode Disabled', value: 'commandomode.disabled' },
	];
}
