/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class MarqetaProgram implements ICredentialType {
	name = 'marqetaProgram';
	displayName = 'Marqeta Program';
	documentationUrl = 'https://www.marqeta.com/docs/developer-guides/core-api-quick-start';
	icon = 'file:marqeta.svg';

	properties: INodeProperties[] = [
		{
			displayName: 'Program Short Code',
			name: 'programShortCode',
			type: 'string',
			default: '',
			description: 'The short code identifier for your Marqeta card program',
		},
		{
			displayName: 'Program Funding Source Token',
			name: 'programFundingSourceToken',
			type: 'string',
			default: '',
			description: 'The default funding source token for your program. Used for GPA orders and fund transfers.',
		},
		{
			displayName: 'Default Card Product Token',
			name: 'defaultCardProductToken',
			type: 'string',
			default: '',
			description: 'The default card product token to use when creating new cards',
		},
		{
			displayName: 'JIT Funding Gateway Token',
			name: 'jitFundingGatewayToken',
			type: 'string',
			default: '',
			description: 'The gateway token for Just-In-Time (JIT) funding configuration (optional)',
		},
		{
			displayName: 'Default Velocity Control Token',
			name: 'defaultVelocityControlToken',
			type: 'string',
			default: '',
			description: 'The default velocity control token to apply to new users or cards (optional)',
		},
	];
}
