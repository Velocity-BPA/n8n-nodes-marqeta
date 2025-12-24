/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Merchant Category Codes (MCC) for Card Authorization Controls
 */

export const STANDARD_MCC_GROUPS = {
	AIRLINES: {
		name: 'Airlines',
		codes: ['3000-3299', '4511'],
		description: 'Airlines and air carriers',
	},
	CAR_RENTAL: {
		name: 'Car Rental',
		codes: ['3351-3441', '7512'],
		description: 'Auto rental agencies',
	},
	HOTELS: {
		name: 'Hotels/Lodging',
		codes: ['3501-3838', '7011'],
		description: 'Hotels, motels, and lodging',
	},
	RESTAURANTS: {
		name: 'Restaurants',
		codes: ['5812', '5813', '5814'],
		description: 'Eating places and restaurants',
	},
	GROCERY: {
		name: 'Grocery Stores',
		codes: ['5411', '5422', '5441', '5451', '5462', '5499'],
		description: 'Grocery stores and supermarkets',
	},
	GAS_STATIONS: {
		name: 'Gas Stations',
		codes: ['5541', '5542'],
		description: 'Service stations and fuel dealers',
	},
	RETAIL: {
		name: 'Retail',
		codes: ['5200-5299', '5300-5399', '5600-5699', '5900-5999'],
		description: 'General retail and merchandise',
	},
	GAMBLING: {
		name: 'Gambling',
		codes: ['7801', '7802', '7995'],
		description: 'Gambling and gaming',
	},
	ADULT_ENTERTAINMENT: {
		name: 'Adult Entertainment',
		codes: ['5967'],
		description: 'Adult entertainment services',
	},
	ATM: {
		name: 'ATM',
		codes: ['6010', '6011'],
		description: 'ATM and cash advance',
	},
	HEALTHCARE: {
		name: 'Healthcare',
		codes: ['4119', '5912', '8011', '8021', '8031', '8041', '8042', '8043', '8049', '8050', '8062', '8071', '8099'],
		description: 'Healthcare and medical services',
	},
	PROFESSIONAL_SERVICES: {
		name: 'Professional Services',
		codes: ['8111', '8911', '8931', '8999'],
		description: 'Professional and consulting services',
	},
	TRAVEL: {
		name: 'Travel Agencies',
		codes: ['4722', '4723'],
		description: 'Travel agencies and tour operators',
	},
	TRANSPORTATION: {
		name: 'Transportation',
		codes: ['4111', '4112', '4121', '4131', '4214', '4215'],
		description: 'Local and passenger transportation',
	},
	UTILITIES: {
		name: 'Utilities',
		codes: ['4814', '4815', '4816', '4821', '4899', '4900'],
		description: 'Telecommunications and utilities',
	},
	INSURANCE: {
		name: 'Insurance',
		codes: ['5960', '6300', '6381'],
		description: 'Insurance services',
	},
	GOVERNMENT: {
		name: 'Government',
		codes: ['9211', '9222', '9223', '9311', '9399', '9402', '9405'],
		description: 'Government services',
	},
	EDUCATION: {
		name: 'Education',
		codes: ['8211', '8220', '8241', '8244', '8249', '8299'],
		description: 'Educational services',
	},
	ENTERTAINMENT: {
		name: 'Entertainment',
		codes: ['7832', '7841', '7911', '7922', '7929', '7933', '7941', '7991', '7992', '7993', '7994', '7996', '7997', '7998', '7999'],
		description: 'Entertainment and recreation',
	},
	DIGITAL_GOODS: {
		name: 'Digital Goods',
		codes: ['5815', '5816', '5817', '5818'],
		description: 'Digital goods and media',
	},
} as const;

export const MCC_GROUP_OPTIONS = Object.entries(STANDARD_MCC_GROUPS).map(([key, value]) => ({
	name: value.name,
	value: key,
	description: value.description,
}));

export const COMMON_MCC_CODES: Record<string, { code: string; description: string }> = {
	// Airlines
	'4511': { code: '4511', description: 'Airlines and air carriers' },
	
	// Auto
	'5511': { code: '5511', description: 'Automobile dealers (new and used)' },
	'5521': { code: '5521', description: 'Automobile dealers (used only)' },
	'5531': { code: '5531', description: 'Auto and home supply stores' },
	'5532': { code: '5532', description: 'Automotive tire stores' },
	'5533': { code: '5533', description: 'Automotive parts and accessories' },
	'7538': { code: '7538', description: 'Automotive service shops' },
	
	// Fuel
	'5541': { code: '5541', description: 'Service stations (with or without ancillary services)' },
	'5542': { code: '5542', description: 'Automated fuel dispensers' },
	
	// Food & Grocery
	'5411': { code: '5411', description: 'Grocery stores and supermarkets' },
	'5812': { code: '5812', description: 'Eating places and restaurants' },
	'5813': { code: '5813', description: 'Drinking places (bars, taverns, nightclubs)' },
	'5814': { code: '5814', description: 'Fast food restaurants' },
	
	// Retail
	'5200': { code: '5200', description: 'Home supply warehouse stores' },
	'5311': { code: '5311', description: 'Department stores' },
	'5331': { code: '5331', description: 'Variety stores' },
	'5399': { code: '5399', description: 'Miscellaneous general merchandise' },
	
	// E-commerce
	'5969': { code: '5969', description: 'Direct marketing - other' },
	
	// ATM/Cash
	'6010': { code: '6010', description: 'Financial institutions - manual cash' },
	'6011': { code: '6011', description: 'Financial institutions - automated cash' },
	
	// Money Transfer
	'6012': { code: '6012', description: 'Financial institutions - merchandise and services' },
	'6051': { code: '6051', description: 'Non-financial institutions - foreign currency, money orders' },
	'6540': { code: '6540', description: 'Non-financial institutions - stored value card' },
	
	// Gambling
	'7801': { code: '7801', description: 'Government-owned lotteries' },
	'7802': { code: '7802', description: 'Government-licensed horse/dog racing' },
	'7995': { code: '7995', description: 'Betting, casino gambling, lottery tickets' },
	
	// Crypto
	'6051': { code: '6051', description: 'Cryptocurrency exchanges (often classified here)' },
};

export const HIGH_RISK_MCC_CODES = [
	'5967', // Adult entertainment
	'7801', // Government-owned lotteries
	'7802', // Horse/dog racing
	'7995', // Gambling
	'6051', // Money orders / crypto
	'6012', // Financial services - merchandise
	'4829', // Wire transfers
	'5993', // Cigar stores
] as const;

export const NETWORK_CODES = {
	VISA: 'VISA',
	MASTERCARD: 'MASTERCARD',
	DISCOVER: 'DISCOVER',
	AMEX: 'AMEX',
	JCB: 'JCB',
	UNIONPAY: 'UNIONPAY',
} as const;

export type NetworkCode = keyof typeof NETWORK_CODES;

export const NETWORK_OPTIONS = [
	{ name: 'Visa', value: 'VISA' },
	{ name: 'Mastercard', value: 'MASTERCARD' },
	{ name: 'Discover', value: 'DISCOVER' },
	{ name: 'American Express', value: 'AMEX' },
	{ name: 'JCB', value: 'JCB' },
	{ name: 'UnionPay', value: 'UNIONPAY' },
] as const;
