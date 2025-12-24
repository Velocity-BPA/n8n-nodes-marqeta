/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

/**
 * All Marqeta Resources
 */
export const resourceOptions: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	options: [
		{ name: 'Authorization', value: 'authorization', description: 'Manage transaction authorizations' },
		{ name: 'Authorization Control', value: 'authControl', description: 'Transaction approval rules' },
		{ name: 'Balance', value: 'balance', description: 'Account balance operations' },
		{ name: 'Bulk Issuance', value: 'bulkIssuance', description: 'Bulk card orders' },
		{ name: 'Business', value: 'business', description: 'Business account management' },
		{ name: 'Card', value: 'card', description: 'Card lifecycle management' },
		{ name: 'Card Product', value: 'cardProduct', description: 'Card product configuration' },
		{ name: 'Commando Mode', value: 'commandoMode', description: 'Offline authorization fallback' },
		{ name: 'Digital Wallet', value: 'digitalWallet', description: 'Apple/Google/Samsung Pay tokens' },
		{ name: 'Direct Deposit', value: 'directDeposit', description: 'Direct deposit management' },
		{ name: 'Dispute', value: 'dispute', description: 'Transaction disputes and chargebacks' },
		{ name: 'Fee', value: 'fee', description: 'Fee management' },
		{ name: 'Funding Source', value: 'fundingSource', description: 'Funding source management' },
		{ name: 'GPA', value: 'gpa', description: 'General Purpose Account operations' },
		{ name: 'KYC', value: 'kyc', description: 'Identity verification' },
		{ name: 'MCC Group', value: 'mccGroup', description: 'Merchant category code groups' },
		{ name: 'Merchant', value: 'merchant', description: 'Merchant operations' },
		{ name: 'Program', value: 'program', description: 'Card program configuration' },
		{ name: 'Push to Card', value: 'pushToCard', description: 'Send funds to external cards' },
		{ name: 'Real-Time Decisioning', value: 'realTimeDecisioning', description: 'JIT funding configuration' },
		{ name: 'Report', value: 'report', description: 'Generate reports' },
		{ name: 'Reward', value: 'reward', description: 'Rewards program management' },
		{ name: 'Transaction', value: 'transaction', description: 'Transaction operations' },
		{ name: 'User', value: 'user', description: 'User lifecycle management' },
		{ name: 'Utility', value: 'utility', description: 'Utility operations' },
		{ name: 'Velocity Control', value: 'velocityControl', description: 'Spending limits and restrictions' },
		{ name: 'Webhook', value: 'webhook', description: 'Webhook management' },
	],
	default: 'user',
};

// GPA Operations
export const gpaOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['gpa'] } },
		options: [
			{ name: 'Create Order (Load Funds)', value: 'createOrder', description: 'Load funds to GPA', action: 'Create GPA order' },
			{ name: 'Create Unload', value: 'createUnload', description: 'Withdraw funds from GPA', action: 'Create GPA unload' },
			{ name: 'Get Balance', value: 'getBalance', description: 'Get GPA balance', action: 'Get GPA balance' },
			{ name: 'Get Order', value: 'getOrder', description: 'Get a GPA order', action: 'Get GPA order' },
			{ name: 'Get Many Orders', value: 'getManyOrders', description: 'Get GPA orders for user', action: 'Get many GPA orders' },
		],
		default: 'createOrder',
	},
];

export const gpaFields: INodeProperties[] = [
	{
		displayName: 'User Token',
		name: 'userToken',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['gpa'], operation: ['createOrder', 'createUnload', 'getBalance', 'getManyOrders'] } },
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'number',
		required: true,
		default: 0,
		typeOptions: { minValue: 0.01 },
		displayOptions: { show: { resource: ['gpa'], operation: ['createOrder', 'createUnload'] } },
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		default: 'USD',
		displayOptions: { show: { resource: ['gpa'], operation: ['createOrder', 'createUnload'] } },
	},
	{
		displayName: 'Funding Source Token',
		name: 'fundingSourceToken',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['gpa'], operation: ['createOrder'] } },
	},
	{
		displayName: 'Order Token',
		name: 'orderToken',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['gpa'], operation: ['getOrder'] } },
	},
];

// Transaction Operations
export const transactionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['transaction'] } },
		options: [
			{ name: 'Get', value: 'get', description: 'Get a transaction', action: 'Get a transaction' },
			{ name: 'Get Many', value: 'getMany', description: 'Get many transactions', action: 'Get many transactions' },
			{ name: 'Get by Card', value: 'getByCard', description: 'Get transactions by card', action: 'Get transactions by card' },
			{ name: 'Get by User', value: 'getByUser', description: 'Get transactions by user', action: 'Get transactions by user' },
			{ name: 'Simulate Authorization', value: 'simulateAuth', description: 'Simulate authorization (sandbox)', action: 'Simulate authorization' },
			{ name: 'Simulate Clearing', value: 'simulateClearing', description: 'Simulate clearing (sandbox)', action: 'Simulate clearing' },
			{ name: 'Simulate Refund', value: 'simulateRefund', description: 'Simulate refund (sandbox)', action: 'Simulate refund' },
			{ name: 'Simulate Reversal', value: 'simulateReversal', description: 'Simulate reversal (sandbox)', action: 'Simulate reversal' },
		],
		default: 'getMany',
	},
];

