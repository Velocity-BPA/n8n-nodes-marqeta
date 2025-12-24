/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';
import { CARD_STATE_OPTIONS, CARD_TRANSITION_REASON_OPTIONS } from '../../constants/cardStates';

export const cardOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['card'],
			},
		},
		options: [
			{ name: 'Activate', value: 'activate', description: 'Activate a card', action: 'Activate a card' },
			{ name: 'Create', value: 'create', description: 'Create a new card', action: 'Create a card' },
			{ name: 'Get', value: 'get', description: 'Get a card by token', action: 'Get a card' },
			{ name: 'Get by Barcode', value: 'getByBarcode', description: 'Get card by barcode', action: 'Get card by barcode' },
			{ name: 'Get CVV', value: 'getCvv', description: 'Get card CVV', action: 'Get card CVV' },
			{ name: 'Get Many', value: 'getMany', description: 'Get cards for a user', action: 'Get many cards' },
			{ name: 'Get PIN', value: 'getPin', description: 'Get card PIN status', action: 'Get card PIN' },
			{ name: 'Get Transitions', value: 'getTransitions', description: 'Get state transitions', action: 'Get card transitions' },
			{ name: 'Report Lost/Stolen', value: 'reportLostStolen', description: 'Report card lost or stolen', action: 'Report card lost stolen' },
			{ name: 'Reveal PAN', value: 'revealPan', description: 'Reveal full card number', action: 'Reveal card PAN' },
			{ name: 'Set PIN', value: 'setPin', description: 'Set card PIN', action: 'Set card PIN' },
			{ name: 'Transition', value: 'transition', description: 'Change card state', action: 'Transition card state' },
		],
		default: 'create',
	},
];

export const cardFields: INodeProperties[] = [
	{
		displayName: 'User Token',
		name: 'userToken',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['card'], operation: ['create', 'getMany'] } },
		description: 'Token of the user who owns the card',
	},
	{
		displayName: 'Card Product Token',
		name: 'cardProductToken',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['card'], operation: ['create'] } },
		description: 'Card product defining card configuration',
	},
	{
		displayName: 'Card Token',
		name: 'cardToken',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['card'], operation: ['get', 'activate', 'transition', 'revealPan', 'getCvv', 'getPin', 'setPin', 'getTransitions', 'reportLostStolen'] } },
		description: 'Unique token identifying the card',
	},
	{
		displayName: 'Barcode',
		name: 'barcode',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['card'], operation: ['getByBarcode'] } },
		description: 'Card barcode',
	},
	{
		displayName: 'New State',
		name: 'newState',
		type: 'options',
		required: true,
		options: CARD_STATE_OPTIONS as unknown as Array<{name: string; value: string}>,
		default: 'ACTIVE',
		displayOptions: { show: { resource: ['card'], operation: ['transition'] } },
		description: 'New state for the card',
	},
	{
		displayName: 'Reason',
		name: 'transitionReason',
		type: 'options',
		options: CARD_TRANSITION_REASON_OPTIONS as unknown as Array<{name: string; value: string}>,
		default: 'NEW',
		displayOptions: { show: { resource: ['card'], operation: ['transition', 'reportLostStolen'] } },
		description: 'Reason for the state change',
	},
	{
		displayName: 'Report Type',
		name: 'reportType',
		type: 'options',
		options: [
			{ name: 'Lost', value: 'LOST' },
			{ name: 'Stolen', value: 'STOLEN' },
		],
		default: 'LOST',
		displayOptions: { show: { resource: ['card'], operation: ['reportLostStolen'] } },
		description: 'Whether card is lost or stolen',
	},
	{
		displayName: 'PIN',
		name: 'pin',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['card'], operation: ['setPin'] } },
		description: 'New 4-digit PIN',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['card'], operation: ['create'] } },
		options: [
			{ displayName: 'Token', name: 'token', type: 'string', default: '', description: 'Custom card token' },
			{ displayName: 'Expedite', name: 'expedite', type: 'boolean', default: false, description: 'Expedite shipping' },
			{ displayName: 'Fulfillment Status', name: 'fulfillmentStatus', type: 'options', options: [{ name: 'Issued', value: 'ISSUED' }, { name: 'Ordered', value: 'ORDERED' }], default: 'ISSUED' },
			{ displayName: 'Reissue Pan from Card Token', name: 'reissuePanFromCardToken', type: 'string', default: '', description: 'Reissue with same PAN from another card' },
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['card'], operation: ['getMany', 'getTransitions'] } },
		description: 'Whether to return all results',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 25,
		displayOptions: { show: { resource: ['card'], operation: ['getMany', 'getTransitions'], returnAll: [false] } },
		description: 'Max results to return',
	},
];
