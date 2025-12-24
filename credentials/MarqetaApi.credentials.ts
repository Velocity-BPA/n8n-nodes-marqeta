/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestHelper,
	INodeProperties,
} from 'n8n-workflow';

export class MarqetaApi implements ICredentialType {
	name = 'marqetaApi';
	displayName = 'Marqeta API';
	documentationUrl = 'https://www.marqeta.com/docs/developer-guides/core-api-quick-start';
	icon = 'file:marqeta.svg';

	properties: INodeProperties[] = [
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			default: 'sandbox',
			options: [
				{
					name: 'Sandbox',
					value: 'sandbox',
					description: 'Use the Marqeta Sandbox environment for testing',
				},
				{
					name: 'Production',
					value: 'production',
					description: 'Use the Marqeta Production environment',
				},
				{
					name: 'Custom',
					value: 'custom',
					description: 'Use a custom API endpoint',
				},
			],
			description: 'The Marqeta environment to connect to',
		},
		{
			displayName: 'Custom Base URL',
			name: 'customBaseUrl',
			type: 'string',
			default: '',
			placeholder: 'https://your-custom-endpoint.marqeta.com/v3',
			displayOptions: {
				show: {
					environment: ['custom'],
				},
			},
			description: 'Custom API base URL (must include /v3)',
		},
		{
			displayName: 'Application Token',
			name: 'applicationToken',
			type: 'string',
			default: '',
			required: true,
			description: 'The Application Token from your Marqeta program. Found in the Marqeta Dashboard under Developer > API Keys.',
		},
		{
			displayName: 'Admin Access Token',
			name: 'adminAccessToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'The Master Access Token (Admin Access Token) from your Marqeta program. This provides full API access.',
		},
		{
			displayName: 'Webhook Signature Key',
			name: 'webhookSignatureKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'The signature key used to verify incoming webhook requests from Marqeta (optional)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			auth: {
				username: '={{$credentials.applicationToken}}',
				password: '={{$credentials.adminAccessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.environment === "production" ? "https://api.marqeta.com/v3" : ($credentials.environment === "sandbox" ? "https://sandbox-api.marqeta.com/v3" : $credentials.customBaseUrl)}}',
			url: '/ping',
			method: 'GET',
		},
	};
}
