/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

import { handleWebhook, getWebhookEvents } from './transport/webhookHandler';

/**
 * Velocity BPA Licensing Notice
 * 
 * This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
 * Use of this node by for-profit organizations in production environments
 * requires a commercial license from Velocity BPA.
 * 
 * For licensing information, visit https://velobpa.com/licensing
 * or contact licensing@velobpa.com
 */

export class MarqetaTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Marqeta Trigger',
		name: 'marqetaTrigger',
		icon: 'file:marqeta.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Receive real-time events from Marqeta via webhooks',
		defaults: {
			name: 'Marqeta Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'marqetaApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: [
					{
						name: 'All Events',
						value: '*',
						description: 'Receive all webhook events',
					},
					// Transaction Events
					{
						name: 'Authorization',
						value: 'transaction.authorization',
						description: 'Transaction authorization request',
					},
					{
						name: 'Authorization Cleared',
						value: 'transaction.authorization.clearing',
						description: 'Authorization has been cleared',
					},
					{
						name: 'Authorization Reversed',
						value: 'transaction.authorization.reversal',
						description: 'Authorization has been reversed',
					},
					{
						name: 'Clearing',
						value: 'transaction.clearing',
						description: 'Transaction has cleared',
					},
					{
						name: 'Refund',
						value: 'transaction.refund',
						description: 'Refund processed',
					},
					// Card Events
					{
						name: 'Card Created',
						value: 'card.created',
						description: 'New card created',
					},
					{
						name: 'Card Activated',
						value: 'card.activated',
						description: 'Card has been activated',
					},
					{
						name: 'Card Suspended',
						value: 'card.suspended',
						description: 'Card has been suspended',
					},
					{
						name: 'Card Terminated',
						value: 'card.terminated',
						description: 'Card has been terminated',
					},
					{
						name: 'PIN Changed',
						value: 'card.pin.changed',
						description: 'Card PIN has been changed',
					},
					// User Events
					{
						name: 'User Created',
						value: 'user.created',
						description: 'New user created',
					},
					{
						name: 'User Updated',
						value: 'user.updated',
						description: 'User has been updated',
					},
					{
						name: 'User Status Changed',
						value: 'user.transition',
						description: 'User status has changed',
					},
					{
						name: 'KYC Completed',
						value: 'user.kyc.completed',
						description: 'KYC verification completed',
					},
					{
						name: 'KYC Failed',
						value: 'user.kyc.failed',
						description: 'KYC verification failed',
					},
					// Funding Events
					{
						name: 'GPA Credit',
						value: 'gpa.credit',
						description: 'Funds credited to GPA',
					},
					{
						name: 'GPA Debit',
						value: 'gpa.debit',
						description: 'Funds debited from GPA',
					},
					{
						name: 'ACH Transfer Completed',
						value: 'ach.transfer.completed',
						description: 'ACH transfer completed',
					},
					{
						name: 'Direct Deposit Received',
						value: 'directdeposit.received',
						description: 'Direct deposit received',
					},
					// Digital Wallet Events
					{
						name: 'Wallet Token Created',
						value: 'digitalwallet.token.created',
						description: 'Digital wallet token created',
					},
					{
						name: 'Wallet Token Activated',
						value: 'digitalwallet.token.activated',
						description: 'Digital wallet token activated',
					},
					{
						name: 'Provisioning Completed',
						value: 'digitalwallet.provision.completed',
						description: 'Wallet provisioning completed',
					},
					// Dispute Events
					{
						name: 'Dispute Created',
						value: 'dispute.created',
						description: 'Dispute has been created',
					},
					{
						name: 'Chargeback Initiated',
						value: 'chargeback.initiated',
						description: 'Chargeback has been initiated',
					},
					{
						name: 'Chargeback Resolved',
						value: 'chargeback.resolved',
						description: 'Chargeback has been resolved',
					},
					// Velocity Events
					{
						name: 'Velocity Limit Reached',
						value: 'velocity.limit.reached',
						description: 'Velocity limit has been reached',
					},
					{
						name: 'Transaction Declined (Velocity)',
						value: 'transaction.declined.velocity',
						description: 'Transaction declined due to velocity',
					},
					// Commando Mode Events
					{
						name: 'Commando Mode Enabled',
						value: 'commandomode.enabled',
						description: 'Commando mode has been enabled',
					},
					{
						name: 'Commando Mode Disabled',
						value: 'commandomode.disabled',
						description: 'Commando mode has been disabled',
					},
				],
				default: ['*'],
				required: true,
				description: 'The events to listen for',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Verify Signature',
						name: 'verifySignature',
						type: 'boolean',
						default: true,
						description: 'Whether to verify webhook signature using the signature key in credentials',
					},
					{
						displayName: 'Check Timestamp',
						name: 'checkTimestamp',
						type: 'boolean',
						default: true,
						description: 'Whether to check webhook timestamp to prevent replay attacks',
					},
					{
						displayName: 'Timestamp Tolerance (Seconds)',
						name: 'timestampTolerance',
						type: 'number',
						default: 300,
						description: 'Maximum age of webhook timestamp in seconds',
					},
				],
			},
		],
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const events = this.getNodeParameter('events', []) as string[];
		const options = this.getNodeParameter('options', {}) as {
			verifySignature?: boolean;
			checkTimestamp?: boolean;
			timestampTolerance?: number;
		};

		return handleWebhook.call(this, {
			verifySignature: options.verifySignature ?? true,
			checkTimestamp: options.checkTimestamp ?? true,
			timestampTolerance: options.timestampTolerance ?? 300,
			eventFilter: events,
		});
	}
}