export const transactionFields: INodeProperties[] = [
	{
		displayName: 'Transaction Token',
		name: 'transactionToken',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['transaction'], operation: ['get'] } },
	},
	{
		displayName: 'User Token',
		name: 'userToken',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['transaction'], operation: ['getByUser'] } },
	},
	{
		displayName: 'Card Token',
		name: 'cardToken',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['transaction'], operation: ['getByCard', 'simulateAuth', 'simulateClearing', 'simulateRefund'] } },
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['transaction'], operation: ['simulateAuth', 'simulateClearing', 'simulateRefund'] } },
	},
	{
		displayName: 'Original Transaction Token',
		name: 'originalTransactionToken',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['transaction'], operation: ['simulateClearing', 'simulateRefund', 'simulateReversal'] } },
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['transaction'], operation: ['getMany', 'getByCard', 'getByUser'] } },
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 25,
		displayOptions: { show: { resource: ['transaction'], operation: ['getMany', 'getByCard', 'getByUser'], returnAll: [false] } },
	},
];

// KYC Operations
export const kycOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['kyc'] } },
		options: [
			{ name: 'Perform KYC', value: 'perform', description: 'Perform identity verification', action: 'Perform KYC' },
			{ name: 'Get Result', value: 'getResult', description: 'Get KYC result', action: 'Get KYC result' },
			{ name: 'Get Many Results', value: 'getManyResults', description: 'Get all KYC results for user', action: 'Get many KYC results' },
			{ name: 'Override', value: 'override', description: 'Override KYC decision', action: 'Override KYC' },
		],
		default: 'perform',
	},
];

export const kycFields: INodeProperties[] = [
	{
		displayName: 'User Token',
		name: 'userToken',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['kyc'], operation: ['perform', 'getManyResults'] } },
	},
	{
		displayName: 'KYC Token',
		name: 'kycToken',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['kyc'], operation: ['getResult', 'override'] } },
	},
	{
		displayName: 'Override Status',
		name: 'overrideStatus',
		type: 'options',
		options: [
			{ name: 'Pass', value: 'PASS' },
			{ name: 'Fail', value: 'FAIL' },
		],
		default: 'PASS',
		displayOptions: { show: { resource: ['kyc'], operation: ['override'] } },
	},
	{
		displayName: 'Notes',
		name: 'notes',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['kyc'], operation: ['override'] } },
	},
];

// Velocity Control Operations
export const velocityControlOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['velocityControl'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create velocity control', action: 'Create velocity control' },
			{ name: 'Delete', value: 'delete', description: 'Delete velocity control', action: 'Delete velocity control' },
			{ name: 'Get', value: 'get', description: 'Get velocity control', action: 'Get velocity control' },
			{ name: 'Get Available', value: 'getAvailable', description: 'Get available spending', action: 'Get available spending' },
			{ name: 'Get Many', value: 'getMany', description: 'Get velocity controls', action: 'Get many velocity controls' },
			{ name: 'Update', value: 'update', description: 'Update velocity control', action: 'Update velocity control' },
		],
		default: 'create',
	},
];

export const velocityControlFields: INodeProperties[] = [
	{
		displayName: 'Velocity Control Token',
		name: 'velocityControlToken',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['velocityControl'], operation: ['get', 'update', 'delete'] } },
	},
	{
		displayName: 'User Token',
		name: 'userToken',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['velocityControl'], operation: ['create', 'getAvailable'] } },
	},
	{
		displayName: 'Amount Limit',
		name: 'amountLimit',
		type: 'number',
		required: true,
		default: 1000,
		displayOptions: { show: { resource: ['velocityControl'], operation: ['create'] } },
	},
	{
		displayName: 'Velocity Window',
		name: 'velocityWindow',
		type: 'options',
		options: [
			{ name: 'Day', value: 'DAY' },
			{ name: 'Week', value: 'WEEK' },
			{ name: 'Month', value: 'MONTH' },
			{ name: 'Lifetime', value: 'LIFETIME' },
			{ name: 'Transaction', value: 'TRANSACTION' },
		],
		default: 'DAY',
		displayOptions: { show: { resource: ['velocityControl'], operation: ['create'] } },
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['velocityControl'], operation: ['create'] } },
	},
];

// Digital Wallet Operations
export const digitalWalletOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['digitalWallet'] } },
		options: [
			{ name: 'Create Token', value: 'createToken', description: 'Create digital wallet token', action: 'Create digital wallet token' },
			{ name: 'Get Token', value: 'getToken', description: 'Get digital wallet token', action: 'Get digital wallet token' },
			{ name: 'Get Many Tokens', value: 'getManyTokens', description: 'Get tokens for card', action: 'Get many digital wallet tokens' },
			{ name: 'Transition Token', value: 'transitionToken', description: 'Change token state', action: 'Transition digital wallet token' },
		],
		default: 'getManyTokens',
	},
];

