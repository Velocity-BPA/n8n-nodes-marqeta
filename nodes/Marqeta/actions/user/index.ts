/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';
import { USER_STATE_OPTIONS } from '../../constants/cardStates';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new user',
				action: 'Create a user',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a user by token',
				action: 'Get a user',
			},
			{
				name: 'Get Balance',
				value: 'getBalance',
				description: 'Get user GPA balance',
				action: 'Get user balance',
			},
			{
				name: 'Get by Email',
				value: 'getByEmail',
				description: 'Get a user by email address',
				action: 'Get user by email',
			},
			{
				name: 'Get by Phone',
				value: 'getByPhone',
				description: 'Get a user by phone number',
				action: 'Get user by phone',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many users',
				action: 'Get many users',
			},
			{
				name: 'Get Notes',
				value: 'getNotes',
				description: 'Get notes for a user',
				action: 'Get user notes',
			},
			{
				name: 'Get SSN',
				value: 'getSsn',
				description: 'Get user SSN (masked or full)',
				action: 'Get user SSN',
			},
			{
				name: 'Get Transitions',
				value: 'getTransitions',
				description: 'Get user state transitions',
				action: 'Get user transitions',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search for users',
				action: 'Search users',
			},
			{
				name: 'Transition Status',
				value: 'transition',
				description: 'Change user status (activate, suspend, close)',
				action: 'Transition user status',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a user',
				action: 'Update a user',
			},
		],
		default: 'create',
	},
];

export const userFields: INodeProperties[] = [
	// Create operation fields
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['create'],
			},
		},
		description: 'User first name',
	},
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['create'],
			},
		},
		description: 'User last name',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['create'],
			},
		},
		description: 'User email address',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Token',
				name: 'token',
				type: 'string',
				default: '',
				description: 'Custom token for the user (auto-generated if not provided)',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'User phone number',
			},
			{
				displayName: 'Date of Birth',
				name: 'birthDate',
				type: 'string',
				default: '',
				placeholder: 'YYYY-MM-DD',
				description: 'User date of birth',
			},
			{
				displayName: 'Address Line 1',
				name: 'address1',
				type: 'string',
				default: '',
				description: 'Street address',
			},
			{
				displayName: 'Address Line 2',
				name: 'address2',
				type: 'string',
				default: '',
				description: 'Apartment, suite, etc.',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'City',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				description: 'State or province (2-letter code)',
			},
			{
				displayName: 'Postal Code',
				name: 'postalCode',
				type: 'string',
				default: '',
				description: 'ZIP or postal code',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: 'US',
				description: 'Country code (ISO 3166-1 alpha-2)',
			},
			{
				displayName: 'SSN',
				name: 'ssn',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				description: 'Social Security Number (for KYC)',
			},
			{
				displayName: 'ID Number',
				name: 'idNumber',
				type: 'string',
				default: '',
				description: 'Government-issued ID number',
			},
			{
				displayName: 'Nationality',
				name: 'nationality',
				type: 'string',
				default: '',
				description: 'User nationality (country code)',
			},
			{
				displayName: 'Company',
				name: 'company',
				type: 'string',
				default: '',
				description: 'Company or employer name',
			},
			{
				displayName: 'Parent Token',
				name: 'parentToken',
				type: 'string',
				default: '',
				description: 'Parent business token (for business-associated users)',
			},
			{
				displayName: 'Uses Parent Account',
				name: 'usesParentAccount',
				type: 'boolean',
				default: false,
				description: 'Whether user shares parent business GPA',
			},
			{
				displayName: 'IP Address',
				name: 'ipAddress',
				type: 'string',
				default: '',
				description: 'User IP address (for fraud prevention)',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description: 'Custom metadata object',
			},
		],
	},
	
	// Get operation fields
	{
		displayName: 'User Token',
		name: 'userToken',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['get', 'update', 'getBalance', 'getNotes', 'getTransitions', 'getSsn', 'transition'],
			},
		},
		description: 'The unique token identifying the user',
	},
	
	// Get by Email
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getByEmail'],
			},
		},
		description: 'Email address to search for',
	},
	
	// Get by Phone
	{
		displayName: 'Phone',
		name: 'phone',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getByPhone'],
			},
		},
		description: 'Phone number to search for',
	},
	
	// Get SSN options
	{
		displayName: 'Full SSN',
		name: 'fullSsn',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getSsn'],
			},
		},
		description: 'Whether to return full SSN (requires additional permissions)',
	},
	
	// Transition fields
	{
		displayName: 'New Status',
		name: 'newStatus',
		type: 'options',
		required: true,
		options: USER_STATE_OPTIONS as unknown as Array<{name: string; value: string}>,
		default: 'ACTIVE',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['transition'],
			},
		},
		description: 'The new status for the user',
	},
	{
		displayName: 'Reason Code',
		name: 'reasonCode',
		type: 'string',
		default: '00',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['transition'],
			},
		},
		description: 'Reason code for the transition',
	},
	{
		displayName: 'Reason',
		name: 'reason',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['transition'],
			},
		},
		description: 'Human-readable reason for the transition',
	},
	
	// Update fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'User first name',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'User last name',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				description: 'User email address',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'User phone number',
			},
			{
				displayName: 'Address Line 1',
				name: 'address1',
				type: 'string',
				default: '',
				description: 'Street address',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'City',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				description: 'State or province',
			},
			{
				displayName: 'Postal Code',
				name: 'postalCode',
				type: 'string',
				default: '',
				description: 'ZIP or postal code',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'Country code',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description: 'Custom metadata object',
			},
		],
	},
	
	// Search fields
	{
		displayName: 'Search Query',
		name: 'searchQuery',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['search'],
			},
		},
		description: 'Search query string',
	},
	{
		displayName: 'Search Options',
		name: 'searchOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['search'],
			},
		},
		options: [
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'Filter by first name',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'Filter by last name',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				description: 'Filter by email',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: USER_STATE_OPTIONS as unknown as Array<{name: string; value: string}>,
				default: '',
				description: 'Filter by status',
			},
		],
	},
	
	// List/GetMany options
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getMany', 'search', 'getTransitions'],
			},
		},
		description: 'Whether to return all results or only up to a limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 25,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getMany', 'search', 'getTransitions'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
];
