/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { marqetaApiRequest, marqetaApiRequestPaginated } from '../../transport/marqetaApi';

export async function executeCardOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'create': {
			const userToken = this.getNodeParameter('userToken', i) as string;
			const cardProductToken = this.getNodeParameter('cardProductToken', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

			const body: IDataObject = {
				user_token: userToken,
				card_product_token: cardProductToken,
			};

			if (additionalFields.token) body.token = additionalFields.token;
			if (additionalFields.expedite) body.expedite = additionalFields.expedite;
			if (additionalFields.fulfillmentStatus) {
				body.fulfillment = { card_fulfillment_reason: additionalFields.fulfillmentStatus };
			}
			if (additionalFields.reissuePanFromCardToken) {
				body.reissue_pan_from_card_token = additionalFields.reissuePanFromCardToken;
			}

			responseData = await marqetaApiRequest.call(this, {
				method: 'POST',
				endpoint: '/cards',
				body,
				useIdempotencyKey: true,
			});
			break;
		}

		case 'get': {
			const cardToken = this.getNodeParameter('cardToken', i) as string;
			responseData = await marqetaApiRequest.call(this, {
				method: 'GET',
				endpoint: `/cards/${cardToken}`,
			});
			break;
		}

		case 'getByBarcode': {
			const barcode = this.getNodeParameter('barcode', i) as string;
			responseData = await marqetaApiRequest.call(this, {
				method: 'GET',
				endpoint: `/cards/barcode/${barcode}`,
			});
			break;
		}

		case 'getMany': {
			const userToken = this.getNodeParameter('userToken', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
			const limit = this.getNodeParameter('limit', i, 25) as number;

			if (returnAll) {
				responseData = await marqetaApiRequestPaginated.call(this, {
					method: 'GET',
					endpoint: `/cards/user/${userToken}`,
				}, {}, true, 1000);
			} else {
				const response = await marqetaApiRequest.call(this, {
					method: 'GET',
					endpoint: `/cards/user/${userToken}`,
					qs: { count: limit },
				});
				responseData = (response.data as IDataObject[]) || [response];
			}
			break;
		}

		case 'activate': {
			const cardToken = this.getNodeParameter('cardToken', i) as string;
			responseData = await marqetaApiRequest.call(this, {
				method: 'POST',
				endpoint: '/cardtransitions',
				body: {
					card_token: cardToken,
					state: 'ACTIVE',
					reason_code: '00',
					channel: 'API',
				},
				useIdempotencyKey: true,
			});
			break;
		}

		case 'transition': {
			const cardToken = this.getNodeParameter('cardToken', i) as string;
			const newState = this.getNodeParameter('newState', i) as string;
			const transitionReason = this.getNodeParameter('transitionReason', i, 'NEW') as string;

			responseData = await marqetaApiRequest.call(this, {
				method: 'POST',
				endpoint: '/cardtransitions',
				body: {
					card_token: cardToken,
					state: newState,
					reason_code: transitionReason,
					channel: 'API',
				},
				useIdempotencyKey: true,
			});
			break;
		}

		case 'reportLostStolen': {
			const cardToken = this.getNodeParameter('cardToken', i) as string;
			const reportType = this.getNodeParameter('reportType', i) as string;

			responseData = await marqetaApiRequest.call(this, {
				method: 'POST',
				endpoint: '/cardtransitions',
				body: {
					card_token: cardToken,
					state: 'SUSPENDED',
					reason_code: reportType === 'STOLEN' ? '02' : '01',
					channel: 'API',
				},
				useIdempotencyKey: true,
			});
			break;
		}

		case 'revealPan': {
			const cardToken = this.getNodeParameter('cardToken', i) as string;
			responseData = await marqetaApiRequest.call(this, {
				method: 'GET',
				endpoint: `/cards/${cardToken}/showpan`,
			});
			break;
		}

		case 'getCvv': {
			const cardToken = this.getNodeParameter('cardToken', i) as string;
			responseData = await marqetaApiRequest.call(this, {
				method: 'GET',
				endpoint: `/cards/${cardToken}/showcvv`,
			});
			break;
		}

		case 'getPin': {
			const cardToken = this.getNodeParameter('cardToken', i) as string;
			responseData = await marqetaApiRequest.call(this, {
				method: 'GET',
				endpoint: `/pins/controltoken`,
				qs: { card_token: cardToken },
			});
			break;
		}

		case 'setPin': {
			const cardToken = this.getNodeParameter('cardToken', i) as string;
			const pin = this.getNodeParameter('pin', i) as string;

			// First get control token
			const controlTokenResponse = await marqetaApiRequest.call(this, {
				method: 'POST',
				endpoint: '/pins/controltoken',
				body: { card_token: cardToken },
			});

			// Then set PIN
			responseData = await marqetaApiRequest.call(this, {
				method: 'PUT',
				endpoint: '/pins',
				body: {
					control_token: controlTokenResponse.control_token,
					pin,
				},
			});
			break;
		}

		case 'getTransitions': {
			const cardToken = this.getNodeParameter('cardToken', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
			const limit = this.getNodeParameter('limit', i, 25) as number;

			if (returnAll) {
				responseData = await marqetaApiRequestPaginated.call(this, {
					method: 'GET',
					endpoint: `/cardtransitions/card/${cardToken}`,
				}, {}, true, 1000);
			} else {
				const response = await marqetaApiRequest.call(this, {
					method: 'GET',
					endpoint: `/cardtransitions/card/${cardToken}`,
					qs: { count: limit },
				});
				responseData = (response.data as IDataObject[]) || [response];
			}
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return Array.isArray(responseData)
		? responseData.map(item => ({ json: item }))
		: [{ json: responseData }];
}
