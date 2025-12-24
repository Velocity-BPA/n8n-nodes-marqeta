/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { ICredentialDataDecryptedObject } from 'n8n-workflow';
import { MARQETA_ENVIRONMENTS } from '../constants/endpoints';

/**
 * Authentication and credential utilities for Marqeta API
 */

export interface MarqetaCredentials {
	environment: 'sandbox' | 'production' | 'custom';
	customBaseUrl?: string;
	applicationToken: string;
	adminAccessToken: string;
	webhookSignatureKey?: string;
}

export interface MarqetaProgramCredentials {
	programShortCode?: string;
	programFundingSourceToken?: string;
	defaultCardProductToken?: string;
	jitFundingGatewayToken?: string;
	defaultVelocityControlToken?: string;
}

/**
 * Get the base URL for API calls based on environment
 */
export function getBaseUrl(credentials: MarqetaCredentials): string {
	if (credentials.environment === 'custom' && credentials.customBaseUrl) {
		return credentials.customBaseUrl.replace(/\/$/, '');
	}
	return MARQETA_ENVIRONMENTS[credentials.environment] || MARQETA_ENVIRONMENTS.sandbox;
}

/**
 * Create Basic Auth header value
 */
export function createBasicAuthHeader(credentials: MarqetaCredentials): string {
	const auth = Buffer.from(
		`${credentials.applicationToken}:${credentials.adminAccessToken}`,
	).toString('base64');
	return `Basic ${auth}`;
}

/**
 * Parse credentials from n8n credential object
 */
export function parseCredentials(
	credentialData: ICredentialDataDecryptedObject,
): MarqetaCredentials {
	return {
		environment: (credentialData.environment as 'sandbox' | 'production' | 'custom') || 'sandbox',
		customBaseUrl: credentialData.customBaseUrl as string | undefined,
		applicationToken: credentialData.applicationToken as string,
		adminAccessToken: credentialData.adminAccessToken as string,
		webhookSignatureKey: credentialData.webhookSignatureKey as string | undefined,
	};
}

/**
 * Parse program credentials from n8n credential object
 */
export function parseProgramCredentials(
	credentialData: ICredentialDataDecryptedObject,
): MarqetaProgramCredentials {
	return {
		programShortCode: credentialData.programShortCode as string | undefined,
		programFundingSourceToken: credentialData.programFundingSourceToken as string | undefined,
		defaultCardProductToken: credentialData.defaultCardProductToken as string | undefined,
		jitFundingGatewayToken: credentialData.jitFundingGatewayToken as string | undefined,
		defaultVelocityControlToken: credentialData.defaultVelocityControlToken as string | undefined,
	};
}

/**
 * Validate that required credentials are present
 */
export function validateCredentials(credentials: MarqetaCredentials): void {
	if (!credentials.applicationToken) {
		throw new Error('Application Token is required');
	}
	if (!credentials.adminAccessToken) {
		throw new Error('Admin Access Token is required');
	}
	if (credentials.environment === 'custom' && !credentials.customBaseUrl) {
		throw new Error('Custom Base URL is required when using custom environment');
	}
}
