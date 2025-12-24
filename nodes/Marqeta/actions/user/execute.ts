/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
} from 'n8n-workflow';
import { marqetaApiRequest, marqetaApiRequestPaginated } from '../../transport/marqetaApi';

/**
 * Execute user operations
 */
export async function executeUserOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[];
	
	switch (operation) {
		case 'create': {
			const firstName = this.getNodeParameter('firstName', i) as string;
			const lastName = this.getNodeParameter('lastName', i) as string;
			const email = this.getNodeParameter('email', i, '') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			
			const body: IDataObject = {
				first_name: firstName,
				last_name: lastName,
			};
			
			if (email) {
				body.email = email;
			}
			
			if (additionalFields.token) {
				body.token = additionalFields.token;
			}
			if (additionalFields.phone) {
				body.phone = additionalFields.phone;
			}
			if (additionalFields.birthDate) {
				body.birth_date = additionalFields.birthDate;
			}
			if (additionalFields.ssn) {
				body.ssn = additionalFields.ssn;
			}
			if (additionalFields.idNumber) {
				body.identifications = [{
					type: 'SSN',
					value: additionalFields.idNumber,
				}];
			}
			if (additionalFields.nationality) {
				body.nationality = additionalFields.nationality;
			}
			if (additionalFields.company) {
				body.company = additionalFields.company;
			}
			if (additionalFields.parentToken) {
				body.parent_token = additionalFields.parentToken;
			}
			if (additionalFields.usesParentAccount !== undefined) {
				body.uses_parent_account = additionalFields.usesParentAccount;
			}
			if (additionalFields.ipAddress) {
				body.ip_address = additionalFields.ipAddress;
			}
			
			// Build address object
			if (additionalFields.address1 || additionalFields.city || additionalFields.state) {
				body.address1 = additionalFields.address1 || '';
				if (additionalFields.address2) {
					body.address2 = additionalFields.address2;
				}
				body.city = additionalFields.city || '';
				body.state = additionalFields.state || '';
				body.postal_code = additionalFields.postalCode || '';
				body.country = additionalFields.country || 'US';
			}
			
			if (additionalFields.metadata) {
				body.metadata = typeof additionalFields.metadata === 'string'
					? JSON.parse(additionalFields.metadata)
					: additionalFields.metadata;
			}
			
			responseData = await marqetaApiRequest.call(this, {
				method: 'POST',
				endpoint: '/users',
				body,
				useIdempotencyKey: true,
			});
			break;
		}
		
		case 'get': {
			const userToken = this.getNodeParameter('userToken', i) as string;
			
			responseData = await marqetaApiRequest.call(this, {
				method: 'GET',
				endpoint: `/users/${userToken}`,
			});
			break;
		}
		
		case 'getByEmail': {
			const email = this.getNodeParameter('email', i) as string;
			
			responseData = await marqetaApiRequest.call(this, {
				method: 'GET',
				endpoint: '/users/lookup',
				qs: { email },
			});
			break;
		}
		
		case 'getByPhone': {
			const phone = this.getNodeParameter('phone', i) as string;
			
			responseData = await marqetaApiRequest.call(this, {
				method: 'GET',
				endpoint: '/users/lookup',
				qs: { phone },
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
		
		case 'getNotes': {
			const userToken = this.getNodeParameter('userToken', i) as string;
			
			responseData = await marqetaApiRequest.call(this, {
				method: 'GET',
				endpoint: `/users/${userToken}/notes`,
			});
			break;
		}
		
		case 'getTransitions': {
			const userToken = this.getNodeParameter('userToken', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
			const limit = this.getNodeParameter('limit', i, 25) as number;
			
			if (returnAll) {
				responseData = await marqetaApiRequestPaginated.call(
					this,
					{
						method: 'GET',
						endpoint: '/usertransitions/user/' + userToken,
					},
					{},
					true,
					1000,
				);
			} else {
				const response = await marqetaApiRequest.call(this, {
					method: 'GET',
					endpoint: '/usertransitions/user/' + userToken,
					qs: { count: limit },
				});
				responseData = (response.data as IDataObject[]) || [response];
			}
			break;
		}
		
		case 'getSsn': {
			const userToken = this.getNodeParameter('userToken', i) as string;
			const fullSsn = this.getNodeParameter('fullSsn', i, false) as boolean;
			
			responseData = await marqetaApiRequest.call(this, {
				method: 'GET',
				endpoint: `/users/${userToken}/ssn`,
				qs: fullSsn ? { full_ssn: true } : {},
			});
			break;
		}
		
		case 'transition': {
			const userToken = this.getNodeParameter('userToken', i) as string;
			const newStatus = this.getNodeParameter('newStatus', i) as string;
			const reasonCode = this.getNodeParameter('reasonCode', i, '00') as string;
			const reason = this.getNodeParameter('reason', i, '') as string;
			
			const body: IDataObject = {
				user_token: userToken,
				status: newStatus,
				reason_code: reasonCode,
			};
			
			if (reason) {
				body.reason = reason;
			}
			
			responseData = await marqetaApiRequest.call(this, {
				method: 'POST',
				endpoint: '/usertransitions',
				body,
				useIdempotencyKey: true,
			});
			break;
		}
		
		case 'update': {
			const userToken = this.getNodeParameter('userToken', i) as string;
			const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
			
			const body: IDataObject = {};
			
			if (updateFields.firstName) {
				body.first_name = updateFields.firstName;
			}
			if (updateFields.lastName) {
				body.last_name = updateFields.lastName;
			}
			if (updateFields.email) {
				body.email = updateFields.email;
			}
			if (updateFields.phone) {
				body.phone = updateFields.phone;
			}
			if (updateFields.address1) {
				body.address1 = updateFields.address1;
			}
			if (updateFields.city) {
				body.city = updateFields.city;
			}
			if (updateFields.state) {
				body.state = updateFields.state;
			}
			if (updateFields.postalCode) {
				body.postal_code = updateFields.postalCode;
			}
			if (updateFields.country) {
				body.country = updateFields.country;
			}
			if (updateFields.metadata) {
				body.metadata = typeof updateFields.metadata === 'string'
					? JSON.parse(updateFields.metadata)
					: updateFields.metadata;
			}
			
			responseData = await marqetaApiRequest.call(this, {
				method: 'PUT',
				endpoint: `/users/${userToken}`,
				body,
			});
			break;
		}
		
		case 'getMany': {
			const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
			const limit = this.getNodeParameter('limit', i, 25) as number;
			
			if (returnAll) {
				responseData = await marqetaApiRequestPaginated.call(
					this,
					{
						method: 'GET',
						endpoint: '/users',
					},
					{},
					true,
					1000,
				);
			} else {
				const response = await marqetaApiRequest.call(this, {
					method: 'GET',
					endpoint: '/users',
					qs: { count: limit },
				});
				responseData = (response.data as IDataObject[]) || [response];
			}
			break;
		}
		
		case 'search': {
			const searchQuery = this.getNodeParameter('searchQuery', i, '') as string;
			const searchOptions = this.getNodeParameter('searchOptions', i, {}) as IDataObject;
			const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
			const limit = this.getNodeParameter('limit', i, 25) as number;
			
			const qs: IDataObject = {};
			
			if (searchQuery) {
				qs.search_type = 'general';
				qs.fields = searchQuery;
			}
			if (searchOptions.firstName) {
				qs.first_name = searchOptions.firstName;
			}
			if (searchOptions.lastName) {
				qs.last_name = searchOptions.lastName;
			}
			if (searchOptions.email) {
				qs.email = searchOptions.email;
			}
			if (searchOptions.status) {
				qs.status = searchOptions.status;
			}
			
			if (returnAll) {
				responseData = await marqetaApiRequestPaginated.call(
					this,
					{
						method: 'GET',
						endpoint: '/users',
						qs,
					},
					{},
					true,
					1000,
				);
			} else {
				qs.count = limit;
				const response = await marqetaApiRequest.call(this, {
					method: 'GET',
					endpoint: '/users',
					qs,
				});
				responseData = (response.data as IDataObject[]) || [response];
			}
			break;
		}
		
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
	
	const executionData = Array.isArray(responseData)
		? responseData.map(item => ({ json: item }))
		: [{ json: responseData }];
	
	return executionData;
}
