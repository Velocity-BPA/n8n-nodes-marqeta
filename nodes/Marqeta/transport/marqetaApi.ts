/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IHookFunctions,
	IWebhookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	IDataObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { v4 as uuidv4 } from 'uuid';
import { getBaseUrl, type MarqetaCredentials, parseCredentials } from '../utils/authUtils';
import { formatMarqetaError } from '../constants/errorCodes';
import { sanitizeForLogging } from '../utils/pciUtils';

/**
 * Marqeta API Transport Layer
 * Handles all HTTP communication with the Marqeta Core API
 */

export interface MarqetaApiOptions {
	method: IHttpRequestMethods;
	endpoint: string;
	body?: IDataObject;
	qs?: IDataObject;
	headers?: IDataObject;
	useIdempotencyKey?: boolean;
	timeout?: number;
}

export interface MarqetaListResponse<T> {
	count: number;
	start_index: number;
	end_index: number;
	is_more: boolean;
	data: T[];
}

export interface MarqetaPaginationOptions {
	count?: number;
	start_index?: number;
	sort_by?: string;
	fields?: string[];
}

type ExecutionContext = 
	| IExecuteFunctions 
	| ILoadOptionsFunctions 
	| IHookFunctions 
	| IWebhookFunctions;

/**
 * Make an API request to Marqeta
 */
export async function marqetaApiRequest(
	this: ExecutionContext,
	options: MarqetaApiOptions,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('marqetaApi') as unknown as MarqetaCredentials;
	const baseUrl = getBaseUrl(credentials);
	
	const requestOptions: IHttpRequestOptions = {
		method: options.method,
		url: `${baseUrl}${options.endpoint}`,
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			...(options.headers || {}),
		},
		auth: {
			username: credentials.applicationToken,
			password: credentials.adminAccessToken,
		},
		json: true,
		returnFullResponse: false,
		timeout: options.timeout || 30000,
	};
	
	// Add idempotency key for POST/PUT requests if requested
	if (options.useIdempotencyKey && ['POST', 'PUT'].includes(options.method)) {
		requestOptions.headers = {
			...requestOptions.headers,
			'X-Idempotency-Key': uuidv4(),
		};
	}
	
	if (options.body && Object.keys(options.body).length > 0) {
		requestOptions.body = options.body;
	}
	
	if (options.qs && Object.keys(options.qs).length > 0) {
		requestOptions.qs = options.qs;
	}
	
	try {
		const response = await this.helpers.httpRequest(requestOptions);
		return response as IDataObject;
	} catch (error: unknown) {
		const err = error as { message?: string; statusCode?: number; response?: { body?: { error_code?: string; error_message?: string } } };
		
		const statusCode = err.statusCode || 500;
		const errorCode = err.response?.body?.error_code;
		const errorMessage = err.response?.body?.error_message || err.message || 'Unknown error';
		
		const formattedMessage = formatMarqetaError(statusCode, errorCode, errorMessage);
		
		throw new NodeApiError(this.getNode(), {
			message: formattedMessage,
			httpCode: String(statusCode),
		} as unknown as Error);
	}
}

/**
 * Make a paginated API request to Marqeta
 * Handles automatic pagination for list endpoints
 */
export async function marqetaApiRequestPaginated<T>(
	this: ExecutionContext,
	options: MarqetaApiOptions,
	paginationOptions: MarqetaPaginationOptions = {},
	returnAll = false,
	limit = 100,
): Promise<T[]> {
	const results: T[] = [];
	let startIndex = paginationOptions.start_index || 0;
	const pageSize = paginationOptions.count || 25;
	
	const qs: IDataObject = {
		...options.qs,
		count: pageSize,
	};
	
	if (paginationOptions.sort_by) {
		qs.sort_by = paginationOptions.sort_by;
	}
	
	if (paginationOptions.fields && paginationOptions.fields.length > 0) {
		qs.fields = paginationOptions.fields.join(',');
	}
	
	do {
		qs.start_index = startIndex;
		
		const response = await marqetaApiRequest.call(this, {
			...options,
			qs,
		}) as unknown as MarqetaListResponse<T>;
		
		if (response.data && Array.isArray(response.data)) {
			results.push(...response.data);
		}
		
		if (!returnAll || !response.is_more || results.length >= limit) {
			break;
		}
		
		startIndex = response.end_index + 1;
	} while (true);
	
	return returnAll ? results.slice(0, limit) : results;
}

/**
 * Make a request with automatic retry on rate limit
 */
export async function marqetaApiRequestWithRetry(
	this: ExecutionContext,
	options: MarqetaApiOptions,
	maxRetries = 3,
	initialDelay = 1000,
): Promise<IDataObject> {
	let lastError: Error | null = null;
	
	for (let attempt = 0; attempt < maxRetries; attempt++) {
		try {
			return await marqetaApiRequest.call(this, options);
		} catch (error) {
			lastError = error as Error;
			
			// Check if it's a rate limit error
			if ((error as { httpCode?: string }).httpCode === '429') {
				const delay = initialDelay * Math.pow(2, attempt);
				await new Promise(resolve => setTimeout(resolve, delay));
				continue;
			}
			
			// Re-throw non-rate-limit errors
			throw error;
		}
	}
	
	throw lastError || new Error('Max retries exceeded');
}

/**
 * Build query string parameters for list operations
 */
export function buildListQueryParams(
	params: IDataObject,
	additionalParams?: MarqetaPaginationOptions,
): IDataObject {
	const qs: IDataObject = {};
	
	// Standard pagination params
	if (additionalParams?.count) {
		qs.count = additionalParams.count;
	}
	if (additionalParams?.start_index !== undefined) {
		qs.start_index = additionalParams.start_index;
	}
	if (additionalParams?.sort_by) {
		qs.sort_by = additionalParams.sort_by;
	}
	if (additionalParams?.fields && additionalParams.fields.length > 0) {
		qs.fields = additionalParams.fields.join(',');
	}
	
	// Add other params
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== null && value !== '') {
			qs[key] = value;
		}
	}
	
	return qs;
}

/**
 * Handle simulation endpoints (sandbox only)
 */
export async function marqetaSimulateRequest(
	this: ExecutionContext,
	endpoint: string,
	body: IDataObject,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('marqetaApi') as unknown as MarqetaCredentials;
	
	if (credentials.environment === 'production') {
		throw new Error('Simulation endpoints are only available in sandbox environment');
	}
	
	return marqetaApiRequest.call(this, {
		method: 'POST',
		endpoint: `/simulate${endpoint}`,
		body,
		useIdempotencyKey: true,
	});
}

/**
 * Log API request for debugging (with sensitive data masked)
 */
export function logApiRequest(
	method: string,
	endpoint: string,
	body?: IDataObject,
): void {
	const sanitizedBody = body ? sanitizeForLogging(body as Record<string, unknown>) : undefined;
	console.log(`[Marqeta API] ${method} ${endpoint}`, sanitizedBody ? JSON.stringify(sanitizedBody) : '');
}