export const digitalWalletFields: INodeProperties[] = [
	{
		displayName: 'Digital Wallet Token',
		name: 'digitalWalletToken',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['digitalWallet'], operation: ['getToken', 'transitionToken'] } },
	},
	{
		displayName: 'Card Token',
		name: 'cardToken',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['digitalWallet'], operation: ['createToken', 'getManyTokens'] } },
	},
	{
		displayName: 'Wallet Provider',
		name: 'walletProvider',
		type: 'options',
		options: [
			{ name: 'Apple Pay', value: 'APPLE_PAY' },
			{ name: 'Google Pay', value: 'GOOGLE_PAY' },
			{ name: 'Samsung Pay', value: 'SAMSUNG_PAY' },
		],
		default: 'APPLE_PAY',
		displayOptions: { show: { resource: ['digitalWallet'], operation: ['createToken'] } },
	},
	{
		displayName: 'New State',
		name: 'tokenState',
		type: 'options',
		options: [
			{ name: 'Active', value: 'ACTIVE' },
			{ name: 'Suspended', value: 'SUSPENDED' },
			{ name: 'Terminated', value: 'TERMINATED' },
		],
		default: 'ACTIVE',
		displayOptions: { show: { resource: ['digitalWallet'], operation: ['transitionToken'] } },
	},
];

// Webhook Operations
export const webhookOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['webhook'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create a webhook', action: 'Create a webhook' },
			{ name: 'Delete', value: 'delete', description: 'Delete a webhook', action: 'Delete a webhook' },
			{ name: 'Get', value: 'get', description: 'Get a webhook', action: 'Get a webhook' },
			{ name: 'Get Many', value: 'getMany', description: 'Get many webhooks', action: 'Get many webhooks' },
			{ name: 'Test', value: 'test', description: 'Test a webhook', action: 'Test a webhook' },
			{ name: 'Update', value: 'update', description: 'Update a webhook', action: 'Update a webhook' },
		],
		default: 'getMany',
	},
];

export const webhookFields: INodeProperties[] = [
	{
		displayName: 'Webhook Token',
		name: 'webhookToken',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['webhook'], operation: ['get', 'update', 'delete', 'test'] } },
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://your-webhook-endpoint.com/webhook',
		displayOptions: { show: { resource: ['webhook'], operation: ['create'] } },
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['webhook'], operation: ['create'] } },
	},
	{
		displayName: 'Events',
		name: 'events',
		type: 'multiOptions',
		options: [
			{ name: 'All Events', value: '*' },
			{ name: 'Authorization', value: 'transaction.authorization' },
			{ name: 'Card Created', value: 'card.created' },
			{ name: 'Card Activated', value: 'card.activated' },
			{ name: 'GPA Credit', value: 'gpa.credit' },
			{ name: 'User Created', value: 'user.created' },
		],
		default: ['*'],
		displayOptions: { show: { resource: ['webhook'], operation: ['create'] } },
	},
];

// Business Operations
export const businessOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['business'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create a business', action: 'Create a business' },
			{ name: 'Get', value: 'get', description: 'Get a business', action: 'Get a business' },
			{ name: 'Get Balance', value: 'getBalance', description: 'Get business balance', action: 'Get business balance' },
			{ name: 'Get Many', value: 'getMany', description: 'Get many businesses', action: 'Get many businesses' },
			{ name: 'Transition', value: 'transition', description: 'Change business status', action: 'Transition business' },
			{ name: 'Update', value: 'update', description: 'Update a business', action: 'Update a business' },
		],
		default: 'create',
	},
];

export const businessFields: INodeProperties[] = [
	{
		displayName: 'Business Token',
		name: 'businessToken',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['business'], operation: ['get', 'update', 'getBalance', 'transition'] } },
	},
	{
		displayName: 'Business Name',
		name: 'businessName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['business'], operation: ['create'] } },
	},
];

// Utility Operations
export const utilityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['utility'] } },
		options: [
			{ name: 'Get BIN Details', value: 'getBinDetails', description: 'Get BIN information', action: 'Get BIN details' },
			{ name: 'Ping API', value: 'ping', description: 'Test API connectivity', action: 'Ping API' },
			{ name: 'Validate Address', value: 'validateAddress', description: 'Validate an address', action: 'Validate address' },
			{ name: 'Validate Card Number', value: 'validateCardNumber', description: 'Validate card number', action: 'Validate card number' },
		],
		default: 'ping',
	},
];

export const utilityFields: INodeProperties[] = [
	{
		displayName: 'BIN',
		name: 'bin',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['utility'], operation: ['getBinDetails'] } },
		description: 'First 6-8 digits of card number',
	},
	{
		displayName: 'Card Number',
		name: 'cardNumber',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['utility'], operation: ['validateCardNumber'] } },
	},
];
