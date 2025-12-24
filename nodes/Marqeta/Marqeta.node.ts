/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

import { userOperations, userFields } from './actions/user/index';
import { executeUserOperation } from './actions/user/execute';
import { cardOperations, cardFields } from './actions/card/index';
import { executeCardOperation } from './actions/card/execute';
import {
	resourceOptions,
	gpaOperations,
	gpaFields,
	transactionOperations,
	transactionFields,
	kycOperations,
	kycFields,
	velocityControlOperations,
	velocityControlFields,
	digitalWalletOperations,
	digitalWalletFields,
	webhookOperations,
	webhookFields,
	businessOperations,
	businessFields,
	utilityOperations,
	utilityFields,
} from './actions/resources';
import { marqetaApiRequest, marqetaApiRequestPaginated, marqetaSimulateRequest } from './transport/marqetaApi';

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

// Log licensing notice once on node load
const LICENSING_NOTICE_LOGGED = Symbol.for('marqeta.licensing.logged');
if (!(global as Record<symbol, boolean>)[LICENSING_NOTICE_LOGGED]) {
	console.warn(`
[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`);
	(global as Record<symbol, boolean>)[LICENSING_NOTICE_LOGGED] = true;
}

export class Marqeta implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Marqeta',
		name: 'marqeta',
		icon: 'file:marqeta.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Marqeta card issuing platform',
		defaults: {
			name: 'Marqeta',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'marqetaApi',
				required: true,
			},
			{
				name: 'marqetaProgram',
				required: false,
			},
		],
		properties: [
			resourceOptions,
			// User
			...userOperations,
			...userFields,
			// Card
			...cardOperations,
			...cardFields,
			// GPA
			...gpaOperations,
			...gpaFields,
			// Transaction
			...transactionOperations,
			...transactionFields,
			// KYC
			...kycOperations,
			...kycFields,
			// Velocity Control
			...velocityControlOperations,
			...velocityControlFields,
			// Digital Wallet
			...digitalWalletOperations,
			...digitalWalletFields,
			// Webhook
			...webhookOperations,
			...webhookFields,
			// Business
			...businessOperations,
			...businessFields,
			// Utility
			...utilityOperations,
			...utilityFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: INodeExecutionData[] = [];

				switch (resource) {
					case 'user':
						responseData = await executeUserOperation.call(this, operation, i);
						break;

					case 'card':
						responseData = await executeCardOperation.call(this, operation, i);
						break;

					case 'gpa':
						responseData = await this.executeGpaOperation(operation, i);
						break;

					case 'transaction':
						responseData = await this.executeTransactionOperation(operation, i);
						break;

					case 'kyc':
						responseData = await this.executeKycOperation(operation, i);
						break;

					case 'velocityControl':
						responseData = await this.executeVelocityControlOperation(operation, i);
						break;

					case 'digitalWallet':
						responseData = await this.executeDigitalWalletOperation(operation, i);
						break;

					case 'webhook':
						responseData = await this.executeWebhookOperation(operation, i);
						break;

					case 'business':
						responseData = await this.executeBusinessOperation(operation, i);
						break;

					case 'utility':
						responseData = await this.executeUtilityOperation(operation, i);
						break;

					default:
						throw new Error(`Resource '${resource}' is not yet implemented`);
				}

				returnData.push(...responseData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}

	private async executeGpaOperation(
		this: IExecuteFunctions,
		operation: string,
		i: number,
	): Promise<INodeExecutionData[]> {
		let responseData: IDataObject | IDataObject[];

		switch (operation) {
			case 'createOrder': {
				const userToken = this.getNodeParameter('userToken', i) as string;
				const amount = this.getNodeParameter('amount', i) as number;
				const currency = this.getNodeParameter('currency', i, 'USD') as string;
				const fundingSourceToken = this.getNodeParameter('fundingSourceToken', i) as string;

				responseData = await marqetaApiRequest.call(this, {
					method: 'POST',
					endpoint: '/gpaorders',
					body: {
						user_token: userToken,
						amount,
						currency_code: currency,
						funding_source_token: fundingSourceToken,
					},
					useIdempotencyKey: true,
				});
				break;
			}

			case 'createUnload': {
				const userToken = this.getNodeParameter('userToken', i) as string;
				const amount = this.getNodeParameter('amount', i) as number;
				const currency = this.getNodeParameter('currency', i, 'USD') as string;

				responseData = await marqetaApiRequest.call(this, {
					method: 'POST',
					endpoint: '/gpaorders/unloads',
					body: {
						original_order_token: userToken,
						amount,
						currency_code: currency,
					},
					useIdempotencyKey: true,
				});
				break;
			}

			case 'getBalance': {
				const userToken = this.getNodeParameter('userToken', i) as string;
				responseData = await marqetaApiRequest.call(this, {
					method: 'GET',
					endpoint: `/balances/${userToken}`,
				});
				break;
			}

			case 'getOrder': {
				const orderToken = this.getNodeParameter('orderToken', i) as string;
				responseData = await marqetaApiRequest.call(this, {
					method: 'GET',
					endpoint: `/gpaorders/${orderToken}`,
				});
				break;
			}

			case 'getManyOrders': {
				const userToken = this.getNodeParameter('userToken', i) as string;
				const response = await marqetaApiRequest.call(this, {
					method: 'GET',
					endpoint: `/gpaorders/user/${userToken}`,
				});
				responseData = (response.data as IDataObject[]) || [response];
				break;
			}

			default:
				throw new Error(`Unknown GPA operation: ${operation}`);
		}

		return Array.isArray(responseData)
			? responseData.map(item => ({ json: item }))
			: [{ json: responseData }];
	}

	private async executeTransactionOperation(
		this: IExecuteFunctions,
		operation: string,
		i: number,
	): Promise<INodeExecutionData[]> {
		let responseData: IDataObject | IDataObject[];

		switch (operation) {
			case 'get': {
				const transactionToken = this.getNodeParameter('transactionToken', i) as string;
				responseData = await marqetaApiRequest.call(this, {
					method: 'GET',
					endpoint: `/transactions/${transactionToken}`,
				});
				break;
			}

			case 'getMany': {
				const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
				const limit = this.getNodeParameter('limit', i, 25) as number;

				if (returnAll) {
					responseData = await marqetaApiRequestPaginated.call(this, {
						method: 'GET',
						endpoint: '/transactions',
					}, {}, true, 1000);
				} else {
					const response = await marqetaApiRequest.call(this, {
						method: 'GET',
						endpoint: '/transactions',
						qs: { count: limit },
					});
					responseData = (response.data as IDataObject[]) || [response];
				}
				break;
			}

			case 'getByUser': {
				const userToken = this.getNodeParameter('userToken', i) as string;
				const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
				const limit = this.getNodeParameter('limit', i, 25) as number;

				if (returnAll) {
					responseData = await marqetaApiRequestPaginated.call(this, {
						method: 'GET',
						endpoint: `/transactions/user/${userToken}`,
					}, {}, true, 1000);
				} else {
					const response = await marqetaApiRequest.call(this, {
						method: 'GET',
						endpoint: `/transactions/user/${userToken}`,
						qs: { count: limit },
					});
					responseData = (response.data as IDataObject[]) || [response];
				}
				break;
			}

			case 'getByCard': {
				const cardToken = this.getNodeParameter('cardToken', i) as string;
				const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
				const limit = this.getNodeParameter('limit', i, 25) as number;

				if (returnAll) {
					responseData = await marqetaApiRequestPaginated.call(this, {
						method: 'GET',
						endpoint: `/transactions/card/${cardToken}`,
					}, {}, true, 1000);
				} else {
					const response = await marqetaApiRequest.call(this, {
						method: 'GET',
						endpoint: `/transactions/card/${cardToken}`,
						qs: { count: limit },
					});
					responseData = (response.data as IDataObject[]) || [response];
				}
				break;
			}

			case 'simulateAuth': {
				const cardToken = this.getNodeParameter('cardToken', i) as string;
				const amount = this.getNodeParameter('amount', i) as number;

				responseData = await marqetaSimulateRequest.call(this, '/authorization', {
					card_token: cardToken,
					amount,
					mid: 'SIMULATE_MID',
				});
				break;
			}

			case 'simulateClearing': {
				const originalTransactionToken = this.getNodeParameter('originalTransactionToken', i) as string;
				const amount = this.getNodeParameter('amount', i) as number;

				responseData = await marqetaSimulateRequest.call(this, '/clearing', {
					original_transaction_token: originalTransactionToken,
					amount,
				});
				break;
			}

			case 'simulateRefund': {
				const cardToken = this.getNodeParameter('cardToken', i) as string;
				const originalTransactionToken = this.getNodeParameter('originalTransactionToken', i) as string;
				const amount = this.getNodeParameter('amount', i) as number;

				responseData = await marqetaSimulateRequest.call(this, '/refund', {
					card_token: cardToken,
					original_transaction_token: originalTransactionToken,
					amount,
				});
				break;
			}

			case 'simulateReversal': {
				const originalTransactionToken = this.getNodeParameter('originalTransactionToken', i) as string;

				responseData = await marqetaSimulateRequest.call(this, '/reversal', {
					original_transaction_token: originalTransactionToken,
				});
				break;
			}

			default:
				throw new Error(`Unknown transaction operation: ${operation}`);
		}

		return Array.isArray(responseData)
			? responseData.map(item => ({ json: item }))
			: [{ json: responseData }];
	}

	private async executeKycOperation(
		this: IExecuteFunctions,
		operation: string,
		i: number,
	): Promise<INodeExecutionData[]> {
		let responseData: IDataObject | IDataObject[];

		switch (operation) {
			case 'perform': {
				const userToken = this.getNodeParameter('userToken', i) as string;
				responseData = await marqetaApiRequest.call(this, {
					method: 'POST',
					endpoint: '/kyc',
					body: { user_token: userToken },
					useIdempotencyKey: true,
				});
				break;
			}

			case 'getResult': {
				const kycToken = this.getNodeParameter('kycToken', i) as string;
				responseData = await marqetaApiRequest.call(this, {
					method: 'GET',
					endpoint: `/kyc/${kycToken}`,
				});
				break;
			}

			case 'getManyResults': {
				const userToken = this.getNodeParameter('userToken', i) as string;
				const response = await marqetaApiRequest.call(this, {
					method: 'GET',
					endpoint: `/kyc/user/${userToken}`,
				});
				responseData = (response.data as IDataObject[]) || [response];
				break;
			}

			case 'override': {
				const kycToken = this.getNodeParameter('kycToken', i) as string;
				const overrideStatus = this.getNodeParameter('overrideStatus', i) as string;
				const notes = this.getNodeParameter('notes', i, '') as string;

				responseData = await marqetaApiRequest.call(this, {
					method: 'PUT',
					endpoint: `/kyc/${kycToken}`,
					body: {
						manual_override: true,
						result: { code: overrideStatus },
						notes,
					},
				});
				break;
			}

			default:
				throw new Error(`Unknown KYC operation: ${operation}`);
		}

		return Array.isArray(responseData)
			? responseData.map(item => ({ json: item }))
			: [{ json: responseData }];
	}

	private async executeVelocityControlOperation(
		this: IExecuteFunctions,
		operation: string,
		i: number,
	): Promise<INodeExecutionData[]> {
		let responseData: IDataObject | IDataObject[];

		switch (operation) {
			case 'create': {
				const userToken = this.getNodeParameter('userToken', i, '') as string;
				const amountLimit = this.getNodeParameter('amountLimit', i) as number;
				const velocityWindow = this.getNodeParameter('velocityWindow', i) as string;
				const name = this.getNodeParameter('name', i, '') as string;

				const body: IDataObject = {
					amount_limit: amountLimit,
					velocity_window: velocityWindow,
					currency_code: 'USD',
					active: true,
				};

				if (userToken) body.association = { user_token: userToken };
				if (name) body.name = name;

				responseData = await marqetaApiRequest.call(this, {
					method: 'POST',
					endpoint: '/velocitycontrols',
					body,
					useIdempotencyKey: true,
				});
				break;
			}

			case 'get': {
				const velocityControlToken = this.getNodeParameter('velocityControlToken', i) as string;
				responseData = await marqetaApiRequest.call(this, {
					method: 'GET',
					endpoint: `/velocitycontrols/${velocityControlToken}`,
				});
				break;
			}

			case 'getMany': {
				const response = await marqetaApiRequest.call(this, {
					method: 'GET',
					endpoint: '/velocitycontrols',
				});
				responseData = (response.data as IDataObject[]) || [response];
				break;
			}

			case 'getAvailable': {
				const userToken = this.getNodeParameter('userToken', i) as string;
				responseData = await marqetaApiRequest.call(this, {
					method: 'GET',
					endpoint: `/velocitycontrols/user/${userToken}/available`,
				});
				break;
			}

			case 'update': {
				const velocityControlToken = this.getNodeParameter('velocityControlToken', i) as string;
				responseData = await marqetaApiRequest.call(this, {
					method: 'PUT',
					endpoint: `/velocitycontrols/${velocityControlToken}`,
					body: {},
				});
				break;
			}

			case 'delete': {
				const velocityControlToken = this.getNodeParameter('velocityControlToken', i) as string;
				responseData = await marqetaApiRequest.call(this, {
					method: 'PUT',
					endpoint: `/velocitycontrols/${velocityControlToken}`,
					body: { active: false },
				});
				break;
			}

			default:
				throw new Error(`Unknown velocity control operation: ${operation}`);
		}

		return Array.isArray(responseData)
			? responseData.map(item => ({ json: item }))
			: [{ json: responseData }];
	}

	private async executeDigitalWalletOperation(
		this: IExecuteFunctions,
		operation: string,
		i: number,
	): Promise<INodeExecutionData[]> {
		let responseData: IDataObject | IDataObject[];

		switch (operation) {
			case 'getToken': {
				const digitalWalletToken = this.getNodeParameter('digitalWalletToken', i) as string;
				responseData = await marqetaApiRequest.call(this, {
					method: 'GET',
					endpoint: `/digitalwallettokens/${digitalWalletToken}`,
				});
				break;
			}

			case 'getManyTokens': {
				const cardToken = this.getNodeParameter('cardToken', i) as string;
				const response = await marqetaApiRequest.call(this, {
					method: 'GET',
					endpoint: `/digitalwallettokens/card/${cardToken}`,
				});
				responseData = (response.data as IDataObject[]) || [response];
				break;
			}

			case 'transitionToken': {
				const digitalWalletToken = this.getNodeParameter('digitalWalletToken', i) as string;
				const tokenState = this.getNodeParameter('tokenState', i) as string;

				responseData = await marqetaApiRequest.call(this, {
					method: 'POST',
					endpoint: '/digitalwallettokentransitions',
					body: {
						digital_wallet_token_token: digitalWalletToken,
						state: tokenState,
						reason_code: '00',
					},
					useIdempotencyKey: true,
				});
				break;
			}

			default:
				throw new Error(`Unknown digital wallet operation: ${operation}`);
		}

		return Array.isArray(responseData)
			? responseData.map(item => ({ json: item }))
			: [{ json: responseData }];
	}

	private async executeWebhookOperation(
		this: IExecuteFunctions,
		operation: string,
		i: number,
	): Promise<INodeExecutionData[]> {
		let responseData: IDataObject | IDataObject[];

		switch (operation) {
			case 'create': {
				const url = this.getNodeParameter('url', i) as string;
				const name = this.getNodeParameter('name', i) as string;
				const events = this.getNodeParameter('events', i, ['*']) as string[];

				responseData = await marqetaApiRequest.call(this, {
					method: 'POST',
					endpoint: '/webhooks',
					body: {
						name,
						config: {
							url,
							basic_auth_username: '',
							basic_auth_password: '',
						},
						events,
						active: true,
					},
					useIdempotencyKey: true,
				});
				break;
			}

			case 'get': {
				const webhookToken = this.getNodeParameter('webhookToken', i) as string;
				responseData = await marqetaApiRequest.call(this, {
					method: 'GET',
					endpoint: `/webhooks/${webhookToken}`,
				});
				break;
			}

			case 'getMany': {
				const response = await marqetaApiRequest.call(this, {
					method: 'GET',
					endpoint: '/webhooks',
				});
				responseData = (response.data as IDataObject[]) || [response];
				break;
			}

			case 'update': {
				const webhookToken = this.getNodeParameter('webhookToken', i) as string;
				responseData = await marqetaApiRequest.call(this, {
					method: 'PUT',
					endpoint: `/webhooks/${webhookToken}`,
					body: {},
				});
				break;
			}

			case 'delete': {
				const webhookToken = this.getNodeParameter('webhookToken', i) as string;
				responseData = await marqetaApiRequest.call(this, {
					method: 'PUT',
					endpoint: `/webhooks/${webhookToken}`,
					body: { active: false },
				});
				break;
			}

			case 'test': {
				const webhookToken = this.getNodeParameter('webhookToken', i) as string;
				responseData = await marqetaApiRequest.call(this, {
					method: 'POST',
					endpoint: `/webhooks/${webhookToken}/ping`,
					body: {},
				});
				break;
			}

			default:
				throw new Error(`Unknown webhook operation: ${operation}`);
		}

		return Array.isArray(responseData)
			? responseData.map(item => ({ json: item }))
			: [{ json: responseData }];
	}

	private async executeBusinessOperation(
		this: IExecuteFunctions,
		operation: string,
		i: number,
	): Promise<INodeExecutionData[]> {
		let responseData: IDataObject | IDataObject[];

		switch (operation) {
			case 'create': {
				const businessName = this.getNodeParameter('businessName', i) as string;
				responseData = await marqetaApiRequest.call(this, {
					method: 'POST',
					endpoint: '/businesses',
					body: { business_name_legal: businessName },
					useIdempotencyKey: true,
				});
				break;
			}

			case 'get': {
				const businessToken = this.getNodeParameter('businessToken', i) as string;
				responseData = await marqetaApiRequest.call(this, {
					method: 'GET',
					endpoint: `/businesses/${businessToken}`,
				});
				break;
			}

			case 'getBalance': {
				const businessToken = this.getNodeParameter('businessToken', i) as string;
				responseData = await marqetaApiRequest.call(this, {
					method: 'GET',
					endpoint: `/balances/${businessToken}`,
				});
				break;
			}

			case 'getMany': {
				const response = await marqetaApiRequest.call(this, {
					method: 'GET',
					endpoint: '/businesses',
				});
				responseData = (response.data as IDataObject[]) || [response];
				break;
			}

			case 'update': {
				const businessToken = this.getNodeParameter('businessToken', i) as string;
				responseData = await marqetaApiRequest.call(this, {
					method: 'PUT',
					endpoint: `/businesses/${businessToken}`,
					body: {},
				});
				break;
			}

			case 'transition': {
				const businessToken = this.getNodeParameter('businessToken', i) as string;
				responseData = await marqetaApiRequest.call(this, {
					method: 'POST',
					endpoint: '/businesstransitions',
					body: {
						business_token: businessToken,
						status: 'ACTIVE',
						reason_code: '00',
					},
					useIdempotencyKey: true,
				});
				break;
			}

			default:
				throw new Error(`Unknown business operation: ${operation}`);
		}

		return Array.isArray(responseData)
			? responseData.map(item => ({ json: item }))
			: [{ json: responseData }];
	}

	private async executeUtilityOperation(
		this: IExecuteFunctions,
		operation: string,
		i: number,
	): Promise<INodeExecutionData[]> {
		let responseData: IDataObject;

		switch (operation) {
			case 'ping': {
				responseData = await marqetaApiRequest.call(this, {
					method: 'GET',
					endpoint: '/ping',
				});
				break;
			}

			case 'getBinDetails': {
				const bin = this.getNodeParameter('bin', i) as string;
				responseData = await marqetaApiRequest.call(this, {
					method: 'GET',
					endpoint: `/bintable/${bin}`,
				});
				break;
			}

			case 'validateCardNumber': {
				const cardNumber = this.getNodeParameter('cardNumber', i) as string;
				// Perform Luhn validation locally
				const isValid = this.luhnCheck(cardNumber);
				responseData = {
					valid: isValid,
					card_number_masked: cardNumber.replace(/\d(?=\d{4})/g, '*'),
				};
				break;
			}

			default:
				throw new Error(`Unknown utility operation: ${operation}`);
		}

		return [{ json: responseData }];
	}

	private luhnCheck(cardNumber: string): boolean {
		const digits = cardNumber.replace(/\D/g, '');
		if (digits.length < 13 || digits.length > 19) return false;

		let sum = 0;
		let isEven = false;

		for (let i = digits.length - 1; i >= 0; i--) {
			let digit = parseInt(digits[i], 10);
			if (isEven) {
				digit *= 2;
				if (digit > 9) digit -= 9;
			}
			sum += digit;
			isEven = !isEven;
		}

		return sum % 10 === 0;
	}
}
